"use client";

import { useAppSelector, useModalProps } from "@/app/_lib/hooks";
import LoadingSpinner from "@/app/_ui/LoadingSpinner";
import Logo from "@/app/_ui/Logo";
import { Modal, ModalContent, ModalHeader, useDisclosure } from "@nextui-org/modal";
import { useRouter } from "next/navigation";
import { useEffect, useTransition } from "react";
import LoginForm from "./LoginForm";
import Step2 from "./Step2";

function LoginFlow() {
  const [isPending, startTransition] = useTransition();
  const { isOpen, onOpen } = useDisclosure();
  const router = useRouter();
  const currentStep = useAppSelector(state => state.user.login.step);
  const modalProps = useModalProps;

  function onTransition(callback: Function) {
    startTransition(async () => await callback());
  }

  useEffect(() => {
    onOpen();
  }, [onOpen])

  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={(isOpen) => {
        if (!isOpen) router.back();
      }}
      {...modalProps({ className: "min-h-[90dvh]", size: "xl", centerContent: true })}
    >
      <ModalContent>
        <ModalHeader className="mx-auto">
          <Logo width={27} height={27} />
        </ModalHeader>
        {currentStep === 1 && (
          <LoginForm onTransition={onTransition} />
        )}
        {currentStep === 2 && <Step2 onTransition={onTransition} />}
        {isPending && (
          <div className="absolute inset-0 z-10 bg-background flex items-center justify-center">
            <LoadingSpinner />
          </div>
        )}
      </ModalContent>
    </Modal>
  )
}

export default LoginFlow;
