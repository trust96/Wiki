import { Paper, Stack } from "@mantine/core";
import SidebarItem from "./SidebarItem";
import { navigationData } from "@/helper/navigationData";

const SideBar = () => {
  return (
    <Paper
      component="aside"
      shadow="xs"
      radius="md"
      style={{ overflow: "hidden" }}
    >
      <Stack gap={0} component="ul" p={0} m={0} style={{ listStyle: "none" }}>
        {navigationData.map(({ href, icon, id, size, isDisabled }) => (
          <SidebarItem
            key={id}
            id={id}
            href={href}
            icon={icon}
            isDisabled={isDisabled}
            size={size}
          />
        ))}
      </Stack>
    </Paper>
  );
};

export default SideBar;
