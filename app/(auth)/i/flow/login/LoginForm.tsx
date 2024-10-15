import React, { useState } from "react";
import OAuthButton from "@/app/_ui/OAuthButton";
import GoogleIcon from "@/app/_ui/GoogleIcon";
import { AppleFilled } from "@ant-design/icons";
import { Button, Input, ModalBody } from "@nextui-org/react";
import { checkExistsUserByEmailUsername, signinWithGoogle } from "@/app/_lib/actions";
import { useAppDispatch, useAppSelector } from "@/app/_lib/hooks";
import { setLoginData } from "@/app/_lib/slices/userSlice";
import Alert from "@/app/_ui/Alert";
import { useRouter } from "next/navigation";

export default function LoginForm({ onTransition }: { onTransition: (callback: () => Promise<any>) => void }) {
  const dispatch = useAppDispatch();
  const loginData = useAppSelector(state => state.user.login);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  async function handleSearch() {
    setError(null);
    onTransition(async () => {
      const existsUser = await checkExistsUserByEmailUsername(loginData.email_username!);
      if (!existsUser) return setError("sorry, we could not find your account");

      dispatch(setLoginData({ ...loginData, step: 2 }));
    })
  }

  return (
    <>
      <ModalBody>
        <div className="w-full max-w-[300px] mx-auto">
          <div className="flex flex-col gap-9 justify-center">
            <h1 className="text-3xl font-bold">Sign in to X </h1>
            <div className="flex flex-col gap-3">
              <form action={signinWithGoogle}>
                <OAuthButton logo={<GoogleIcon />}><span className="text-[15px]">Sign in with Google</span></OAuthButton>
              </form>
              <OAuthButton logo={<AppleFilled width={30} height={30} />}>Sign in with Apple</OAuthButton>
              <div className="relative flex items-center justify-center before:absolute before:left-0 after:right-0 after:absolute before:bg-gray-700 before:h-[0.2px] before:w-[45%]  after:bg-gray-700 after:h-[0.2px] after:w-[45%]">
                <span className="relative ">or</span>
              </div>
              <Input
                variant="bordered"
                radius="sm"
                color="primary"
                label="Phone, email, or username"
                classNames={{
                  label: "text-darkgray text-base"
                }}
                onChange={(e) => dispatch(setLoginData({ email_username: e.target.value, step: loginData.step }))}
              />
            </div>
            <div>
              <Button color="secondary" className="w-full font-bold text-base mb-5" radius="full" onClick={handleSearch}>Next</Button>
              <Button onClick={() => router.push('/i/flow/password_reset')} variant="bordered" className="w-full font-bold text-base border border-darkgray" radius="full">Forgot Password?</Button>
            </div>
          </div>
        </div>
      </ModalBody>
      {error && <Alert>{error}</Alert>}
    </>
  )
}
