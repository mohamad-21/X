import { ModalBody, ModalFooter, ModalHeader } from "@nextui-org/modal";
import React, { useRef } from "react";
import Logo from "@/app/_ui/Logo";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@nextui-org/button";
import { Input } from "@nextui-org/react";
import Link from "next/link";
import { useAppSelector } from "@/app/_lib/hooks";
import { signupWithCredentials } from "@/app/_lib/actions";
import { PasswordData, PasswordScheme } from "@/app/_lib/definitions";
import { useDispatch } from "react-redux";
import Alert from "@/app/_ui/Alert";
import { setSignupData } from "@/app/_lib/slices/userSlice";
import { useSession } from "next-auth/react";


function Step3({ onTransition }: { onTransition: (callback: () => Promise<any>) => void }) {
  const formRef = useRef<HTMLFormElement>(null);
  const signupState = useAppSelector(state => state.user.signup.data);
  const dispatch = useDispatch();
  const { update } = useSession();

  const { register, handleSubmit, formState: { errors, isValid }, setError } = useForm<PasswordData>({
    mode: 'onTouched',
    resolver: zodResolver(PasswordScheme),
  });

  const onSubmit: SubmitHandler<PasswordData> = async (data) => {
    onTransition(async () => {
      const error = await signupWithCredentials({ ...signupState!, ...data });
      if (error) return setError('root', {
        message: error.message
      });
      update('trigger');
      dispatch(setSignupData({ data: { ...signupState! }, step: 4 }));
    })
  }

  return (
    <>
      <ModalHeader className="mx-auto">
        <Logo width={27} height={27} />
      </ModalHeader>
      <ModalBody>
        <h1 className="text-3xl font-bold">You&apos;ll need password</h1>
        <p className="text-[15px] text-darkgray">Make sure it&apos;s 8 characters or more.</p>
        <form ref={formRef} onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5 mt-4">
          <Input
            type="password"
            variant="bordered"
            color="primary"
            radius="sm"
            label="Password"
            size="lg"
            autoFocus
            classNames={{
              label: "text-darkgray"
            }}
            errorMessage={errors?.password?.message}
            isInvalid={Boolean(errors?.password?.message)}
            {...register('password')}
          />
        </form>
      </ModalBody>
      <ModalFooter className="flex flex-col items-center justify-center py-6 ">
        <p className="text-darkgray text-[13px] mb-3">
          By signing up, you agree to the <Link href="/tos">Terms of Service</Link> and <Link href="/policy">Privacy Policy</Link> including <Link href="/rules-and-policies/twitter-cookies">Cookie Use</Link>. X may use your information, including your email address and phone number for purposes outlined in our Privacy Policy, like keeping your account secure and personalizing our services, including ads. <Link href="#">Learn more</Link>. Others will be able to find you by email or phone number, when provided, unless you choose otherwise <Link href="#">here</Link>.
        </p>
        <Button color="secondary" onClick={() => formRef?.current?.requestSubmit()} className="w-full text-lg font-bold" size="lg" radius="full" isDisabled={!isValid}>Sign up</Button>
      </ModalFooter>
      {errors?.root?.message && (
        <Alert>{errors.root.message}</Alert>
      )}
    </>
  )
}

export default Step3;
