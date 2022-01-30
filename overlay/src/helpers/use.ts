import { useEffect, useState } from 'react';
import { useRecoilState } from 'recoil';
import { getCategories, getStickers } from '../apis';
import { StickerData } from '../interfaces';
import { categoriesState } from '../state';

export const useCategories = () => {
  const [categories, setCategories] = useRecoilState(categoriesState);

  useEffect(() => {
    if (!categories) {
      getCategories().then((data) => setCategories(data.items));
    }
  }, [categories, setCategories]);

  return categories;
};

export const useStickers = (categoryId?: number) => {
  const [stickers, setStickers] = useState<StickerData[] | null>(null);

  useEffect(() => {
    if (categoryId) {
      getStickers(categoryId).then((data) => setStickers(data.items));
    }
  }, [categoryId, setStickers]);

  return stickers;
};
