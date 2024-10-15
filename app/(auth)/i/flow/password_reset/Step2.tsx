import React, { SyntheticEvent, useRef } from "react";
import { StepsProps } from "./PasswordResetFlow";
import { ModalBody, ModalFooter } from "@nextui-org/modal";
import { Button, Input } from "@nextui-org/react";
import { checkVerificationCode } from "@/app/_lib/actions";

function Step2({ flow, setFlow, onTransition }: StepsProps) {
  const formRef = useRef<HTMLFormElement>(null);

  function handleSubmit(e: SyntheticEvent) {
    e.preventDefault();
    setFlow(prev => ({ ...prev, error: null }));
    onTransition(async () => {
      const error = await checkVerificationCode(flow.email!, flow.code!);
      if (error) return setFlow(prev => ({ ...prev, error: error.message! }));
      setFlow(prev => ({ ...prev, step: 3 }));
    });
  }

  return (
    <>
      <ModalBody>
        <div className="flex flex-col gap-9">
          <div>
            <h1 className="text-3xl mb-2 font-bold">We sent you a code</h1>
            <p className="text-[15px] text-darkgray">Check your email to get your confirmation code. If you need to request a new code, go back and reselect a confirmation.</p>
          </div>
          <form ref={formRef} onSubmit={handleSubmit} className="flex flex-col gap-5 mt-4">
            <Input
              variant="bordered"
              radius="sm"
              color="primary"
              size="lg"
              value={flow.code}
              onChange={(e) => setFlow(prev => ({ ...prev, code: e.target.value }))}
              label="Enter your code"
              classNames={{
                label: "text-darkgray text-lg"
              }}
            />
          </form>
        </div>
      </ModalBody>
      <ModalFooter>
        <Button color="secondary" onClick={() => formRef.current?.requestSubmit()} isDisabled={!flow.code} size="lg" radius="full" className="w-full text-lg font-bold">Next</Button>
      </ModalFooter>
    </>
  )
}

export default Step2;
