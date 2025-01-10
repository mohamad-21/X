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
import {
  PasswordData,
  PasswordScheme,
  PasswordSchemeFa,
} from "@/app/_lib/definitions";
import { useDispatch } from "react-redux";
import Alert from "@/app/_ui/Alert";
import { setSignupData } from "@/app/_lib/slices/userSlice";
import { useSession } from "next-auth/react";
import { useLocale, useTranslations } from "next-intl";

function Step3({
  onTransition,
}: {
  onTransition: (callback: () => Promise<any>) => void;
}) {
  const formRef = useRef<HTMLFormElement>(null);
  const signupState = useAppSelector((state) => state.user.signup.data);
  const dispatch = useDispatch();
  const { update } = useSession();
  const t = useTranslations();
  const locale = useLocale();

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    setError,
  } = useForm<PasswordData>({
    mode: "onTouched",
    resolver: zodResolver(locale === "fa" ? PasswordSchemeFa : PasswordScheme),
  });

  const onSubmit: SubmitHandler<PasswordData> = async (data) => {
    onTransition(async () => {
      const error = await signupWithCredentials({ ...signupState!, ...data });
      if (error)
        return setError("root", {
          message: error.message,
        });
      update("trigger");
      dispatch(setSignupData({ data: { ...signupState! }, step: 4 }));
    });
  };

  return (
    <>
      <ModalHeader className="mx-auto">
        <Logo width={27} height={27} />
      </ModalHeader>
      <ModalBody>
        <h1 className="text-3xl font-bold">
          {t("credentialsSignup.youNeedPassword")}
        </h1>
        <p className="text-[15px] text-default-400">
          {t("credentialsSignup.passwordChoiceNote")}
        </p>
        <form
          ref={formRef}
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col gap-5 mt-4"
        >
          <Input
            type="password"
            variant="bordered"
            color="primary"
            radius="sm"
            label={t("password")}
            size="lg"
            autoFocus
            classNames={{
              label: "text-default-400",
            }}
            errorMessage={errors?.password?.message}
            isInvalid={Boolean(errors?.password?.message)}
            {...register("password")}
          />
        </form>
      </ModalBody>
      <ModalFooter className="flex flex-col items-center justify-center py-6 ">
        {locale === "fa" && (
          <p className="text-default-400 text-[13px] mb-3">
            با ثبت نام، با <Link href="/tos">شرایط خدمات</Link> و{" "}
            <Link href="#">سیاست حفظ حریم خصوصی</Link> از جمله{" "}
            <Link href="#">استفاده از کوکی</Link> موافقت می کنید. X ممکن است از
            اطلاعات شما، از جمله آدرس ایمیل و شماره تلفن شما برای اهدافی که در
            خط مشی رازداری ما مشخص شده است، مانند حفظ امنیت حساب شما و شخصی سازی
            خدمات ما، از جمله تبلیغات، استفاده کند.{" "}
            <Link href="#">بیشتر بدانید</Link>. در صورت ارائه، دیگران می توانند
            شما را از طریق ایمیل یا شماره تلفن پیدا کنند، مگر اینکه در{" "}
            <Link href="#">اینجا</Link> غیر از این انتخاب کنید.
          </p>
        )}
        {locale === "en" && (
          <p className="text-default-400 text-[13px] mb-3">
            By signing up, you agree to the{" "}
            <Link href="#">Terms of Service</Link> and{" "}
            <Link href="#">Privacy Policy</Link> including{" "}
            <Link href="#">Cookie Use</Link>. X may use your information,
            including your email address and phone number for purposes outlined
            in our Privacy Policy, like keeping your account secure and
            personalizing our services, including ads.{" "}
            <Link href="#">Learn more</Link>. Others will be able to find you by
            email or phone number, when provided, unless you choose otherwise{" "}
            <Link href="#">here</Link>.
          </p>
        )}
        <Button
          color="secondary"
          onClick={() => formRef?.current?.requestSubmit()}
          className="w-full text-lg font-bold"
          size="lg"
          radius="full"
          isDisabled={!isValid}
        >
          {t("signup")}
        </Button>
      </ModalFooter>
      {errors?.root?.message && <Alert>{errors.root.message}</Alert>}
    </>
  );
}

export default Step3;
