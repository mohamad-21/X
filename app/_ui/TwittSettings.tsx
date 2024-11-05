import { ITwitt, UserData } from "@/app/_lib/definitions";
import {
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from "@nextui-org/react";
import { useTranslations } from "next-intl";
import { Key } from "react";
import { BsStars } from "react-icons/bs";
import { FaRegComment } from "react-icons/fa";
import { GoTrash } from "react-icons/go";
import { HiOutlineDotsHorizontal } from "react-icons/hi";
import { LuUserPlus } from "react-icons/lu";
import { MdBlock, MdOutlinePushPin } from "react-icons/md";
import { RiPagesLine } from "react-icons/ri";

function TwittSettings({
  onMenuAction,
  twitt,
  user,
}: {
  onMenuAction: (e: Key) => void;
  twitt: ITwitt;
  user: UserData;
}) {
  const t = useTranslations();
  return (
    <Dropdown>
      <DropdownTrigger className="z-0">
        <Button
          variant="light"
          color="primary"
          isIconOnly
          size="sm"
          radius="full"
          startContent={
            <HiOutlineDotsHorizontal
              size="18"
              className="text-default-400 group-hover:text-primary"
            />
          }
        ></Button>
      </DropdownTrigger>
      <DropdownMenu
        variant="bordered"
        style={{
          boxShadow: "0 0 6px hsl(var(--nextui-default-200))",
        }}
        className="rounded-2xl overflow-hidden bg-background p-0 z-[0]"
        itemClasses={{
          base: "bg-background border-none text-lg hover:bg-default/20 p-3 w-full",
          title: "text-base font-bold",
        }}
        onAction={onMenuAction}
      >
        <DropdownItem
          className={`text-red-500 ${twitt.user_id != user.id ? "hidden" : ""}`}
          key="delete"
          hidden={twitt.user_id != user.id}
          startContent={<GoTrash />}
        >
          {t("delete")}
        </DropdownItem>
        <DropdownItem
          key={
            user.follows.followings.includes(twitt.user_id as number)
              ? "unfollow"
              : "follow"
          }
          className={`${user.id == twitt.user_id ? "hidden" : ""}`}
          hidden={twitt.user_id == user.id}
          startContent={<LuUserPlus />}
        >
          {user.follows.followings.includes(twitt.user_id as number)
            ? t("unfollow")
            : t("follow")}{" "}
          @{twitt.username}
        </DropdownItem>
        <DropdownItem
          key="block"
          className={`${user.id == twitt.user_id ? "hidden" : ""}`}
          hidden={twitt.user_id == user.id}
          startContent={<MdBlock />}
        >
          {t("block")} @{twitt.username}
        </DropdownItem>
        <DropdownItem
          key={twitt.is_pinned ? "unpin" : "pin"}
          startContent={<MdOutlinePushPin />}
          className={`${user.id != twitt.user_id ? "hidden" : ""}`}
          hidden={twitt.user_id != user.id}
        >
          {twitt.is_pinned ? t("unpinToYourProfile") : t("pinToYourProfile")}
        </DropdownItem>
        <DropdownItem key="highlight" startContent={<BsStars />}>
          {t("highlightOnYourProfile")}
        </DropdownItem>
        <DropdownItem key="add-remove" startContent={<RiPagesLine />}>
          {t("addRemoveFromLists", { user: "@" + user.username })}
        </DropdownItem>
        <DropdownItem
          className={`${user.id != twitt.user_id ? "hidden" : ""}`}
          hidden={twitt.user_id != user.id}
          key="change-reply"
          startContent={<FaRegComment />}
        >
          {t("changeWhoCanReply")}
        </DropdownItem>
      </DropdownMenu>
    </Dropdown>
  );
}

export default TwittSettings;
