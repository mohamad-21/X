"use client";

import { Button, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger } from "@nextui-org/react";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { logOut } from "../_lib/actions";
import { UserData } from "../_lib/definitions";
import { useTransition } from "react";
import PageLockLoading from "./PageLockLoading";

function Header({ user }: { user: UserData }) {
  const t = useTranslations();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const items = [
    {
      key: "profile",
      label: t("Navigation.profile"),
    },
    {
      key: "logout",
      label: `${t("Navigation.logout")} @${user.username}`,
      color: "danger"
    }
  ];

  return (
    <>
      <header className="sm:hidden sticky top-0 left-0 w-full flex items-center py-3 px-4 border-b border-default bg-background z-[3]">
        <div className="flex items-center justify-between w-full">
          <Dropdown>
            <DropdownTrigger>
              <Button isIconOnly variant="light" radius="full">
                <img
                  width={35}
                  height={35}
                  src={user.profile}
                  alt={user.name}
                  className="rounded-full w-[35px] h-[35px]"
                />
              </Button>
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
              onAction={async (key) => {
                switch (key) {
                  case "logout": {
                    startTransition(async () => {
                      await logOut();
                    })
                    break;
                  };
                  case "profile": {
                    startTransition(() => {
                      router.push(`/${user.username}`);
                    })
                    break;
                  };
                }
              }}
            >
              {items.map(item => (
                <DropdownItem key={item.key} color={item.key === "logout" ? "danger" : undefined} className={`${item.key === "logout" ? "text-danger" : ""}`}>{item.label}</DropdownItem>
              ))}
            </DropdownMenu>
          </Dropdown>
          <Link href="/premium_sign_up">{t("getPremium")}</Link>
        </div>
      </header>
      {isPending && <PageLockLoading />}
    </>
  );
}

export default Header;
