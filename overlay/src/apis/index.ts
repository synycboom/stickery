import axios from 'axios';
import { CategoryData, IPagination, StickerData } from '../interfaces';
import setting from '../setting';

axios.interceptors.request.use(async (config) => {
  const token = window.localStorage.getItem('token');
  if (token) {
    config.headers = { Authorization: `Bearer ${token}`, ...config.headers };
  }
  return config;
});

export const getCategories = async () => {
  const url = `${setting.API_URL}/v1/categories`;
  const response = await axios.get<IPagination<CategoryData[]>>(url);
  return response.data;
};

export const getStickers = async (categoryId: number) => {
  const url = `${setting.API_URL}/v1/stickers?categoryId=${categoryId}`;
  const response = await axios.get<IPagination<StickerData[]>>(url);
  return response.data;
};
