"use client";

import { Button } from "@nextui-org/button";
import { useLocale } from "next-intl";
import { TbReload } from "react-icons/tb";

function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const locale = useLocale();

  console.error(error);

  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center z-20">
      <h1 className="text-xl mb-4 text-default-400">
        {locale === "en" ? "Something went wrong. try reloading." : "مشکلی پیش آمد. بارگذاری مجدد را امتحان کنید"}
      </h1>
      <Button
        color="primary"
        radius="full"
        className="w-max gap-1 text-base font-bold"
        onClick={reset}
      >
        <TbReload size={20} />
        <span>{locale === "en" ? "Retry" : "دوباره امتحان کنید"}</span>
      </Button>
    </div>
  );
}

export default Error;
