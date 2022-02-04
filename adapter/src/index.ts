import { IFeature } from '@dapplets/dapplet-extension';
import { DropPoints } from './drop-points';

type ContextElement = {
  contextEl: HTMLElement;
};

type ContextBuilder = {
  [propName: string]: string;
};

type Exports = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [propName: string]: any;
};

@Injectable
export default class StickeryTwitterAdapter {
  public exports = (): Exports => ({
    dropPoints: this.adapter.createWidgetFactory(DropPoints),
  });

  public config = {
    TWITTER_DROP_POINTS: {
      containerSelector: 'div[data-testid=primaryColumn]',
      contextSelector: 'article[data-testid=tweet]',
      insPoints: {
        TWITTER_DROP_POINTS: {
          selector: '', // Use the contextSelector as a context div
          insert: 'inside',
        },
      },
      contextBuilder: (el: any): ContextBuilder & ContextElement => {
        return {
          id: el.querySelector('a time')?.parentNode?.href?.split('/')?.pop() || /status\/([0-9]*)/gm.exec(document.location.href)?.[1],
          contextEl: el, // IMPROVEMENT: This might cause memory leakage
        };
      },
    },
  };

  constructor(
    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/no-explicit-any
    @Inject('dynamic-adapter.dapplet-base.eth') readonly adapter: any,
  ) {
    this.adapter.configure(this.config);
  }

  public attachConfig(feature: IFeature): void {
    this.adapter.attachConfig(feature);
  }

  public detachConfig(feature: IFeature): void {
    this.adapter.detachConfig(feature);
  }
}
