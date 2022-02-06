const REFERENCE_NODE_CLASS = 'stickery-ref-node';
const TEXT_DROP_POINT_CLASS = 'stickery-text-drop-point';
const IMAGE_DROP_POINT_CLASS = 'stickery-image-drop-point';
const IMAGE_DROP_POINT_CONTAINER_CLASS = 'stickery-image-drop-point-container';

let stylesAdded = false;

const addStyles = (): void => {
  const styleTag: HTMLStyleElement = document.createElement('style');

  styleTag.innerHTML = `
    .${TEXT_DROP_POINT_CLASS} {
      position: absolute;
      max-width: 100px;
      max-height: 100px;
      min-width: 30px;
      min-height: 30px;
      height: 100%;
      width: 100%;
      background: red;
      right: 0;
    }

    .${IMAGE_DROP_POINT_CONTAINER_CLASS} {
      position: absolute;
      height: 100%;
      width: 100%;
    }

    .${IMAGE_DROP_POINT_CLASS} {
      position: absolute;
      max-width: 100px;
      max-height: 100px;
      min-width: 30px;
      min-height: 30px;
      height: 100%;
      width: 100%;
      background: rgba(76, 153, 129, 0.3);
      border: 2px solid #4C9981;
      box-sizing: border-box;
      border-radius: 50%;
    }

    .${IMAGE_DROP_POINT_CLASS}.entered {
      background: rgb(56 143 116 / 0.5);
    }

    .${IMAGE_DROP_POINT_CLASS}.placed {
      background: unset;
      border: unset;
    }
  `;

  document.head.appendChild(styleTag);
};

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
  public textDropPoint: HTMLElement;
  public imageDropPointsContainer: HTMLElement;
  public imageDropPoints: HTMLElement[] = [];

  public static contextInsPoints = {
    TWITTER_DROP_POINTS: 'TWITTER_DROP_POINTS',
  };

  public mount(): void {
    if (!this.el) {
      this._createElement();
      this._createDropPoints();
      this.state.init?.(this.state.ctx, this.state);
    }
    if (!stylesAdded) {
      addStyles();
      stylesAdded = true;
    }

    return;
  }

  public unmount(): void {
    this.el && this.el.remove();
  }

  private _createElement() {
    this.el = document.createElement('div');
    this.el.classList.add(REFERENCE_NODE_CLASS);

    return;
  }

  private _createDropPoints() {
    // TODO: implement this code for IG
    const { contextEl } = this.state.ctx;
    const buttonGroupNode = contextEl.querySelector('.css-1dbjc4n > div[role=group]:nth-child(1)');
    const mainContainer = buttonGroupNode.parentElement.parentElement;
    const textContainer = mainContainer.childNodes[0];
    const imageContainer = mainContainer.childNodes[1];

    this.textDropPoint = document.createElement('div');
    this.textDropPoint.classList.add(TEXT_DROP_POINT_CLASS);
    textContainer.appendChild(this.textDropPoint);

    if (imageContainer.childElementCount === 0) {
      return;
    }

    this.imageDropPointsContainer = document.createElement('div');
    this.imageDropPointsContainer.classList.add(IMAGE_DROP_POINT_CONTAINER_CLASS);

    const positions = ['TL', 'T', 'TR', 'BL', 'B', 'BR'];

    for (const position of positions) {
      const imageDropPoint = document.createElement('div');

      imageDropPoint.classList.add(IMAGE_DROP_POINT_CLASS);
      this.imageDropPoints.push(imageDropPoint);
      this.imageDropPointsContainer.appendChild(imageDropPoint);

      switch (position) {
        case 'TL': {
          imageDropPoint.style.left = '0';
          imageDropPoint.style.top = '0';
          break;
        }
        case 'T': {
          imageDropPoint.style.left = '50%';
          imageDropPoint.style.top = '0';
          imageDropPoint.style.transform = 'translate(-50%, 0%)';
          break;
        }
        case 'TR': {
          imageDropPoint.style.right = '0';
          imageDropPoint.style.top = '0';
          break;
        }
        case 'BL': {
          imageDropPoint.style.left = '0';
          imageDropPoint.style.bottom = '0';
          break;
        }
        case 'B': {
          imageDropPoint.style.left = '50%';
          imageDropPoint.style.bottom = '0';
          imageDropPoint.style.transform = 'translate(-50%, 0%)';
          break;
        }
        case 'BR': {
          imageDropPoint.style.right = '0';
          imageDropPoint.style.bottom = '0';
          break;
        }
      }
    }

    imageContainer.appendChild(this.imageDropPointsContainer);

    return;
  }
}
