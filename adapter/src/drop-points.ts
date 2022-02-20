const REFERENCE_NODE_CLASS = 'stickery-ref-node';
const ABOVE_POST_DROP_POINT_CLASS = 'stickery-above-post-drop-point';
const CAPTION_DROP_POINT_CLASS = 'stickery-caption-drop-point';
const IMAGE_DROP_POINT_CLASS = 'stickery-image-drop-point';
const DROP_POINT_CLASS = 'stickery-drop-point';
const IMAGE_DROP_POINT_CONTAINER_CLASS = 'stickery-image-drop-point-container';
const DROP_POINT_VISIBLE_CLASS = 'stickery-droppoints-visible';
const IMAGE_CLASS = 'stickery-image';
const INSTAGRAM_DROPPABLE_POSITIONS = [
  'ABOVE_POST',
  'TOP_LEFT',
  'TOP',
  'TOP_RIGHT',
  'MIDDLE_LEFT',
  'MIDDLE',
  'MIDDLE_RIGHT',
  'BOTTOM_LEFT',
  'BOTTOM',
  'BOTTOM_RIGHT',
  'CAPTION',
];
const TWITTER_DROPPABLE_POSITIONS = [
  'CAPTION',
  'TOP_LEFT',
  'TOP',
  'TOP_RIGHT',
  'BOTTOM_LEFT',
  'BOTTOM',
  'BOTTOM_RIGHT',
];

let stylesAdded = false;

const addStyles = (): void => {
  const styleTag: HTMLStyleElement = document.createElement('style');

  styleTag.innerHTML = `
    .${ABOVE_POST_DROP_POINT_CLASS} {
      position: absolute;
      max-width: 70px;
      max-height: 70px;
      min-width: 30px;
      min-height: 30px;
      height: 100%;
      width: auto;
      right: 0;
      aspect-ratio: 1;
    }

    .${ABOVE_POST_DROP_POINT_CLASS}.instagram {
      margin-right: 40px;
    }

    .${CAPTION_DROP_POINT_CLASS} {
      position: absolute;
      max-width: 70px;
      max-height: 70px;
      min-width: 30px;
      min-height: 30px;
      height: 100%;
      width: auto;
      right: 0;
      aspect-ratio: 1;
    }

    .${CAPTION_DROP_POINT_CLASS}.twitter {
      margin-right: 25px;
    }

    .${CAPTION_DROP_POINT_CLASS}.instagram {
      margin-right: 40px;
    }

    .${IMAGE_DROP_POINT_CONTAINER_CLASS} {
      position: absolute;
      height: 80%;
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%);
    }

    .${IMAGE_DROP_POINT_CONTAINER_CLASS}.twitter {
      width: calc(100% - 50px);
    }

    .${IMAGE_DROP_POINT_CONTAINER_CLASS}.instagram {
      width: calc(100% - 80px);
    }

    .${IMAGE_DROP_POINT_CLASS} {
      position: absolute;
      max-width: 70px;
      max-height: 70px;
      min-width: 30px;
      min-height: 30px;
      height: 100%;
      width: 100%;
    }

    .${IMAGE_DROP_POINT_CLASS}.top-left {
      left: 0;
      top: 0;
    }

    .${IMAGE_DROP_POINT_CLASS}.top {
      left: 50%;
      top: 0;
      transform: translate(-50%, 0%);
    }

    .${IMAGE_DROP_POINT_CLASS}.top-right {
      top: 0;
      right: 0;
    }

    .${IMAGE_DROP_POINT_CLASS}.middle-left {
      left: 0;
      top: 50%;
      transform: translate(0%, -50%);
    }

    .${IMAGE_DROP_POINT_CLASS}.middle {
      left: 50%;
      bottom: 50%;
      transform: translate(-50%, 50%);
    }

    .${IMAGE_DROP_POINT_CLASS}.middle-right {
      right: 0;
      top: 50%;
      transform: translate(0%, -50%);
    }

    .${IMAGE_DROP_POINT_CLASS}.bottom-left {
      left: 0;
      bottom: 0;
    }

    .${IMAGE_DROP_POINT_CLASS}.bottom {
      left: 50%;
      bottom: 0;
      transform: translate(-50%, 0%);
    }

    .${IMAGE_DROP_POINT_CLASS}.bottom-right {
      right: 0;
      bottom: 0;
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

    .${DROP_POINT_CLASS}:hover {
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
      position: absolute;
      width: 100px;
      height: 100px;
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%);
    }
  `;

  document.head.appendChild(styleTag);
};

type StickValue = {
  stickerId: string;
  nftTokenAddress: string;
  nftTokenId: string;
  imageUrl: string;
};

type InstagramContainer = {
  abovePostContainer: HTMLElement;
  imageContainer: HTMLElement;
  captionContainer: HTMLElement;
}

type TwitterContainer = {
  captionContainer: HTMLElement;
  imageContainer: HTMLElement;
}

export interface IDropPointsState {
  stickedItemsMap: Record<string, Record<string, StickValue>>;
  areDroppointsVisible: boolean;
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
    INSTAGRAM_DROP_POINTS: 'INSTAGRAM_DROP_POINTS',
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
    const { contextEl } = this.state.ctx;
    const elements = [
      ...Array.from<HTMLElement>(contextEl.querySelectorAll(`.${DROP_POINT_CLASS}`) || []),
      ...Array.from<HTMLElement>(contextEl.querySelectorAll(`.${IMAGE_DROP_POINT_CONTAINER_CLASS}`) || []),
    ];

    for (let element of elements) {
      element.remove();
    }
  }

  private _createElement() {
    this.el = document.createElement('div');
    this.el.classList.add(REFERENCE_NODE_CLASS);

    return;
  }

  private _getPlatform(): 'twitter' | 'instagram' {
    return window.location.hostname.includes('twitter') ? 'twitter' : 'instagram';
  }

  private _getDroppablePositions(): string[] {
    const platform = this._getPlatform();
    if (platform === 'twitter') {
      return TWITTER_DROPPABLE_POSITIONS;
    }
    if (platform === 'instagram') {
      return INSTAGRAM_DROPPABLE_POSITIONS;
    }

    return [];
  }

  private _getContainer(): TwitterContainer | InstagramContainer | null {
    const { contextEl } = this.state.ctx;
    const platform = this._getPlatform();
    if (platform === 'twitter') {
      const buttonGroupNode = contextEl.querySelector('.css-1dbjc4n > div[role=group]:nth-child(1)');
      const mainContainer = buttonGroupNode.parentElement.parentElement;
      let captionContainer = mainContainer.childNodes[0];
      let imageContainer = mainContainer.childNodes[1];

      if (mainContainer.childNodes[3] && mainContainer.childNodes[3].innerText === 'Promoted') {
        return null;
      }

      if (mainContainer.childNodes.length === 4) {
        const isInPostDetailPage = !!mainContainer.childNodes[0].querySelector('a');
        if (isInPostDetailPage) {
          captionContainer = mainContainer.childNodes[1];
          imageContainer = mainContainer.childNodes[2];
        }
      }

      if (!captionContainer?.querySelector('[lang]')) {
        captionContainer = null;
      }

      return {
        captionContainer,
        imageContainer,
      }
    } 

    if (platform === 'instagram') {
      const header = contextEl.querySelector('header');
      const mainContainer = header.parentElement.parentElement.parentElement;

      return {
        abovePostContainer: mainContainer.childNodes[0],
        imageContainer: mainContainer.childNodes[1],
        captionContainer: mainContainer.childNodes[2],
      }
    }

    return null;
  }

  private _appendTextDropPoint(container: HTMLElement, id: string, position: string, classes: string[]) {
    const dropPoint = document.createElement('div');
    dropPoint.classList.add(...classes);
    dropPoint.dataset.id = id;
    dropPoint.dataset.location = position;
    dropPoint.addEventListener(
      'click',
      (e) => {
        if (dropPoint.classList.contains('placed')) {
          e.stopPropagation();
          this.state.delete?.(this.state.ctx, position);
        }
      },
      { capture: true },
    );

    container.appendChild(dropPoint);
  }

  private _createDropPoints() {
    const { id } = this.state.ctx;
    const container = this._getContainer();
    const platform = this._getPlatform();
    if (!container) {
      return;
    }

    const positions = this._getDroppablePositions();
    const imageDropPointsContainer = document.createElement('div');
    this.imageDropPoints = [];
    for (const position of positions) {
      const imageDropPoint = document.createElement('div');
      let positionClass = '';

      switch (position) {
        case 'ABOVE_POST': {
          if ('abovePostContainer' in container && container.abovePostContainer) {
            this._appendTextDropPoint(
              container.abovePostContainer,
              id,
              position,
              [ABOVE_POST_DROP_POINT_CLASS, DROP_POINT_CLASS, platform],
            );
          }

          continue;
        }
        case 'CAPTION': {
          if (container.captionContainer) {
            this._appendTextDropPoint(
              container.captionContainer,
              id,
              position,
              [CAPTION_DROP_POINT_CLASS, DROP_POINT_CLASS, platform],
            );
          }

          continue;
        }
        case 'TOP_LEFT': {
          positionClass = 'top-left';
          break;
        }
        case 'TOP': {
          positionClass = 'top';
          break;
        }
        case 'TOP_RIGHT': {
          positionClass = 'top-right';
          break;
        }
        case 'MIDDLE_LEFT': {
          positionClass = 'middle-left';
          break;
        }
        case 'MIDDLE': {
          positionClass = 'middle';
          break;
        }
        case 'MIDDLE_RIGHT': {
          positionClass = 'middle-right';
          break;
        }
        case 'BOTTOM_LEFT': {
          positionClass = 'bottom-left';
          break;
        }
        case 'BOTTOM': {
          positionClass = 'bottom';
          break;
        }
        case 'BOTTOM_RIGHT': {
          positionClass = 'bottom-right';
          break;
        }
      }

      imageDropPoint.classList.add(IMAGE_DROP_POINT_CLASS, DROP_POINT_CLASS, positionClass);
      imageDropPoint.dataset.id = id;
      imageDropPoint.dataset.location = position;
      imageDropPoint.addEventListener(
        'click',
        (e) => {
          if (imageDropPoint.classList.contains('placed')) {
            e.stopPropagation();
            this.state.delete?.(this.state.ctx, position);
          }
        },
        { capture: true },
      );

      this.imageDropPoints.push(imageDropPoint);
      imageDropPointsContainer.classList.add(IMAGE_DROP_POINT_CONTAINER_CLASS, platform);
      imageDropPointsContainer.appendChild(imageDropPoint);
    }

    // Check if there is an image in a post
    if (container.imageContainer.childElementCount > 0) {
      container.imageContainer.appendChild(imageDropPointsContainer);
    }

    return;
  }

  private _showAllDroppoints() {
    if (
      this.state.areDroppointsVisible &&
      !document.body.classList.contains(DROP_POINT_VISIBLE_CLASS)
    ) {
      document.body.classList.add(DROP_POINT_VISIBLE_CLASS);
    } else if (
      !this.state.areDroppointsVisible &&
      document.body.classList.contains(DROP_POINT_VISIBLE_CLASS)
    ) {
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
    const positions = this._getDroppablePositions();

    for (let location of positions) {
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
