export const useOpportunitiesService = () => {
  const createOpportunity = async (body: object) => {
    console.log('sending this to loopback (backend)', body);
  };

  return {
    createOpportunity,
  };
};
