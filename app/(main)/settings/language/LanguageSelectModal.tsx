"use client";

import { useModalProps } from "@/app/_lib/hooks";
import LanguageSwitcher from "@/app/_ui/LanguageSwitcher";
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  useDisclosure,
} from "@nextui-org/modal";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";

function LanguageSelectModal() {
  const { isOpen, onOpen } = useDisclosure();
  const router = useRouter();
  const t = useTranslations();

  useEffect(() => {
    onOpen();
  }, []);

  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={(isOpen) => {
        if (!isOpen) {
          router.back();
        }
      }}
      {...useModalProps({ isDismissable: true })}
    >
      <ModalContent>
        <ModalHeader />
        <ModalBody>
          <h1 className="text-xl font-bold">{t("selectLang")}</h1>
          <LanguageSwitcher />
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}

export default LanguageSelectModal;
