import axios from 'axios';
import { CategoryData, IPagination, Post, StickerData } from '../interfaces';
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

export const getStickers = async (categoryId?: number, ids?: string[]) => {
  const url = `${setting.API_URL}/v1/stickers`;
  const params: Record<string, string> = {};
  if (categoryId) {
    params.categoryId = categoryId.toString();
  }
  if (ids && ids.length > 0) {
    params.ids = ids.join(',');
  }

  const response = await axios.get<IPagination<StickerData[]>>(url, {
    params,
  });

  return response.data;
};

export const getPosts = async (platform: string, foreignIds: string[] = []) => {
  const url = `${setting.API_URL}/v1/posts`;
  const response = await axios.get<IPagination<Post[]>>(url, {
    params: {
      platform,
      foreignIds: foreignIds.length > 0 ? foreignIds.join(',') : undefined,
    }
  })

  return response.data;
};

export const stick = async (data: any) => {
  const url = `${setting.API_URL}/v1/posts/stick`;
  const response = await axios.post(url, data);

  return response.data;
};

export const removeStickedSticker = async (data: any) => {
  const url = `${setting.API_URL}/v1/posts/remove`;
  const response = await axios.post(url, data);

  return response.data;
};
