import { useEffect } from 'react';
import { useRecoilState } from 'recoil';
import { getCategories, getStickers } from '../apis';
import { categoriesState, stickersState } from '../state';

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
  const [stickers, setStickers] = useRecoilState(stickersState);

  useEffect(() => {
    if (categoryId) {
      getStickers().then((data) => setStickers(data.items));
    }
  }, [categoryId, setStickers]);

  return stickers;
};
