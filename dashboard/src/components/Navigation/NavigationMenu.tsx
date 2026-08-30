import { Button, Menu } from "@mantine/core";
import Icon from "../Icon/Icon";
import { tokenKey } from "@/helper/constants";
import { useRouter } from "@/hooks/useRouter";

const NavigationMenu = () => {
  const { push } = useRouter();

  const handleLogout = () => {
    localStorage.removeItem(tokenKey);
    push("/auth/login");
  };

  const handlePassRoute = () => {
    return;
  };
  const handleSettingsRoute = () => {
    return;
  };

  return (
    <Menu width={300}>
      <Menu.Target>
        <Button variant={"subtle"} size="compact-xs" radius={0}>
          <Icon name="menu" />
        </Button>
      </Menu.Target>
      <Menu.Dropdown>
        <Menu.Item leftSection={<Icon name="shield" size={"sm"} />}>
          {"Area riservata"}
        </Menu.Item>
        <Menu.Item
          leftSection={<Icon name="edit" size={"sm"} />}
          onClick={handlePassRoute}
        >
          {"Cambia password"}
        </Menu.Item>
        <Menu.Item
          leftSection={<Icon name="settings" size={"sm"} />}
          onClick={handleSettingsRoute}
        >
          {"Impostazioni"}
        </Menu.Item>
        <Menu.Item
          color="red"
          leftSection={<Icon name="logout" size={"sm"} />}
          onClick={handleLogout}
        >
          Logout
        </Menu.Item>
      </Menu.Dropdown>
    </Menu>
  );
};

export default NavigationMenu;
