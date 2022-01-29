import isHexadecimal from 'validator/lib/isHexadecimal';

export const validateTokenAddress = (address: string) => {
  return address.startsWith('0x') && isHexadecimal(address) && address.length === 42;
};

export const validateSignature = (sig: string) => {
  return sig.startsWith('0x') && isHexadecimal(sig) && sig.length > 0;
};
