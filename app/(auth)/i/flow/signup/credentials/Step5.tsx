import { ModalBody, ModalFooter, ModalHeader } from "@nextui-org/modal";
import React, { ChangeEvent, useEffect, useRef, useState } from "react";
import Logo from "@/app/_ui/Logo";
import { Button } from "@nextui-org/button";
import { Input } from "@nextui-org/react";
import { z } from "zod";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CheckCircleFilled, ExclamationCircleFilled } from "@ant-design/icons";
import { updateUsername, usernameIsUnique } from "@/app/_lib/actions";
import { useAppDispatch, useAppSelector } from "@/app/_lib/hooks";
import Alert from "@/app/_ui/Alert";
import { setSignupData } from "@/app/_lib/slices/userSlice";
import { useSession } from "next-auth/react";
import { useLocale, useTranslations } from "next-intl";

interface Username {
  username?: string;
}

const UsernameScheme: z.ZodType<Username> = z.object({
  username: z
    .string()
    .min(4, "Your username must be longer than 4 characters.")
    .max(15, "Your username must be shorter than 15 characters.")
    .refine(
      (value) => /^[a-zA-Z0-9_]+$/.test(value),
      "Your username can only contain letters, numbers and _"
    )
    .optional(),
});

const UsernameSchemeFa: z.ZodType<Username> = z.object({
  username: z
    .string()
    .min(4, "نام کاربری شما باید بیشتر از 4 کاراکتر باشد.")
    .max(15, "نام کاربری شما باید کمتر از 15 کاراکتر باشد.")
    .refine(
      (value) => /^[a-zA-Z0-9_]+$/.test(value),
      "نام کاربری شما فقط می تواند شامل حروف، اعداد و _ باشد."
    )
    .optional(),
});

function Step5({
  onTransition,
}: {
  onTransition: (callback: () => Promise<any>) => void;
}) {
  const [username, setUsername] = useState("");
  const formRef = useRef<HTMLFormElement>(null);
  const signupState = useAppSelector((state) => state.user.signup.data);
  const dispatch = useAppDispatch();
  const t = useTranslations();
  const locale = useLocale();
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    setError,
    watch,
  } = useForm<Username>({
    mode: "onTouched",
    resolver: zodResolver(locale === "fa" ? UsernameSchemeFa : UsernameScheme),
  });
  const { update } = useSession();

  useEffect(() => {
    if (username.length < 4) return;
    const timeout = setTimeout(async () => {
      const isUnqiue = await usernameIsUnique(username);
      if (!isUnqiue)
        return setError("username", {
          message: t("usernameAlreadyTaken_chooseDifferent"),
        });
    }, 300);
    return () => clearTimeout(timeout);
  }, [username, setError]);

  function checkUsername(e: ChangeEvent<HTMLInputElement>) {
    setUsername(e.target.value);
  }

  const onSubmit: SubmitHandler<Username> = (data) => {
    onTransition(async () => {
      const error = await updateUsername(data.username!, signupState?.email!);
      if (error) {
        return setError("root", {
          message: error.message,
        });
      }
      update("trigger");
      dispatch(setSignupData({ data: { ...signupState! }, step: 6 }));
    });
  };

  return (
    <>
      <ModalHeader className="mx-auto">
        <Logo width={27} height={27} />
      </ModalHeader>
      <ModalBody>
        <h1 className="text-3xl font-bold">
          {t("credentialsSignup.whatShouldWeCallYou")}
        </h1>
        <p className="text-[15px] text-default-400">
          {t("credentialsSignup.youCanChangeUsernameLater")}
        </p>
        <form
          ref={formRef}
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col gap-5 mt-5"
        >
          <Input
            variant="bordered"
            color="primary"
            radius="sm"
            size="lg"
            classNames={{
              label: "text-default-400",
            }}
            onInput={checkUsername}
            autoFocus
            startContent={
              watch().username?.length ? (
                <span className="text-primary">@</span>
              ) : null
            }
            endContent={
              <>
                {watch().username?.length ? (
                  errors?.username?.message ? (
                    <ExclamationCircleFilled className="text-danger" />
                  ) : (
                    <CheckCircleFilled className="text-success" />
                  )
                ) : null}
              </>
            }
            label={t("username")}
            {...register("username")}
            errorMessage={watch().username?.length && errors?.username?.message}
            isInvalid={Boolean(
              watch().username?.length && errors?.username?.message
            )}
          />
        </form>
      </ModalBody>
      <ModalFooter className="flex justify-center border-t border-t-gray-700">
        <Button
          onClick={() =>
            watch().username?.length
              ? formRef.current?.requestSubmit()
              : dispatch(setSignupData({ data: { ...signupState! }, step: 6 }))
          }
          isDisabled={watch().username?.length ? !isValid : false}
          variant={watch().username?.length ? undefined : "bordered"}
          color={watch().username?.length ? "secondary" : undefined}
          className="w-full text-lg font-bold"
          size="lg"
          radius="full"
        >
          {watch().username?.length ? t("next") : t("skipForNow")}
        </Button>
      </ModalFooter>

      {errors?.root?.message && <Alert>{errors.root.message}</Alert>}
    </>
  );
}

export default Step5;
