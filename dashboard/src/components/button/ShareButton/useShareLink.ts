export const useShareLink = () => {
  const canShare = typeof navigator !== "undefined" && !!navigator.share;

  const share = async (data: ShareData) => {
    if (!canShare) {
      return;
    }

    await navigator.share(data);
  };

  return { canShare, share };
};
