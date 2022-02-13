import GeneralBridge from '@dapplets/dapplet-overlay-bridge';
import { NormalizedPost } from '../interfaces';

class Bridge extends GeneralBridge {
  _subId: number = 0;

  onData(callback: (data?: any) => void) {
    this.subscribe('data', (data: any) => {
      this._subId = Math.trunc(Math.random() * 1_000_000_000);
      callback(data);
      return this._subId.toString();
    });
  }

  onStick(callback: (data?: any) => void) {
    this.subscribe('stick', (data: any) => {
      this._subId = Math.trunc(Math.random() * 1_000_000_000);
      callback(data);
      return this._subId.toString();
    });
  }

  onGetPosts(callback: (data?: any) => void) {
    this.subscribe('getPosts', (data: any) => {
      this._subId = Math.trunc(Math.random() * 1_000_000_000);
      callback(data);
      return this._subId.toString();
    });
  }

  onRemoveSticker(callback: (data?: any) => void) {
    this.subscribe('removeSticker', (data: any) => {
      this._subId = Math.trunc(Math.random() * 1_000_000_000);
      callback(data);
      return this._subId.toString();
    });
  }

  async removeStickerSuccess(postId: string, location: string): Promise<void> {
    return this.call('removeStickerSuccess', { postId, location }, 'removeStickerSuccess_done', 'removeStickerSuccess_undone');
  }

  async sendNotification(message: string, level: 'success' | 'warning' | 'error'): Promise<void> {
    return this.call('sendNotification', { message, level }, 'sendNotification_done', 'sendNotification_undone');
  };

  async sendPostsResult(normalizedPost: NormalizedPost): Promise<string> {
    return this.call('sendPostsResult', { normalizedPost }, 'sendPostsResult_done', 'sendPostsResult_undone');
  }

  async connectWallet(): Promise<string> {
    return this.call('connectWallet', null, 'connectWallet_done', 'connectWallet_undone');
  }

  async disconnectWallet(): Promise<string> {
    return this.call('disconnectWallet', null, 'disconnectWallet_done', 'disconnectWallet_undone');
  }

  async isWalletConnected(): Promise<boolean> {
    return this.call(
      'isWalletConnected',
      null,
      'isWalletConnected_done',
      'isWalletConnected_undone',
    );
  }

  async signMessage(account: string, message: string): Promise<string> {
    return this.call('signMessage', { account, message }, 'signMessage_done', 'signMessage_undone');
  }

  async logIn(): Promise<void> {
    return this.call('logIn', null, 'logIn_done', 'logIn_undone');
  }

  async logOut(): Promise<void> {
    return this.call('logOut', null, 'logOut_done', 'logOut_undone');
  }

  async mouseDown(url: string, stickerId: number): Promise<boolean> {
    return this.call('mouseDown', { url, stickerId }, 'mouseDown_done', 'mouseDown_undone');
  }

  public async call(
    method: string,
    args: any,
    callbackEventDone: string,
    callbackEventUndone: string,
  ): Promise<any> {
    return new Promise((res, rej) => {
      this.publish(this._subId.toString(), {
        type: method,
        message: args,
      });
      this.subscribe(callbackEventDone, (result: any) => {
        this.unsubscribe(callbackEventDone);
        this.unsubscribe(callbackEventUndone);
        res(result);
      });
      this.subscribe(callbackEventUndone, () => {
        this.unsubscribe(callbackEventUndone);
        this.unsubscribe(callbackEventDone);
        rej('The transaction was rejected.');
      });
    });
  }
}

const bridge = new Bridge();

export { bridge, Bridge };
