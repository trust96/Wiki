import { Button, Menu } from "@mantine/core";
import { WikiIcon } from "@/components/primitive";
import { tokenKey } from "@/helper/constants";
import { useRouter } from "@/hooks/useRouter";
import { useUiStore } from "@/state/ui";
import { semanticColor } from "@/foundations";

const NavigationMenu = () => {
  const { push } = useRouter();
  const removeToken = useUiStore((state) => state.removeToken);

  const handleLogout = () => {
    localStorage.removeItem(tokenKey);
    removeToken();
    push("/auth/login");
  };

  return (
    <Menu width={300}>
      <Menu.Target>
        <Button variant="subtle" size="compact-xs" radius={0}>
          <WikiIcon name="menu" />
        </Button>
      </Menu.Target>
      <Menu.Dropdown>
        <Menu.Item leftSection={<WikiIcon name="shield" size="sm" />}>
          Area riservata
        </Menu.Item>
        <Menu.Item leftSection={<WikiIcon name="edit" size="sm" />}>
          Cambia password
        </Menu.Item>
        <Menu.Item leftSection={<WikiIcon name="settings" size="sm" />}>
          Impostazioni
        </Menu.Item>
        <Menu.Item
          color={semanticColor.danger}
          leftSection={<WikiIcon name="logout" size="sm" />}
          onClick={handleLogout}
        >
          Logout
        </Menu.Item>
      </Menu.Dropdown>
    </Menu>
  );
};

export default NavigationMenu;
