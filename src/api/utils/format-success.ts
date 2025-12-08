const formatSuccess = <T>(data: T) => {
  return {
    status: "success",
    data,
    error: null,
  };
};

export default formatSuccess;
