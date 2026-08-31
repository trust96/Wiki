import type { TRootState } from "@/state/store";
import { LoadingOverlay } from "@mantine/core";
import { useSelector } from "react-redux";

export const WikiLoader = () => {
  const isAppLoading = useSelector((state: TRootState) => state.ui.loaders);

  return (
    <LoadingOverlay
      visible={Boolean(isAppLoading)}
      loaderProps={{ type: "dots", size: 50 }}
      zIndex={1000}
      overlayProps={{ radius: "sm", blur: 20 }}
    />
  );
};
