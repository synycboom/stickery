export const formatAddress = (address: string, showLength: number): string => {
  const length = address.length;
  return `${address.substring(0, showLength)}...${address.substring(length - showLength, length)}`;
};
