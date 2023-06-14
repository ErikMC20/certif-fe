const formatAddress = (address: string) => {
  return address.replace('_gnrtd', '').replaceAll(',|', '');
};

export const useQuotesComposable = () => {
  return {
    // Properties
    // Dummy data
    // Getters
    // Methods
    formatAddress,
  };
};
