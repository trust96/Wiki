import { Button, Menu } from "@mantine/core";
import { WikiIcon } from "@/components/primitive";
import { tokenKey } from "@/helper/constants";
import { currentUserKey } from "@/services/auth/auth";
import { useUiStore } from "@/state/ui";
import { semanticColor } from "@/foundations";
import { useQueryClient } from "@tanstack/react-query";
import { useLocation } from "wouter";

const NavigationMenu = () => {
  const [, navigate] = useLocation();
  const queryClient = useQueryClient();
  const removeToken = useUiStore((state) => state.removeToken);

  const handleLogout = () => {
    localStorage.removeItem(tokenKey);
    removeToken();
    queryClient.removeQueries({ queryKey: currentUserKey });
    navigate("/auth/login");
  };

  return (
    <Menu width={300}>
      <Menu.Target>
        <Button variant="subtle" size="compact-xs" radius={0}>
          <WikiIcon name="menu" />
        </Button>
      </Menu.Target>
      <Menu.Dropdown>
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
