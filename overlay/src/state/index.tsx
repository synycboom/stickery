import { atom } from 'recoil';
import { CategoryData, StickerData } from '../interfaces';

export const accountState = atom({
  key: 'accountState',
  default: '',
});

export const categoriesState = atom<CategoryData[] | null>({
  key: 'categoriesState',
  default: null,
});

export const stickersState = atom<StickerData[] | null>({
  key: 'stickersState',
  default: null,
});
