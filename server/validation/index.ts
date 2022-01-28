import isHexadecimal from 'validator/lib/isHexadecimal';

export const validateTokenAddress = (address: string) => {
  return address.startsWith('0x') && isHexadecimal(address) && address.length === 42;
}
