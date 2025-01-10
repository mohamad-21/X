"use client";

import { UserData } from "@/app/_lib/definitions";
import { Button } from "@nextui-org/button";
import { Badge } from "@nextui-org/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { BiSolidUser, BiUser } from "react-icons/bi";
import { GoBookmark, GoBookmarkFill, GoHome, GoHomeFill } from "react-icons/go";
import { IoIosSearch } from "react-icons/io";
import { IoNotifications, IoNotificationsOutline } from "react-icons/io5";
import { useAppSelector } from "../_lib/hooks";
import Alert from "./Alert";
import LanguageSwitcher from "./LanguageSwitcher";

function BottomNavigation({
  user,
}: {
  user: Omit<UserData, "bookmarks" | "twitts">;
}) {
  const [message, setMessage] = useState("");
  const pathname = usePathname();
  const notifs = useAppSelector((state) => state.app.notifications);

  const links = [
    {
      href: "/home",
      logo: {
        outline: <GoHome size={30} />,
        filled: <GoHomeFill size={30} />,
      },
      disabled: false,
    },
    {
      href: "/search",
      logo: {
        outline: <IoIosSearch size={30} />,
        filled: <IoIosSearch size={30} />,
      },
      disabled: false,
    },
    {
      href: "/notifications",
      logo: {
        outline: <IoNotificationsOutline size={30} />,

        filled: <IoNotifications size={30} />,
      },
      disabled: false,
    },
    {
      href: `/bookmarks`,
      logo: {
        outline: <GoBookmark size={30} />,
        filled: <GoBookmarkFill size={20} />,
      },
      disabled: false,
    },
    {
      href: `/${user.username}`,
      logo: {
        outline: <BiUser size={30} />,
        filled: <BiSolidUser size={30} />,
      },
      disabled: false,
    },
  ];

  useEffect(() => {
    if (message) {
      setTimeout(() => setMessage(""), 5000);
    }
  }, [message]);

  return (
    <>
      <ul className="flex sm:hidden gap-2 w-full sm:justify-normal justify-evenly sm:px-0">
        {links.map((link, idx) => (
          <li key={idx}>
            {idx === 0 ? (
              <Button
                variant="light"
                as={link.disabled ? "button" : link?.href ? Link : "button"}
                href={link?.href || undefined}
                size="lg"
                isIconOnly
                className="flex hover:no-underline  min-w-max items-center justify-center gap-4 text-xl"
                onClick={() =>
                  link.disabled
                    ? setMessage("This page is not available for now.")
                    : {}
                }
                radius="full"
              >
                {/* <Badge content="" size="sm" color="primary">
                  {pathname === link.href
                    ? link.logo.filled
                    : link.logo.outline}
                </Badge> */}

                {pathname
                  ? pathname === link.href
                    ? link.logo.filled
                    : link.logo.outline
                  : null}
              </Button>
            ) : (
              <Button
                variant="light"
                as={link.disabled ? "button" : link?.href ? Link : "button"}
                href={link?.href || undefined}
                size="lg"
                isIconOnly
                className="flex hover:no-underline min-w-max items-center justify-center gap-4 text-xl"
                onClick={() =>
                  link.disabled
                    ? setMessage("This page is not available for now.")
                    : {}
                }
                radius="full"
              >
                {link.href === "/notifications" && notifs.length > 0 ? (
                  <Badge content={notifs.length} color="primary" className="mr-1 mt-1">
                    {pathname
                      ? pathname === link.href
                        ? link.logo.filled
                        : link.logo.outline
                      : null}
                  </Badge>
                ) : (
                  <>
                    {pathname
                      ? pathname === link.href
                        ? link.logo.filled
                        : link.logo.outline
                      : null}
                  </>
                )}
              </Button>
            )}
          </li>
        ))}
        <li>
          <LanguageSwitcher isBottomNav />
        </li>
      </ul>

      <Button
        color="secondary"
        as={Link}
        href="/post"
        size="lg"
        isIconOnly
        className="sm:hidden fixed bottom-24 right-6 z-[3] flex hover:no-underline min-w-max items-center justify-center gap-4 text-xl"
        radius="full"
      >
        <svg
          width={25}
          height={25}
          fill="#111"
          viewBox="0 0 24 24"
          aria-hidden="true"
          className="r-4qtqp9 r-yyyyoo r-dnmrzs r-bnwqim r-lrvibr r-m6rgpd r-1472mwg r-lrsllp"
          style={{ color: "#111" }}
        >
          <g>
            <path d="M23 3c-6.62-.1-10.38 2.421-13.05 6.03C7.29 12.61 6 17.331 6 22h2c0-1.007.07-2.012.19-3H12c4.1 0 7.48-3.082 7.94-7.054C22.79 10.147 23.17 6.359 23 3zm-7 8h-1.5v2H16c.63-.016 1.2-.08 1.72-.188C16.95 15.24 14.68 17 12 17H8.55c.57-2.512 1.57-4.851 3-6.78 2.16-2.912 5.29-4.911 9.45-5.187C20.95 8.079 19.9 11 16 11zM4 9V6H1V4h3V1h2v3h3v2H6v3H4z"></path>
          </g>
        </svg>
      </Button>

      {message && <Alert type="fixed">{message}</Alert>}
    </>
  );
}

export default BottomNavigation;
