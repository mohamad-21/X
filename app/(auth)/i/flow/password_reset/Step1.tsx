import React, { SyntheticEvent, useRef } from "react";
import { StepsProps } from "./PasswordResetFlow";
import { ModalBody, ModalFooter } from "@nextui-org/modal";
import { Button, Input } from "@nextui-org/react";
import { checkExistsUserByEmailUsername, sendPasswordResetVerification } from "@/app/_lib/actions";

function Step1({ flow, setFlow, onTransition }: StepsProps) {
  const formRef = useRef<HTMLFormElement>(null);

  function handleSubmit(e: SyntheticEvent) {
    e.preventDefault();
    setFlow(prev => ({ ...prev, error: null }));
    onTransition(async () => {
      const { exists, email } = await checkExistsUserByEmailUsername(flow.identy, true);
      if (!exists) return setFlow(prev => ({ ...prev, error: "sorry, we could not find your account" }));
      await sendPasswordResetVerification(email);
      setFlow(prev => ({ ...prev, email, step: 2 }));
    });
  }

  return (
    <>
      <ModalBody>
        <div className="flex flex-col gap-9">
          <div>
            <h1 className="text-3xl mb-2 font-bold">Find your X cccount</h1>
            <p className="text-[15px] text-darkgray">Enter the email, or username associated with your account to change your password.</p>

          </div>
          <form onSubmit={handleSubmit} ref={formRef}>
            <Input
              variant="bordered"
              color="primary"
              size="lg"
              radius="sm"
              value={flow.identy}
              onChange={(e) => setFlow(prev => ({ ...prev, identy: e.target.value }))}
              classNames={{
                label: "text-darkgray text-lg"
              }}
              label="Email or username"
            />
          </form>
        </div>
      </ModalBody>
      <ModalFooter>
        <Button color="secondary" onClick={() => formRef.current?.requestSubmit()} isDisabled={flow.identy.length < 1} size="lg" radius="full" className="w-full text-lg font-bold">Next</Button>
      </ModalFooter>
    </>
  )
}

export default Step1;
