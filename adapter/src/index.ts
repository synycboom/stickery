import { IFeature } from '@dapplets/dapplet-extension';
import { DropPoints } from './drop-points';

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
      containerSelector: 'main[role=main]',
      contextSelector: 'article.css-1dbjc4n',
      insPoints: {
        TWITTER_DROP_POINTS: {
          selector: '',
          insert: 'begin',
        },
      },
      contextBuilder: (el: any): ContextBuilder => {
        return {
          id: ''
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
