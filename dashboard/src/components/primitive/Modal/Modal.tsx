import type { ModalRootProps } from "@mantine/core";
import { Button, Divider, Group, Modal, ScrollArea, Text } from "@mantine/core";
import type { MouseEventHandler, ReactNode } from "react";

export interface TModalProps extends ModalRootProps {
  title?: ReactNode;
  confirmProps?: {
    label: string;
    onClick?: MouseEventHandler;
    form?: string;
    color?: string;
  };
  closeProps?: {
    label: string;
    color?: string;
  };
}

const WikiModal = ({
  children,
  title,
  confirmProps,
  closeProps,
  fullScreen,
  opened,
  onClose,
  ...rest
}: TModalProps) => {
  return (
    <Modal.Root
      fullScreen={fullScreen}
      centered={rest.centered ?? true}
      withinPortal
      opened={opened}
      returnFocus={false}
      onClose={onClose}
      scrollAreaComponent={ScrollArea.Autosize}
      {...rest}
    >
      <Modal.Overlay />
      <Modal.Content>
        <Modal.Header>
          <Modal.Title component={Text} fw="bold">
            {title}
          </Modal.Title>
          <Modal.CloseButton />
        </Modal.Header>
        <Modal.Body>
          {children}
          {(confirmProps || closeProps) && (
            <>
              <Divider mt="md" />
              <Group justify="flex-end" gap="md" pt="md" bg="var(--mantine-color-body)">
                {closeProps && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={onClose}
                    color={closeProps.color}
                  >
                    {closeProps.label}
                  </Button>
                )}
                {confirmProps && (
                  <Button
                    size="sm"
                    onClick={confirmProps.onClick}
                    type="submit"
                    form={confirmProps.form}
                    color={confirmProps.color}
                  >
                    {confirmProps.label}
                  </Button>
                )}
              </Group>
            </>
          )}
        </Modal.Body>
      </Modal.Content>
    </Modal.Root>
  );
};

export default WikiModal;
