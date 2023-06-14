let localId = 0;
export const useIdGenerator = () => {
  const generateLocalId = () => {
    return `${localId++}`;
  };

  return {
    generateLocalId,
  };
};
export * from './useAccountModule';
