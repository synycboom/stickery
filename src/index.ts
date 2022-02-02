import {} from '@dapplets/dapplet-extension';
import ICON_IMAGE from './icons/icon.png';

@Injectable
export default class TwitterFeature {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any,  @typescript-eslint/explicit-module-boundary-types
  @Inject('twitter-adapter.dapplet-base.eth') public adapter: any;
  @Inject('stickery-adapter.dapplet-base.eth') public stickeryAdapter: any;
  private _overlay: any;

  activate(): void {
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
      TWITTER_DROP_POINTS: (ctx: any) => (
        dropPoints({
          initial: 'DEFAULT',
          DEFAULT: {
          },
        })
      ),
    });
  }

  async openOverlay(props?: any): Promise<void> {
    this._overlay.send('data', props);
  }
}
