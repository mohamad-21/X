import React from 'react';
import { PasswordData } from "@/app/_lib/definitions";
import { ModalBody, ModalFooter } from "@nextui-org/modal";
import { Button, Input } from "@nextui-org/react";
import { useRef } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";
import { StepsProps } from "./PasswordResetFlow";
import { zodResolver } from "@hookform/resolvers/zod";
import { changePassword } from "@/app/_lib/actions";
import { useRouter } from "next/navigation";

interface PasswordResetData extends PasswordData {
  confirmPassword: string;
}

const StrongPasswordScheme: z.ZodType<PasswordResetData> = z.object({
  password: z.string()
    .min(8, "Your password needs to be at least 8 characters. Please enter a longer one."),
  confirmPassword: z.string()
})
  .refine(({ password, confirmPassword }) => password === confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

function Step3({ flow, setFlow, onTransition }: StepsProps) {
  const formRef = useRef<HTMLFormElement>(null);
  const { register, handleSubmit, formState: { isValid, errors } } = useForm<PasswordResetData>({
    mode: 'onTouched',
    resolver: zodResolver(StrongPasswordScheme)
  });
  const router = useRouter();

  const onSubmit: SubmitHandler<PasswordResetData> = (data) => {
    setFlow(prev => ({ ...prev, error: null }));
    onTransition(async () => {
      const error = await changePassword(flow.email!, data.password);
      if (error) return setFlow(prev => ({ ...prev, error: error.message! }));
      router.push('/api/auth/logout');
    })
  }

  return (
    <>
      <ModalBody>
        <div className="flex flex-col gap-5">
          <div>
            <h1 className="text-3xl mb-3 font-bold">Choose a new password</h1>
            <p className="text-[15px] mb-5 text-darkgray">Make sure your new password is 8 characters or more. Try including numbers, letters, and punctuation marks for a strong password. </p>
            <p className="text-[15px] text-darkgray">You&apos;ll be logged out of all active X sessions after your password is changed.</p>
          </div>
          <form ref={formRef} onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5 mt-4">
            <Input
              type="password"
              variant="bordered"
              radius="sm"
              color="primary"
              label="Enter a new password"
              classNames={{
                label: "text-darkgray text-base"
              }}
              {...register("password")}
              errorMessage={errors?.password?.message}
              isInvalid={Boolean(errors?.password?.message)}
            />
            <Input
              type="password"
              variant="bordered"
              radius="sm"
              color="primary"
              label="Confirm your password"
              classNames={{
                label: "text-darkgray text-base"
              }}
              {...register("confirmPassword")}
              errorMessage={errors?.confirmPassword?.message}
              isInvalid={Boolean(errors?.confirmPassword?.message)}
            />
          </form>
        </div>
      </ModalBody>
      <ModalFooter>
        <Button color="secondary" onClick={() => formRef.current?.requestSubmit()} isDisabled={!isValid} size="lg" radius="full" className="w-full text-lg font-bold">Change password</Button>
      </ModalFooter>
    </>
  )
}

export default Step3;
