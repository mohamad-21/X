"use client";

import { Modal, ModalContent, useDisclosure } from "@nextui-org/modal";
import { useRouter } from "next/navigation";
import { useEffect, useTransition } from "react";
import Step1 from "./Step1";
import { useAppSelector, useModalProps } from "@/app/_lib/hooks";
import Step2 from "./Step2";
import Step3 from "./Step3";
import Step4 from "./Step4";
import Step5 from "./Step5";
import LoadingSpinner from "@/app/_ui/LoadingSpinner";
import Step6 from "./Step6";

function CredentialsFlow() {
  const [isPending, startTransition] = useTransition();
  const { isOpen, onOpen } = useDisclosure();
  const router = useRouter();
  const signupState = useAppSelector(state => state.user.signup);
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
        if (!isOpen) router.push('/');
      }}
      hideCloseButton={signupState.step > 2}
      {...modalProps({ className: "min-h-[90dvh]", size: "xl", centerContent: true })}
    >
      <ModalContent>
        {signupState.step === 1 && <Step1 onTransition={onTransition} />}
        {signupState.step === 2 && <Step2 onTransition={onTransition} />}
        {signupState.step === 3 && <Step3 onTransition={onTransition} />}
        {signupState.step === 4 && <Step4 onTransition={onTransition} />}
        {signupState.step === 5 && <Step5 onTransition={onTransition} />}
        {signupState.step === 6 && <Step6 />}
        {isPending && (
          <div className="absolute inset-0 z-10 bg-background flex items-center justify-center">
            <LoadingSpinner />
          </div>
        )}
      </ModalContent>
    </Modal>
  )
}

export default CredentialsFlow;
