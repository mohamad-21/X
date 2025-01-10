import React, { useState } from "react";
import OAuthButton from "@/app/_ui/OAuthButton";
import GoogleIcon from "@/app/_ui/GoogleIcon";
import { Button, Input, ModalBody } from "@nextui-org/react";
import {
  checkExistsUserByEmailUsername,
  signinWithGoogle,
} from "@/app/_lib/actions";
import { useAppDispatch, useAppSelector } from "@/app/_lib/hooks";
import { setLoginData } from "@/app/_lib/slices/userSlice";
import Alert from "@/app/_ui/Alert";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";

export default function LoginForm({
  onTransition,
}: {
  onTransition: (callback: () => Promise<any>) => void;
}) {
  const dispatch = useAppDispatch();
  const loginData = useAppSelector((state) => state.user.login);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const t = useTranslations();

  async function handleSearch() {
    setError(null);
    onTransition(async () => {
      const existsUser = await checkExistsUserByEmailUsername(
        loginData.email_username!
      );
      if (!existsUser) return setError(t("weCouldNotFindYourAccount"));

      dispatch(setLoginData({ ...loginData, step: 2 }));
    });
  }

  return (
    <>
      <ModalBody>
        <div className="w-full max-w-[300px] mx-auto">
          <div className="flex flex-col gap-9 justify-center">
            <h1 className="text-3xl font-bold">{t("signinToX")}</h1>
            <div className="flex flex-col gap-3">
              <form action={signinWithGoogle}>
                <OAuthButton logo={<GoogleIcon />}>
                  <span className="text-[15px]">{t("signinWithGoogle")}</span>
                </OAuthButton>
              </form>
              <div className="relative flex items-center justify-center before:absolute before:left-0 after:right-0 after:absolute before:bg-gray-700 before:h-[0.2px] before:w-[45%]  after:bg-gray-700 after:h-[0.2px] after:w-[45%]">
                <span className="relative ">{t("or")}</span>
              </div>
              <Input
                variant="bordered"
                radius="sm"
                color="primary"
                label={`${t("email")} ${t("or")} ${t("username")}`}
                classNames={{
                  label: "text-default-400 text-base",
                }}
                onChange={(e) =>
                  dispatch(
                    setLoginData({
                      email_username: e.target.value,
                      step: loginData.step,
                    })
                  )
                }
              />
            </div>
            <div>
              <Button
                color="secondary"
                className="w-full font-bold text-base mb-5"
                radius="full"
                onClick={handleSearch}
              >
                {t("next")}
              </Button>
              <Button
                onClick={() => router.push("/i/flow/password_reset")}
                variant="bordered"
                className="w-full font-bold text-base border border-default-400"
                radius="full"
              >
                {t("forgotPassword")}
              </Button>
            </div>
          </div>
        </div>
      </ModalBody>
      {error && <Alert>{error}</Alert>}
    </>
  );
}
