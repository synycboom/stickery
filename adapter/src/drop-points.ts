export interface IDropPointsState {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  exec: (ctx: any, me: IDropPointsState) => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  init: (ctx: any, me: IDropPointsState) => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ctx: any;
}

export class DropPoints {
  public el: HTMLElement;
  public state: IDropPointsState;

  public static contextInsPoints = {
    TWITTER_DROP_POINTS: 'TWITTER_DROP_POINTS',
  }

  public mount(): void {
    console.log(`mount: `, this.el);
    if (!this.el) {
      this._createElement();
    }

    return
  }

  public unmount(): void {
    this.el && this.el.remove();
  }

  private _createElement() {
    this.el = document.createElement('div');
    this.el.classList.add('stickery-test-class');
    console.log('_createElemen:');
    return;
  }
}
