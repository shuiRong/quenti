import React from "react";

import { env } from "@quenti/env/client";
import { api } from "@quenti/trpc";

import { Button, HStack, Input, Skeleton, useToast } from "@chakra-ui/react";

import { AnimatedCheckCircle } from "../../components/animated-icons/check";
import { Modal } from "../../components/modal";
import { Toast } from "../../components/toast";
import { useFolder } from "../../hooks/use-folder";

export interface ShareFolderModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ShareFolderModal: React.FC<ShareFolderModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { id } = useFolder();
  const toast = useToast();

  const getShareId = api.folders.getShareId.useQuery(
    { folderId: id },
    {
      enabled: isOpen,
    },
  );
  const url = `${env.NEXT_PUBLIC_BASE_URL}/_${getShareId.data || ""}`;

  const copy = async () => {
    await navigator.clipboard.writeText(url);
    onClose();

    toast({
      title: "Copied link to clipboard",
      status: "success",
      icon: <AnimatedCheckCircle />,
      colorScheme: "green",
      render: Toast,
    });
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <Modal.Overlay />
      <Modal.Content>
        <Modal.Body>
          <Modal.Heading>Share this folder</Modal.Heading>
          <HStack spacing="3" pb="4">
            <Skeleton width="full" rounded="lg" isLoaded={!!getShareId.data}>
              <Input
                spellCheck={false}
                fontWeight={600}
                value={getShareId.isLoading ? "Loading..." : url}
              />
            </Skeleton>
            <Skeleton rounded="lg" isLoaded={!!getShareId.data}>
              <Button onClick={copy} variant="outline">
                Copy link
              </Button>
            </Skeleton>
          </HStack>
        </Modal.Body>
      </Modal.Content>
    </Modal>
  );
};
