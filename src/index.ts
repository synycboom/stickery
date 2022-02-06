import {} from '@dapplets/dapplet-extension';
import ICON_IMAGE from './icons/icon.png';

@Injectable
export default class TwitterFeature {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any,  @typescript-eslint/explicit-module-boundary-types
  @Inject('twitter-adapter.dapplet-base.eth') public adapter: any;
  @Inject('stickery-adapter.dapplet-base.eth') public stickeryAdapter: any;
  private _overlay: any;
  private initialized = false;
  private draggableArea: HTMLElement = null;
  private draggableItem: HTMLElement = null;
  private enteredItem: Element = null;
  private isDraggableItemAppended = false;

  activate(): void {
    this.initializeDragAndDrop();

    if (!this._overlay) {
      this._overlay = Core.overlay({ name: 'stickery', title: 'Stickery' }).listen({
        connectWallet: async () => {
          try {
            const wallet = await Core.wallet({ type: 'ethereum', network: 'goerli' });
            await wallet.connect();
            const account = await new Promise((res) =>
              wallet.sendAndListen('eth_accounts', [], { result: (_, { data }) => res(data[0]) }),
            );
            this._overlay.send('connectWallet_done', account);
          } catch (err) {
            this._overlay.send('connectWallet_undone', err);
          }
        },
        disconnectWallet: async () => {
          try {
            const wallet = await Core.wallet({ type: 'ethereum', network: 'goerli' });
            await wallet.disconnect();
            this._overlay.send('disconnectWallet_done');
          } catch (err) {
            this._overlay.send('disconnectWallet_undone', err);
          }
        },
        isWalletConnected: async () => {
          try {
            const wallet = await Core.wallet({ type: 'ethereum', network: 'goerli' });
            const isWalletConnected = await wallet.isConnected();
            this._overlay.send('isWalletConnected_done', isWalletConnected);
          } catch (err) {
            this._overlay.send('isWalletConnected_undone', err);
          }
        },
        signMessage: async (_: any, payload: any) => {
          const { account, message } = payload.message;

          try {
            const wallet = await Core.wallet({ type: 'ethereum', network: 'goerli' });
            const hash = await new Promise((resolve, reject) =>
              wallet.sendAndListen('personal_sign', [account, message], {
                rejected: () => reject(),
                result: (_, { data }) => resolve(data),
              }),
            );
            this._overlay.send('signMessage_done', hash);
          } catch (err) {
            this._overlay.send('signMessage_undone', err);
          }
        },
        mouseDown: (_: any, payload: any) => {
          const {
            message: { stickerId, url },
          } = payload;

          this.showDraggableArea();
          this.showDraggableItem(url, stickerId);
        },
      });
    }

    Core.onAction(() => this.openOverlay());

    const { button } = this.adapter.exports;

    this.adapter.attachConfig({
      POST: (ctx: any) =>
        button({
          initial: 'DEFAULT',
          DEFAULT: {
            label: 'Stickery',
            img: ICON_IMAGE,
            exec: () => {
              this.openOverlay(ctx);
            },
          },
        }),
    });

    const { dropPoints } = this.stickeryAdapter.exports;

    this.stickeryAdapter.attachConfig({
      TWITTER_DROP_POINTS: (ctx: any) =>
        dropPoints({
          initial: 'DEFAULT',
          DEFAULT: {
            init: async (ctx, state) => {
              // TODO:
            },
          },
        }),
    });
  }

  async openOverlay(props?: any): Promise<void> {
    this._overlay.send('data', props);
  }

  showDraggableArea() {
    const overylay = document.querySelector<HTMLElement>('.dapplets-overlay-frame');
    const zIndex = parseInt(window.getComputedStyle(overylay).zIndex) + 1;

    this.draggableArea = document.createElement('div');
    this.draggableArea.style.position = 'fixed';
    this.draggableArea.style.left = `${overylay.offsetLeft}px`;
    this.draggableArea.style.top = `${overylay.offsetTop}px`;
    this.draggableArea.style.height = '100vh';
    this.draggableArea.style.width = `${overylay.offsetWidth}px`;
    this.draggableArea.style.zIndex = zIndex.toString();

    document.body.appendChild(this.draggableArea);
  }

  hideDraggableArea() {
    document.body.removeChild(this.draggableArea);
    this.draggableArea = null;
  }

  showDraggableItem(url: string, stickerId: string) {
    const loading = document.createElement('div');
    loading.style.position = 'absolute';
    loading.style.left = '50%';
    loading.style.top = '50%';
    loading.style.transform = 'translate(-50%, -50%)';
    loading.innerText = 'Loading...';

    const image = document.createElement('img');
    image.src = url;
    image.style.width = '100%';
    image.style.height = '100%';
    image.style.zIndex = '1';
    image.onload = () => {
      this.draggableItem.removeChild(loading);
    };

    const zIndex = parseInt(window.getComputedStyle(this.draggableArea).zIndex) + 1;
    this.draggableItem = document.createElement('div');
    this.draggableItem.style.position = 'fixed';
    this.draggableItem.style.zIndex = '2147483647';
    this.draggableItem.style.transform = 'translate(-50%, -50%)';
    this.draggableItem.style.height = '100px';
    this.draggableItem.style.width = '100px';
    this.draggableItem.style.zIndex = zIndex.toString();
    this.draggableItem.dataset.stickerId = stickerId;
    this.draggableItem.appendChild(loading);
    this.draggableItem.appendChild(image);
  }

  hideDraggableItem() {
    if (this.isDraggableItemAppended) {
      document.body.removeChild(this.draggableItem);
      this.isDraggableItemAppended = false;
    }

    this.draggableItem = null;
  }

  initializeDragAndDrop() {
    if (!this.initialized) {
      this.initialized = true;

      document.body.addEventListener('mouseup', (e) => {
        if (this.draggableArea) {
          this.hideDraggableArea();
        }

        if (this.enteredItem) {
          this.enteredItem.classList.add('placed');
          this.enteredItem.appendChild(this.draggableItem.firstChild);
          this.enteredItem = null;
        }

        if (this.draggableItem) {
          this.hideDraggableItem();
        }
      });

      document.body.addEventListener(
        'mousemove',
        (e) => {
          if (!this.draggableItem) {
            return;
          }
          if (!this.isDraggableItemAppended) {
            this.isDraggableItemAppended = true;
            document.body.appendChild(this.draggableItem);
          }

          this.draggableItem.style.left = `${e.clientX}px`;
          this.draggableItem.style.top = `${e.clientY}px`;

          this.showEnteredItem(e.clientX, e.clientY);
        },
        { passive: true },
      );
    }
  }

  showEnteredItem(mousePositionX: number, mousePositionY: number) {
    this.enteredItem = null;

    const dropableElements = Array.from(
      document.getElementsByClassName('stickery-image-drop-point'),
    );
    const dropableIndex = dropableElements.findIndex((elem) => {
      const rect = elem.getBoundingClientRect();
      if (elem.classList.contains('entered')) {
        elem.classList.remove('entered');
      }
      return (
        mousePositionX >= rect.left &&
        mousePositionX <= rect.right &&
        mousePositionY >= rect.top &&
        mousePositionY <= rect.bottom &&
        !elem.classList.contains('placed')
      );
    });

    if (dropableIndex > -1) {
      const enteredElement = dropableElements[dropableIndex];
      enteredElement.classList.add('entered');
      this.enteredItem = enteredElement;
    }
  }
}
