import { useUiStore } from "@/state/ui";
import { LoadingOverlay } from "@mantine/core";

export const WikiLoader = () => {
  const isAppLoading = useUiStore((state) => state.loaders);

  return (
    <LoadingOverlay
      visible={Boolean(isAppLoading)}
      loaderProps={{ type: "dots", size: 50 }}
      zIndex={1000}
      overlayProps={{ radius: "sm", blur: 20 }}
    />
  );
};
