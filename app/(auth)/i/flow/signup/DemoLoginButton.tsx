import { signinWithCredentials } from "@/app/_lib/actions";
import PageLockLoading from "@/app/_ui/PageLockLoading";
import { Button } from "@nextui-org/button";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import React, { useTransition } from "react";

function DemoLoginButton() {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const t = useTranslations();
  return (
    <>
      <Button
        onClick={async () => {
          startTransition(async () => {
            await signinWithCredentials({
              email_username: "wyattmohammad1371017@gmail.com",
              password: "12345678",
            });
            router.replace("/home");
          });
        }}
        variant="ghost"
        radius="full"
      >
        {t("testSignin")}
      </Button>
      {isPending && <PageLockLoading />}
    </>
  );
}

export default DemoLoginButton;
