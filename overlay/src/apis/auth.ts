import axios from 'axios';
import setting from '../setting';

export const checkAuthen = async () => {
  const url = `${setting.API_URL}/v1/auth/check`;
  const response = await axios.get(url);
  return response.data;
};

export const getChallengeCode = async (account: string) => {
  const url = `${setting.API_URL}/v1/auth/challenge?publicAddress=${account}`;
  const response = await axios.get<{ challenge: string }>(url);
  return response.data;
};

export const login = async (account: string, hash: string) => {
  const url = `${setting.API_URL}/v1/auth/login`;
  const response = await axios.post(url, {
    publicAddress: account,
    signedChallenge: hash,
  });
  const token = response.data.token;
  window.localStorage.setItem('token', token);
  return response.data;
};

export const logout = async () => {
  const url = `${setting.API_URL}/v1/auth/logout`;
  const response = await axios.post(url);
  return response.data;
};
