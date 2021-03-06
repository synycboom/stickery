import tingle from 'tingle.js';
import toastr from 'toastr';
import tingleCSS from 'tingle.js/dist/tingle.min.css';
import toastrCSS from 'toastr/build/toastr.min.css';
import { } from '@dapplets/dapplet-extension';
import ICON_IMAGE from './icons/icon.png';

const DROP_POINTS_ID = 'dropPoints';

type StickValue = {
  stickerId: string;
  nftTokenAddress: string;
  nftTokenId: string;
  imageUrl: string;
};

type DraggingInfo = {
  postId: string;
  location: string;
  stickerId: string;
  nftTokenAddress: string;
  nftTokenId: string;
  imageUrl: string;
};

const tingleStyl = document.createElement('style');
const toastrStyle = document.createElement('style');
const indexStyle = document.createElement('style');

tingleStyl.innerHTML = tingleCSS;
toastrStyle.innerHTML = toastrCSS;
indexStyle.innerHTML = `
  .tingle-header-text {
    font-size: 1.5em;
    font-weight: bold;
  }

  .tingle-btn {
    border-radius: 5px;
  }

  .tingle-modal-box__footer {
    display: block;
  }

  .tingle-modal {
    background: rgb(0 0 0 / 0%);
    font-family: TwitterChirp, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
  }

  .tingle-modal-box {
    max-width: 600px;
  }
`;

document.head.appendChild(tingleStyl);
document.head.appendChild(toastrStyle);
document.head.appendChild(indexStyle);

@Injectable
export default class StickeryFeature {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any,  @typescript-eslint/explicit-module-boundary-types
  @Inject('twitter-adapter.dapplet-base.eth') public adapter: any;
  @Inject('instagram-adapter.dapplet-base.eth') public instagramAdapter: any;
  @Inject('stickery-adapter.dapplet-base.eth') public stickeryAdapter: any;
  private _overlay: any;
  private initialized = false;
  private draggableArea: HTMLElement = null;
  private draggableItem: HTMLElement = null;
  private draggingInfo: DraggingInfo | null = null;
  private isDraggableItemAppended = false;
  private stickedItemsMap: Record<string, Record<string, StickValue>> = {};
  private fetchingQueue: string[] = [];
  private isLoggedIn: boolean = false;
  private $: any;
  private ctxMap: Record<string, any> = {};

  activate(): void {
    const platform = this.getPlatform();
    this.initializeDragAndDrop();
    this.initializeOverlay();

    Core.onAction(() => this.sendOpeningOverlay());

    if (platform === 'twitter') {
      const { button } = this.adapter.exports;

      this.adapter.attachConfig({
        POST: (ctx: any) =>
          button({
            initial: 'DEFAULT',
            DEFAULT: {
              label: 'Stickery',
              img: ICON_IMAGE,
              exec: () => {
                this.sendOpeningOverlay(ctx);
              },
            },
          }),
      });
    }

    if (platform === 'instagram') {
      const { button } = this.instagramAdapter.exports;
      this.instagramAdapter.attachConfig({
        POST: (ctx: any) => button({
          initial: 'DEFAULT',
          DEFAULT: {
            label: 'Stickery',
            img: ICON_IMAGE,
            exec: () => {
              this.sendOpeningOverlay(ctx);
            },
          }
        }),
      });
    }

    const dropPointOptions = {
      id: DROP_POINTS_ID,
      initial: 'DEFAULT',
      DEFAULT: {
        stickedItemsMap: {},
        areDroppointsVisible: false,
        init: async (ctx) => {
          const postId = ctx.id;
          this.ctxMap[postId] = ctx;
          await this.sendGettingPosts([postId]);
        },
        delete: async (ctx, location) => {
          const modal = new tingle.modal({
            footer: true,
            stickyFooter: false,
            closeMethods: ['overlay', 'button', 'escape'],
            closeLabel: 'Close',
          });

          modal.setContent('<h2 class="tingle-header-text">Are you sure you want to remove a sticker?</h2>');
          modal.addFooterBtn('Remove', 'tingle-btn tingle-btn--danger tingle-btn--pull-right', () => {
            this.sendRemovingStickedItem(ctx.id, location);
            modal.close();
          });
          modal.addFooterBtn('Cancel', 'tingle-btn tingle-btn--pull-right', () => {
            modal.close();
          });
          modal.open();
        },
      },
    }
    const { dropPoints } = this.stickeryAdapter.exports;
    const { $ } = this.stickeryAdapter.attachConfig({
      INSTAGRAM_DROP_POINTS: (ctx: any) => dropPoints(dropPointOptions),
      TWITTER_DROP_POINTS: (ctx: any) => dropPoints(dropPointOptions),
    });

    this.$ = $;
  }

  async sendOpeningOverlay(props?: any) {
    this._overlay.send('data', props);
  }

  async sendGettingPosts(ids: string[]) {
    if (!this.isLoggedIn) {
      this.fetchingQueue.push(...ids);
      return;
    }

    const postIds = [...this.fetchingQueue, ...ids];
    if (postIds.length > 0) {
      this._overlay.send('getPosts', {
        platform: this.getPlatform(),
        postIds,
      });
    }

    this.fetchingQueue = [];
  }

  async sendStickingItem(stickerId: string, location: string, postId: string) {
    this._overlay.send('stick', {
      stickerId,
      location,
      postId,
      platform: this.getPlatform(),
    });
  }

  async sendRemovingStickedItem(postId: string, location: string) {
    this._overlay.send('removeSticker', {
      location,
      postId,
      platform: this.getPlatform(),
    });
  }

  getPlatform(): 'twitter' | 'instagram' {
    return window.location.hostname.includes('twitter') ? 'twitter' : 'instagram';
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
    this.draggingInfo = {
      postId: '',
      location: '',
      stickerId,
      nftTokenAddress: '',
      nftTokenId: '',
      imageUrl: url,
    };

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
    this.draggableItem.style.pointerEvents = 'none';
    this.draggableItem.style.zIndex = zIndex.toString();
    this.draggableItem.appendChild(loading);
    this.draggableItem.appendChild(image);

    this.setDroppointsVisibility(true);
  }

  hideDraggableItem() {
    if (this.isDraggableItemAppended) {
      document.body.removeChild(this.draggableItem);
      this.isDraggableItemAppended = false;
    }

    this.draggableItem = null;
    this.draggingInfo = null;
    this.setDroppointsVisibility(false);
  }

  initializeOverlay() {
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
        logIn: () => {
          this._overlay.send('logIn_done', null);
          this.isLoggedIn = true;
          this.sendGettingPosts([]);
        },
        logOut: () => {
          this._overlay.send('logOut_done', null);
          this.isLoggedIn = false;
        },
        mouseDown: (_: any, payload: any) => {
          const {
            message: { stickerId, url },
          } = payload;

          this.showDraggableArea();
          this.showDraggableItem(url, stickerId);
          this._overlay.send('mouseDown_done', null);
        },
        sendPostsResult: (_: any, payload: any) => {
          const {
            message: { normalizedPost },
          } = payload;

          this._overlay.send('sendPostsResult_done', null);
          this.attachStickedItemsMap(normalizedPost);
          this.refreshWidgetStickedItems();
        },
        removeStickerSuccess: (_: any, payload: any) => {
          const {
            message: { postId, location },
          } = payload;

          this._overlay.send('removeStickerSuccess_done', null);
          this.removeStickedItem(postId, location);
          this.refreshWidgetStickedItems();
        },
        sendNotification: (_: any, payload: any) => {
          const {
            message: { message, level },
          } = payload;

          this._overlay.send('sendNotification_done', null);
          toastr[level](message);
        },
      });
    }
  }

  initializeDragAndDrop() {
    if (!this.initialized) {
      this.initialized = true;

      document.body.addEventListener('mouseup', async (e) => {
        let target = e.target as HTMLElement;

        if (this.draggingInfo) {
          this.draggingInfo.postId = '';
          this.draggingInfo.location = '';

          while (target) {
            if (target.classList.contains('stickery-drop-point')) {
              this.draggingInfo.postId = target.dataset.id;
              this.draggingInfo.location = target.dataset.location;
              break;
            }

            target = target.parentElement;
          }
        }

        if (this.draggableArea) {
          this.hideDraggableArea();
        }

        try {
          await this.stickItem();
        } finally {
          if (this.draggableItem) {
            this.hideDraggableItem();
          }
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
          if (!this.draggingInfo) {
            return;
          }

          this.draggableItem.style.left = `${e.clientX}px`;
          this.draggableItem.style.top = `${e.clientY}px`;
        },
        { passive: true },
      );
    }
  }

  async stickItem() {
    if (!this.draggingInfo || !this.draggingInfo.postId || !this.draggingInfo.location) {
      return;
    }

    const {
      postId,
      location,
      imageUrl,
      stickerId,
      nftTokenAddress,
      nftTokenId,
    } = this.draggingInfo;

    const newStickedItem = {
      [postId]: {
        [location]: {
          stickerId,
          nftTokenAddress,
          nftTokenId,
          imageUrl,
        },
      },
    };

    const isItemExist = this.stickedItemsMap[postId] && this.stickedItemsMap[postId][location];

    const confirm = () => {
      this.attachStickedItemsMap(newStickedItem);
      this.refreshWidgetStickedItems();
      this.sendStickingItem(stickerId, location, postId);
    };
    if (isItemExist) {
      this.showReplaceModal(confirm);
    } else {
      confirm();
    }
  }

  showReplaceModal(confirm) {
    const modal = new tingle.modal({
      footer: true,
      stickyFooter: false,
      closeMethods: ['overlay', 'button', 'escape'],
      closeLabel: 'Close',
    });

    modal.setContent('<h2 class="tingle-header-text">Are you sure you want to replace a sticker?</h2>');
    modal.addFooterBtn('Place', 'tingle-btn tingle-btn--primary tingle-btn--pull-right', () => {
      confirm();
      modal.close();
    });
    modal.addFooterBtn('Cancel', 'tingle-btn tingle-btn--pull-right', () => {
      modal.close();
    });
    modal.open();
  }

  attachStickedItemsMap(item: Record<string, Record<string, StickValue>>) {
    const postIds = Object.keys(item);
    for (let postId of postIds) {
      if (!this.stickedItemsMap[postId]) {
        this.stickedItemsMap[postId] = {};
      }

      this.stickedItemsMap[postId] = {
        ...this.stickedItemsMap[postId],
        ...item[postId],
      };
    }
  }

  removeStickedItem(postId: string, location: string) {
    if (this.stickedItemsMap[postId]) {
      delete this.stickedItemsMap[postId][location];
    }
  }

  refreshWidgetStickedItems() {
    for (let postId of Object.keys(this.ctxMap)) {
      const widgetState = this.$(this.ctxMap[postId], DROP_POINTS_ID);
      if (widgetState) {
        widgetState.stickedItemsMap = this.stickedItemsMap;
      }
    }
  }

  setDroppointsVisibility(visible: boolean) {
    for (let postId of Object.keys(this.ctxMap)) {
      const widgetState = this.$(this.ctxMap[postId], DROP_POINTS_ID);
      if (widgetState) {
        widgetState.areDroppointsVisible = visible;
      }
    }
  }
}
