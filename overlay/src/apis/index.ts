import axios from 'axios';
import { CategoryData, IPagination, StickerData } from '../interfaces';
import setting from '../setting';

export const getCategories = async () => {
  const url = `${setting.API_URL}/v1/categories`;
  const response = await axios.get<IPagination<CategoryData[]>>(url);
  return response.data;
};

export const getStickers = async () => {
  const url = `${setting.API_URL}/v1/stickers`;
  const response = await axios.get<IPagination<StickerData[]>>(url);
  return response.data;
};
