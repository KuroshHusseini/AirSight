export const formatAgo = (now: Ref<number>, ts: number) => {
  const delta = Math.max(0, Math.floor((now.value - ts) / 1000));

  if (delta < 60) {
    return `${delta}s ago`;
  }

  const m = Math.floor(delta / 60);
  const s = delta % 60;

  return `${m}m ${s}s ago`;
};
