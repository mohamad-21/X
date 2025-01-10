import { useAppDispatch, useAppSelector } from "@/app/_lib/hooks";
import { Button, Input, ModalBody, ModalFooter } from "@nextui-org/react";
import Link from "next/link";
import React, { SyntheticEvent, useRef, useState } from "react";
import Alert from "@/app/_ui/Alert";
import { signinWithCredentials } from "@/app/_lib/actions";
import { useRouter } from "next/navigation";
import { setLoginData } from "@/app/_lib/slices/userSlice";
import { useTranslations } from "next-intl";

function Step2({
  onTransition,
}: {
  onTransition: (callback: () => Promise<any>) => void;
}) {
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const loginState = useAppSelector((state) => state.user.login);
  const dispatch = useAppDispatch();
  const formRef = useRef<HTMLFormElement>(null);
  const router = useRouter();
  const t = useTranslations();

  function handleSubmit(e: SyntheticEvent) {
    e.preventDefault();
    setError(null);
    if (!password) return;
    onTransition(async () => {
      const error = await signinWithCredentials({
        email_username: loginState.email_username!,
        password,
      });
      setPassword("");
      if (error) {
        setError(error.message!);
        return;
      }
      dispatch(setLoginData({ email_username: null, step: 1 }));
      router.push("/");
    });
  }

  return (
    <>
      <ModalBody>
        <div className="flex flex-col gap-9">
          <h1 className="text-3xl font-bold">
            {t("loginFlow.enterYourPassword")}
          </h1>
          <form
            ref={formRef}
            onSubmit={handleSubmit}
            className="flex flex-col gap-6"
          >
            <Input
              size="lg"
              variant="faded"
              defaultValue={loginState.email_username!}
              isReadOnly
              radius="sm"
              isDisabled
              classNames={{
                label: "text-lg",
              }}
              label={`${t("email")} ${t("or")} ${t("username")}`}
            />
            <div>
              <Input
                type="password"
                size="lg"
                variant="bordered"
                color="primary"
                label={t("password")}
                className="mb-1.5"
                radius="sm"
                autoFocus
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                classNames={{
                  label: "text-lg text-default-400",
                }}
              />
              <Link className="text-sm" href="/i/flow/password_reset">
                {t("forgotPassword")}
              </Link>
            </div>
          </form>
        </div>
      </ModalBody>
      <ModalFooter className="flex-col">
        <Button
          isDisabled={!password.trim()}
          onClick={() => formRef.current!.requestSubmit()}
          size="lg"
          radius="full"
          className="w-full text-lg font-bold mb-4"
        >
          {t("signin")}
        </Button>
        <p className="text-default-400">
          {t("loginFlow.dontHaveAnAccount")}{" "}
          <Link href="/signup">{t("signup")}</Link>
        </p>
      </ModalFooter>
      {error && <Alert>{error}</Alert>}
    </>
  );
}

export default Step2;
