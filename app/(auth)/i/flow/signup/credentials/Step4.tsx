import { ModalBody, ModalFooter, ModalHeader } from "@nextui-org/modal";
import React, { ChangeEvent, useState } from "react";
import Logo from "@/app/_ui/Logo";
import { Avatar, Button } from "@nextui-org/react";
import { CameraOutlined } from "@ant-design/icons";
import { uploadProfile } from "@/app/_lib/actions";
import { useAppDispatch, useAppSelector } from "@/app/_lib/hooks";
import { setSignupData } from "@/app/_lib/slices/userSlice";
import { useSession } from "next-auth/react";

function Step4({ onTransition }: { onTransition: (callback: () => Promise<any>) => void }) {
  const [error, setError] = useState<string | null>(null);
  const user = useAppSelector(state => state.user.signup.data);
  const dispatch = useAppDispatch();
  const { update } = useSession();

  async function handleUpload(e: ChangeEvent<HTMLInputElement>) {
    setError(null);
    if (error) return;
    onTransition(async () => {
      const file = e.target.files![0];
      const formData = new FormData();
      formData.append('upload', file);
      formData.append('email', user!.email);
      try {
        await uploadProfile(formData);
      } catch (err: any) {
        return setError(err.message);
      }
      update('trigger');
      dispatch(setSignupData({ data: { ...user! }, step: 5 }));
    })
  }

  return (
    <>
      <ModalHeader className="mx-auto">
        <Logo width={27} height={27} />
      </ModalHeader>
      <ModalBody>
        <h1 className="text-3xl font-bold">Pick a profile picture</h1>
        <p className="text-[15px] text-darkgray">Have a favorite selfie? Upload it now.</p>
        <form className="flex flex-col gap-5 mt-2">
          <div className="relative w-[200px] h-[200px] mt-12 mx-auto">
            <Button color={error ? 'danger' : undefined} isIconOnly radius="full" className={`w-full h-full text-foreground ${error ? '' : 'bg-transparent'}`}>
              <label className="cursor-pointer" htmlFor="upload">
                <Avatar src="/images/default_pic.jpg" className="w-full h-full border-2 border-gray-500 z-0 relative" />
                <div className="absolute top-1/2 left-1/2 -translate-y-[70%] -translate-x-1/2 text-xl z-20 bg-gray-900 h-10 w-10 flex items-center justify-center rounded-full">
                  <CameraOutlined />
                </div>
              </label>
            </Button>
          </div>
          {error && <p className="text-danger-400 mx-auto text-sm">{error}</p>}
          <input
            type="file"
            className="hidden"
            hidden
            id="upload"
            onChange={handleUpload}
            accept="image/png,image/jpeg, image/webp"
          />
        </form>
      </ModalBody>
      <ModalFooter className="flex justify-center border-t border-t-gray-700">
        <Button onClick={() => dispatch(setSignupData({ data: { ...user! }, step: 5 }))} variant="bordered" className="w-full font-bold" size="lg" radius="full">Skip for now</Button>
      </ModalFooter>
    </>
  )
}

export default Step4;
