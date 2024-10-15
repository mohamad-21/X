import { Session } from "next-auth";
import React from "react";
import Logo from "./Logo";
import Link from "next/link";

function Header({ user }: { user: Session['user'] }) {
  return (
    <header className="sm:hidden sticky top-0 left-0 w-full flex items-center py-3 px-4 border-b border-default bg-background z-[3]">
      <div className="flex items-center justify-between w-full">
        <Link href={`/${user.username}`}>
          <img
            width={35}
            height={35}
            src={user.image}
            alt={user.name}
            className="rounded-full w-[35px] h-[35px]"
          />
        </Link>
        <Logo className="absolute left-1/2 -translate-x-1/2" width={27} height={27} />
        <Link href="#">Get Premium</Link>
      </div>
    </header>
  )
}

export default Header;
