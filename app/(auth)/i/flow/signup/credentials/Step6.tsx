import { useAppDispatch } from "@/app/_lib/hooks";
import { setSignupData } from "@/app/_lib/slices/userSlice";
import { BellOutlined } from "@ant-design/icons";
import { Button } from "@nextui-org/button";
import { ModalBody } from "@nextui-org/modal";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

function Step6() {
  const [requestedPermission, setRequestedPermission] = useState(false);
  const router = useRouter();
  const dispatch = useAppDispatch();

  async function allowNotification() {
    await Notification.requestPermission();
    setRequestedPermission(true);
  }

  useEffect(() => {
    if (requestedPermission) {
      dispatch(setSignupData({ data: null, step: 1 }));
      router.push('/home');
    }
  }, [requestedPermission, dispatch, router]);

  return (
    <ModalBody className="flex flex-col justify-center gap-7">
      <div className="text-center text-[3.6rem] text-primary">
        <BellOutlined />
      </div>
      <div>
        <h1 className="text-3xl mb-2 font-bold">Turn on notifications</h1>
        <p className="text-[15px] text-darkgray">Get the most out of x by staying up to date with what&apos;s happening</p>
      </div>
      <div className="flex flex-col gap-4">
        <Button color="secondary" onClick={allowNotification} className="w-full font-bold" size="lg" radius="full">Allow notifications</Button>
        <Button onClick={() => router.push('/home')} variant="bordered" className="w-full font-bold" size="lg" radius="full">Skip for now</Button>
      </div>
    </ModalBody>
  )
}

export default Step6;
