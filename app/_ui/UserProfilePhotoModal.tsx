"use client";

import { useAppSelector, useModalProps } from "@/app/_lib/hooks";
import { Modal, ModalContent, useDisclosure } from "@nextui-org/modal";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";

function UserProfilePhotoModal({
  mode,
  src,
  onClose,
}: {
  mode: "profile" | "header" | "twitt_media";
  src?: string;
  onClose?: () => any;
}) {
  const { isOpen, onOpen, onClose: onCloseModal } = useDisclosure();
  const userInfo = useAppSelector((state) => state.user.user);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    onOpen();
  }, [pathname]);

  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={(isOpen) => {
        if (!isOpen) {
          if (mode === "twitt_media") {
            onClose?.();
            onCloseModal();
            return;
          }
          router.back();
        }
      }}
      {...useModalProps({
        defaultBackdrop: true,
        className: "bg-transparent shadow-none",
        isDismissable: true,
        classNames: { closeButton: "fixed left-6" },
      })}
    >
      <ModalContent>
        <div className="fixed top-1/2 -translate-y-1/2 left-0 right-0 flex items-center justify-center h-[400px]">
          {mode === "header" && (
            <img
              src={src || userInfo?.header_photo!}
              className="w-full h-full object-cover"
              alt={userInfo?.name}
            />
          )}
          {mode === "profile" && (
            <img
              src={src || userInfo?.profile}
              alt={userInfo?.name}
              width={374}
              height={374}
              className="rounded-full w-[374px] h-[374px] object-cover"
            />
          )}
          {mode === "twitt_media" && (
            <img
              src={src || userInfo?.profile}
              alt={userInfo?.name}
              className="object-cover"
            />
          )}
        </div>
      </ModalContent>
    </Modal>
  );
}

export default UserProfilePhotoModal;
