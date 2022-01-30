export type CategoryData = {
  id: number;
  name: string;
};

export type StickerData = {
  id: number;
  url: string;
  categoryId: number;
};

export interface IPagination<T> {
  items: T;
}
