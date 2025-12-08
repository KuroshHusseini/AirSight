export const formatTimestamp = (timestamp: number) => {
  return new Date(timestamp).toLocaleTimeString();
};
