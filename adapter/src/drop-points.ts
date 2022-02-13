const REFERENCE_NODE_CLASS = 'stickery-ref-node';
const TEXT_DROP_POINT_CLASS = 'stickery-text-drop-point';
const IMAGE_DROP_POINT_CLASS = 'stickery-image-drop-point';
const DROP_POINT_CLASS = 'stickery-drop-point';
const IMAGE_DROP_POINT_CONTAINER_CLASS = 'stickery-image-drop-point-container';
const DROP_POINT_VISIBLE_CLASS = 'stickery-droppoints-visible';
const IMAGE_CLASS = 'stickery-image';
const IG_IMAGE_POSITIONS = ['TOP_LEFT', 'TOP', 'TOP_RIGHT', 'MIDDLE_LEFT', 'MIDDLE', 'MIDDLE_RIGHT', 'BOTTOM_LEFT', 'BOTTOM', 'BOTTOM_RIGHT'];
const TWITTER_IMAGE_POSITIONS = ['CAPTION', 'TOP_LEFT', 'TOP', 'TOP_RIGHT', 'BOTTOM_LEFT', 'BOTTOM', 'BOTTOM_RIGHT'];

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
    }

    .${DROP_POINT_CLASS} {
      background: rgba(76, 153, 129, 0.3);
      border: 2px solid #4C9981;
      box-sizing: border-box;
      border-radius: 50%;
      visibility: hidden;
    }

    body.${DROP_POINT_VISIBLE_CLASS} .${DROP_POINT_CLASS} {
      visibility: visible;
    }

    .${DROP_POINT_CLASS}.hidden {
      display: none;
    }

    .${DROP_POINT_CLASS}.entered {
      background: rgb(56 143 116 / 0.5);
    }

    .${DROP_POINT_CLASS}.placed {
      background: unset;
      border: unset;
      visibility: visible;
    }

    .${DROP_POINT_CLASS}.placed:hover {
      cursor: pointer;
    }

    .${IMAGE_CLASS} {
      width: 100%;
      height: 100%;
    }
  `;

  document.head.appendChild(styleTag);
};

type StickValue = {
  stickerId: string,
  nftTokenAddress: string,
  nftTokenId: string,
  imageUrl: string,
};

export interface IDropPointsState {
  stickedItemsMap: Record<string, Record<string, StickValue>>
  areDroppointsVisible: boolean,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  exec: (ctx: any, me: IDropPointsState) => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  init: (ctx: any, me: IDropPointsState) => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  delete: (ctx: any, location: string) => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ctx: any;
}

export class DropPoints {
  public el: HTMLElement;
  public state: IDropPointsState;
  private imageDropPoints: HTMLElement[] = [];

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

    this._showAllDroppoints();
    this._hideOverlapped();
    this._renderStickedItems();

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
    const { contextEl, id } = this.state.ctx;
    const buttonGroupNode = contextEl.querySelector('.css-1dbjc4n > div[role=group]:nth-child(1)');
    const mainContainer = buttonGroupNode.parentElement.parentElement;
    let textContainer = mainContainer.childNodes[0];
    let imageContainer = mainContainer.childNodes[1];

    if (mainContainer.childNodes.length === 4) {
      const isInPostDetailPage = !!mainContainer.childNodes[0].querySelector('a');
      if (isInPostDetailPage) {
        textContainer = mainContainer.childNodes[1];
        imageContainer = mainContainer.childNodes[2];
      }
    }

    const positions = TWITTER_IMAGE_POSITIONS;
    const imageDropPointsContainer = document.createElement('div');

    this.imageDropPoints = [];

    for (const position of positions) {
      const imageDropPoint = document.createElement('div');

      switch (position) {
        case 'CAPTION': {
          if (textContainer.querySelector('[lang]')) {
            const textDropPoint = document.createElement('div');
            textDropPoint.classList.add(TEXT_DROP_POINT_CLASS, DROP_POINT_CLASS);
            textDropPoint.dataset.id = id;
            textDropPoint.dataset.location = position;
            textDropPoint.addEventListener('click', (e) => {
              if (textDropPoint.classList.contains('placed')) {
                e.stopPropagation();
                this.state.delete?.(this.state.ctx, position);
              }
            }, { capture: true });
            textContainer.appendChild(textDropPoint);
          }

          continue;
        }
        case 'TOP_LEFT': {
          imageDropPoint.style.left = '0';
          imageDropPoint.style.top = '0';
          break;
        }
        case 'TOP': {
          imageDropPoint.style.left = '50%';
          imageDropPoint.style.top = '0';
          imageDropPoint.style.transform = 'translate(-50%, 0%)';
          break;
        }
        case 'TOP_RIGHT': {
          imageDropPoint.style.right = '0';
          imageDropPoint.style.top = '0';
          break;
        }
        case 'BOTTOM_LEFT': {
          imageDropPoint.style.left = '0';
          imageDropPoint.style.bottom = '0';
          break;
        }
        case 'BOTTOM': {
          imageDropPoint.style.left = '50%';
          imageDropPoint.style.bottom = '0';
          imageDropPoint.style.transform = 'translate(-50%, 0%)';
          break;
        }
        case 'BOTTOM_RIGHT': {
          imageDropPoint.style.right = '0';
          imageDropPoint.style.bottom = '0';
          break;
        }
      }

      imageDropPoint.classList.add(IMAGE_DROP_POINT_CLASS, DROP_POINT_CLASS);
      imageDropPoint.dataset.id = id;
      imageDropPoint.dataset.location = position;
      imageDropPoint.addEventListener('click', (e) => {
        if (imageDropPoint.classList.contains('placed')) {
          e.stopPropagation();
          this.state.delete?.(this.state.ctx, position);
        }
      }, { capture: true });

      this.imageDropPoints.push(imageDropPoint);
      imageDropPointsContainer.classList.add(IMAGE_DROP_POINT_CONTAINER_CLASS);
      imageDropPointsContainer.appendChild(imageDropPoint);
    }

    // Check if there is an image in a post
    if (imageContainer.childElementCount > 0) {
      imageContainer.appendChild(imageDropPointsContainer);
    }

    return;
  }

  private _showAllDroppoints() {
    if (this.state.areDroppointsVisible && !document.body.classList.contains(DROP_POINT_VISIBLE_CLASS)) {
      document.body.classList.add(DROP_POINT_VISIBLE_CLASS);
    } else if (!this.state.areDroppointsVisible && document.body.classList.contains(DROP_POINT_VISIBLE_CLASS)) {
      document.body.classList.remove(DROP_POINT_VISIBLE_CLASS);
    }
  }

  private _hideOverlapped() {
    const visibleDropPoints: HTMLElement[] = [];
    for (let dropPoint of this.imageDropPoints) {
      if (visibleDropPoints.length === 0) {
        visibleDropPoints.push(dropPoint);
        continue;
      }

      for (let visibleDropPoint of visibleDropPoints) {
        if (visibleDropPoint.isSameNode(dropPoint)) {
          continue;
        }

        const rect1 = visibleDropPoint.getBoundingClientRect();
        const rect2 = dropPoint.getBoundingClientRect();
        const overlap = !(
          rect1.right < rect2.left || 
          rect1.left > rect2.right || 
          rect1.bottom < rect2.top || 
          rect1.top > rect2.bottom
        );
        
        if (!overlap) {
          visibleDropPoints.push(dropPoint);
        } else {
          dropPoint.classList.add('hidden');
        }
      }
    }
  }

  private _renderStickedItems() {
    const stickedItems = this.state.stickedItemsMap[this.state.ctx.id] || {};
    const { contextEl } = this.state.ctx;

    for (let location of TWITTER_IMAGE_POSITIONS) {
      const dropPoint = contextEl.querySelector(`[data-location="${location}"]`);
      if (!dropPoint) {
        continue;
      }

      if (!stickedItems[location]) {
        dropPoint.innerHTML = '';
        dropPoint.classList.remove('placed');
        continue;
      }

      const { imageUrl } = stickedItems[location];
      dropPoint.classList.add('placed');
      dropPoint.innerHTML = `
        <img class="${IMAGE_CLASS}" src="${imageUrl}"/>
      `;
    }
  }
}
