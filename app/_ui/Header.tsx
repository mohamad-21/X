"use client";

import Link from "next/link";
import { UserData } from "../_lib/definitions";
import { useTranslations } from "next-intl";

function Header({ user }: { user: UserData }) {
  const t = useTranslations();

  return (
    <header className="sm:hidden sticky top-0 left-0 w-full flex items-center py-3 px-4 border-b border-default bg-background z-[3]">
      <div className="flex items-center justify-between w-full">
        <Link href={`/${user.username}`}>
          <img
            width={35}
            height={35}
            src={user.profile}
            alt={user.name}
            className="rounded-full w-[35px] h-[35px]"
          />
        </Link>
        <Link href="#">{t("getPremium")}</Link>
      </div>
    </header>
  );
}

export default Header;
