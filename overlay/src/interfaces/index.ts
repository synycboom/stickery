export type CategoryData = {
  id: number;
  name: string;
};

export type StickerData = {
  id: number;
  url: string;
  categoryId: number;
};

export type Position = {
  location: string;
  stickerId: string | null;
  nftTokenAddress: string | null;
  nftTokenId: string | null;
  postId: string;
  userId: number;
};

export type Post = {
  platform: string;
  foreignId: string;
  positions: Position[];
}

export type StickValue = {
  stickerId: string,
  nftTokenAddress: string,
  nftTokenId: string,
  imageUrl: string,
};

export type NormalizedPost = Record<string, Record<string, StickValue>>;

export interface IPagination<T> {
  items: T;
}
