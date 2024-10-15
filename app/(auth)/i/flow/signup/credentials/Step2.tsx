import { ModalBody, ModalFooter, ModalHeader } from "@nextui-org/modal";
import React, { useRef } from "react";
import Logo from "@/app/_ui/Logo";
import { Button, Input } from "@nextui-org/react";
import { SubmitHandler, useForm } from "react-hook-form";
import { VerificationData, VerificationScheme } from "@/app/_lib/definitions";
import { zodResolver } from "@hookform/resolvers/zod";
import { checkVerificationCode } from "@/app/_lib/actions";
import { useAppDispatch, useAppSelector } from "@/app/_lib/hooks";
import Alert from "@/app/_ui/Alert";
import { setSignupData } from "@/app/_lib/slices/userSlice";

function Step2({ onTransition }: { onTransition: (callback: () => Promise<any>) => void }) {
  const formRef = useRef<HTMLFormElement>(null);
  const signupState = useAppSelector(state => state.user.signup.data);
  const dispatch = useAppDispatch();

  const { register, handleSubmit, formState: { errors, isValid }, setError } = useForm<VerificationData>({
    mode: 'onTouched',
    resolver: zodResolver(VerificationScheme)
  })

  const onSubmit: SubmitHandler<VerificationData> = async (data) => {
    onTransition(async () => {
      const error = await checkVerificationCode(signupState!.email!, data.code);
      if (!error) {
        return dispatch(setSignupData({ data: { ...signupState! }, step: 3 }));
      }
      setError('root', {
        message: error?.message || 'an error occurred'
      });
    })
  }

  return (
    <>
      <ModalHeader className="mx-auto">
        <Logo width={27} height={27} />
      </ModalHeader>
      <ModalBody>
        <h1 className="text-3xl font-bold">We sent you a code</h1>
        <p className="text-[15px] text-darkgray">Enter it below to verify wyattmohammad1371017@gmail.com.</p>
        <form ref={formRef} onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5 mt-4">
          <Input
            variant="bordered"
            radius="sm"
            color="primary"
            size="lg"
            label="Verification code"
            classNames={{
              label: "text-darkgray"
            }}
            errorMessage={errors?.code?.message}
            isInvalid={Boolean(errors?.code?.message)}
            {...register('code')}
          />
        </form>
      </ModalBody>
      <ModalFooter className="flex justify-center border-t border-t-gray-700">
        <Button color="secondary" onClick={() => formRef?.current?.requestSubmit()} className="w-full font-bold text-lg" size="lg" radius="full" isDisabled={!isValid}>Next</Button>
      </ModalFooter>
      {errors?.root?.message && (
        <Alert>{errors.root.message}</Alert>
      )}
    </>
  )
}

export default Step2;
