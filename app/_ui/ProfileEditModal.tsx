"use client";

import { ITwitt, User } from "@/app/_lib/definitions";
import { useModalProps } from "@/app/_lib/hooks";
import { Button } from "@nextui-org/button";
import { Modal, ModalBody, ModalContent, ModalHeader, useDisclosure } from "@nextui-org/modal";
import { Input, Textarea } from "@nextui-org/react";
import { usePathname, useRouter } from "next/navigation";
import React, { useEffect, useRef, useState, useTransition } from "react";
import { MdAddAPhoto, MdClose } from "react-icons/md";
import { updateUserInfo } from "@/app/_lib/actions";
import LoadingSpinner from "./LoadingSpinner";
import Alert from "./Alert";
import { useSession } from "next-auth/react";

type UserInfo = {
  name: string;
  profile: {
    upload: File | null;
    default: string;
    temp: string | null;
  };
  header_photo: {
    upload: File | null;
    default: string | null;
    temp: string | null;
  };
  bio: string | null;
  website: string | null;
  location: string | null;
  birthday: Date | null;
}

function ProfileEditModal({ user }: { user: User & { twitts: ITwitt[] } }) {

  const initialUserInfo = {
    name: user.name,
    profile: {
      upload: null,
      default: user.profile,
      temp: null
    },
    header_photo: {
      upload: null,
      default: user.header_photo,
      temp: null
    },
    bio: user.bio,
    website: user.website,
    location: user.location,
    birthday: user.birthday,
  };
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [userInfo, setUserInfo] = useState<UserInfo>(initialUserInfo);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<null | string>(null);
  const headerPhotoUploadRef = useRef<HTMLInputElement>(null);
  const profilePhotoUploadRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const pathname = usePathname();
  const { update } = useSession();

  function handleUploadChange(e: React.ChangeEvent<HTMLInputElement>) {
    const inputName = e.target.name;
    const file = e.target?.files?.[0];
    if (!file) return;
    if (inputName !== 'profile' && inputName !== 'header_photo') return;
    setUserInfo((prevState) => ({
      ...prevState,
      [inputName]: {
        upload: file,
        temp: URL.createObjectURL(file)
      }
    }));
  }

  async function handleProfileEdit() {
    setError(null);
    const formData = new FormData();
    formData.set("name", userInfo.name);
    formData.set("email", user.email);
    formData.set("username", user.username);
    formData.set("bio", userInfo.bio || '');
    formData.set("website", userInfo.website || '');
    formData.set("location", userInfo.location || '');
    formData.set("header_photo_upload", userInfo.header_photo.upload || '');
    formData.set("profile_photo_upload", userInfo.profile.upload || '');
    startTransition(async () => {
      const error = await updateUserInfo(formData);
      if (error) return setError(error.message);
      update('trigger');
      router.replace(`/${user.username}`);
    })
  }

  useEffect(() => {
    onOpen();
    if (pathname !== `/${user.username}/settings/profile`) onClose();

    return () => {
      onClose();
      setUserInfo(initialUserInfo);
    }
  }, [pathname]);

  useEffect(() => {
    if (userInfo.header_photo.temp || userInfo.profile.temp) {
      return () => {
        if (userInfo.header_photo.temp) {
          URL.revokeObjectURL(userInfo.header_photo.temp);
        }
        if (userInfo.profile.temp) {
          URL.revokeObjectURL(userInfo.profile.temp);
        }
      }
    }
  }, [userInfo.header_photo, userInfo.profile]);

  return (
    <Modal isOpen={isOpen} onOpenChange={(isOpen) => {
      if (!isOpen) router.back();
    }} {...useModalProps({ size: "xl", classNames: { header: "ml-8", body: '!px-0' } })}
    >
      <ModalContent>
        <ModalHeader className="flex items-center justify-between">
          <h2 className="text-xl">Edit Profile</h2>
          <Button type="submit" onClick={handleProfileEdit} isLoading={isPending} spinner={<LoadingSpinner size="sm" noPadding />} size="sm" className="text-base" color="secondary" radius="full">Save</Button>
        </ModalHeader>
        <ModalBody className="-mt-8">
          <div className="min-h-[200px] overflow-hidden flex items-center justify-center relative">
            {userInfo.header_photo.default || userInfo.header_photo.temp ? (
              <div className="min-h-[200px] w-full">
                <img src={userInfo.header_photo.temp! || userInfo.header_photo.default!} alt={userInfo.name} />
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center gap-5">
                  <Button variant="flat" size="lg" isIconOnly radius="full" onClick={() => headerPhotoUploadRef.current?.click()}>
                    <MdAddAPhoto size={20} />
                  </Button>
                  <Button variant="flat" onClick={() => setUserInfo((prev) => ({ ...prev, header_photo: { upload: null, default: null, temp: null } }))} size="lg" isIconOnly radius="full">
                    <MdClose size={24} />
                  </Button>
                </div>
              </div>
            ) : (
              <Button variant="flat" size="lg" isIconOnly radius="full" onClick={() => headerPhotoUploadRef.current?.click()}>
                <MdAddAPhoto size={20} />
              </Button>
            )}
          </div>
          <input type="file" ref={headerPhotoUploadRef} name="header_photo" onChange={handleUploadChange} hidden accept="image/png, image/jpeg, image/webp" />
          <input type="file" ref={profilePhotoUploadRef} name="profile" onChange={handleUploadChange} hidden accept="image/png, image/jpeg, image/webp" />
          <div className="flex flex-col gap-4 px-[20px]">
            <div className="relative rounded-full -translate-y-14 w-[110px] h-[110px] overflow-hidden">
              <img src={userInfo.profile.temp || userInfo.profile.default} width={110} height={110} alt={userInfo.name} className="brightness-50 h-[110px] w-[110px] object-cover" />
              <Button variant="light" onClick={() => profilePhotoUploadRef.current?.click()} size="lg" isIconOnly radius="full" className="absolute top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2">
                <MdAddAPhoto size={20} />
              </Button>
            </div>
            <Input
              label="Name"
              value={userInfo.name}
              onChange={(e) => setUserInfo(prev => ({ ...prev, name: e.target.value }))}
              variant="bordered"
              color="primary"
              radius="sm"
              size="lg"
              classNames={{
                label: "text-default-400"
              }}
            />
            <Textarea
              label="Bio"
              value={userInfo.bio || ''}
              onChange={(e) => setUserInfo(prev => ({ ...prev, bio: e.target.value }))}
              variant="bordered"
              color="primary"
              radius="sm"
              maxRows={2}
              size="lg"
              classNames={{
                label: "text-default-400"
              }}
            />
            <Input
              label="Location"
              value={userInfo.location || ''}
              onChange={(e) => setUserInfo(prev => ({ ...prev, location: e.target.value }))}
              variant="bordered"
              color="primary"
              radius="sm"
              size="lg"
              classNames={{
                label: "text-default-400"
              }}
            />
            <Input
              label="Website"
              type="url"
              value={userInfo.website || ''}
              onChange={(e) => setUserInfo(prev => ({ ...prev, website: e.target.value }))}
              variant="bordered"
              color="primary"
              radius="sm"
              size="lg"
              classNames={{
                label: "text-default-400"
              }}
            />
          </div>
        </ModalBody>
        {error && (
          <Alert>{error}</Alert>
        )}
      </ModalContent>
    </Modal>
  )
}

export default ProfileEditModal;
