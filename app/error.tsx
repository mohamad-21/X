"use client";

import { Button } from "@nextui-org/button";
import { TbReload } from "react-icons/tb";

function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  console.error(error);

  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center">
      <h1 className="text-xl mb-4 text-default-400">
        Something went wrong. try reloading.
      </h1>
      <Button
        color="primary"
        radius="full"
        className="w-max gap-1 text-base font-bold"
        onClick={reset}
      >
        <TbReload size={20} />
        <span>Retry</span>
      </Button>
    </div>
  );
}

export default Error;
