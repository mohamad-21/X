import React, { useState } from "react";
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
import Alert from "@/app/_ui/Alert";
import { useLocale, useTranslations } from "next-intl";

interface PasswordResetData extends PasswordData {
  confirmPassword: string;
}

const StrongPasswordScheme: z.ZodType<PasswordResetData> = z
  .object({
    password: z
      .string()
      .min(
        8,
        "Your password needs to be at least 8 characters. Please enter a longer one."
      ),
    confirmPassword: z.string(),
  })
  .refine(({ password, confirmPassword }) => password === confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

const StrongPasswordSchemeFa: z.ZodType<PasswordResetData> = z
  .object({
    password: z
      .string()
      .min(
        8,
        "رمز عبور شما باید حداقل 8 کاراکتر باشد. لطفا یک طولانی تر وارد کنید."
      ),
    confirmPassword: z.string(),
  })
  .refine(({ password, confirmPassword }) => password === confirmPassword, {
    message: "گذرواژه ها مطابقت ندارند",
    path: ["confirmPassword"],
  });

function Step3({ flow, setFlow, onTransition }: StepsProps) {
  const [message, setMessage] = useState("");
  const formRef = useRef<HTMLFormElement>(null);
  const locale = useLocale();
  const t = useTranslations();
  const {
    register,
    handleSubmit,
    formState: { isValid, errors },
  } = useForm<PasswordResetData>({
    mode: "onTouched",
    resolver: zodResolver(
      locale === "fa" ? StrongPasswordSchemeFa : StrongPasswordScheme
    ),
  });
  const router = useRouter();

  const onSubmit: SubmitHandler<PasswordResetData> = (data) => {
    setFlow((prev) => ({ ...prev, error: null }));
    onTransition(async () => {
      const error = await changePassword(flow.email!, data.password);
      if (error) return setFlow((prev) => ({ ...prev, error: error.message! }));
      setMessage(t("passwordResetFlow.passwordResetedMessage"));
      setTimeout(() => {
        router.replace("/");
      }, 5000);
    });
  };

  return (
    <>
      <ModalBody>
        <div className="flex flex-col gap-5">
          <div>
            <h1 className="text-3xl mb-3 font-bold">
              {t("passwordResetFlow.chooseNewPassword")}
            </h1>
            <p className="text-[15px] mb-5 text-default-400">
              {t("passwordResetFlow.chooseNewPasswordDesc")}{" "}
            </p>
            <p className="text-[15px] text-default-400">
              {t("passwordResetFlow.chooseNewPasswordWarning")}
            </p>
          </div>
          <form
            ref={formRef}
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col gap-5 mt-4"
          >
            <Input
              type="password"
              variant="bordered"
              radius="sm"
              color="primary"
              label={t("passwordResetFlow.enterNewPassword")}
              classNames={{
                label: "text-default-400 text-base",
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
              label={t("passwordResetFlow.confirmNewPassword")}
              classNames={{
                label: "text-default-400 text-base",
              }}
              {...register("confirmPassword")}
              errorMessage={errors?.confirmPassword?.message}
              isInvalid={Boolean(errors?.confirmPassword?.message)}
            />
          </form>
        </div>
      </ModalBody>
      <ModalFooter>
        <Button
          color="secondary"
          onClick={() => formRef.current?.requestSubmit()}
          isDisabled={!isValid}
          size="lg"
          radius="full"
          className="w-full text-lg font-bold"
        >
          {t("passwordResetFlow.changePassword")}
        </Button>
      </ModalFooter>
      {message && <Alert>{message}</Alert>}
    </>
  );
}

export default Step3;
