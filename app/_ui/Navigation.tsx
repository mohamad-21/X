"use client";

import { logOut } from "@/app/_lib/actions";
import { UserData } from "@/app/_lib/definitions";
import { useAppSelector } from "@/app/_lib/hooks";
import { Button } from "@nextui-org/button";
import {
  Badge,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from "@nextui-org/react";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState, useTransition } from "react";
import { BiSolidUser, BiUser } from "react-icons/bi";
import { GoBookmark, GoBookmarkFill, GoHome, GoHomeFill } from "react-icons/go";
import { IoIosSearch } from "react-icons/io";
import { IoNotifications, IoNotificationsOutline } from "react-icons/io5";
import Alert from "./Alert";
import LanguageSwitcher from "./LanguageSwitcher";
import PageLockLoading from "./PageLockLoading";

function Navigation({
  user,
}: {
  user: Omit<UserData, "bookmarks" | "twitts">;
}) {
  const [message, setMessage] = useState("");
  const [isPending, startTransition] = useTransition();
  const pathname = usePathname();
  const notifs = useAppSelector((state) => state.app.notifications);
  const t = useTranslations();
  const router = useRouter();

  const links = [
    {
      href: "/home",
      text: t("Navigation.home"),
      logo: {
        outline: <GoHome size={30} />,
        filled: <GoHomeFill size={30} />,
      },
      disabled: false,
    },
    {
      href: "/search",
      text: t("Navigation.search"),
      logo: {
        outline: <IoIosSearch size={30} />,
        filled: <IoIosSearch size={30} />,
      },
      disabled: false,
    },
    {
      href: "/notifications",
      text: t("Navigation.notifications"),
      logo: {
        outline: <IoNotificationsOutline size={30} />,

        filled: <IoNotifications size={30} />,
      },
      disabled: false,
    },
    {
      href: `/bookmarks`,
      text: t("Navigation.bookmarks"),
      logo: {
        outline: <GoBookmark size={30} />,
        filled: <GoBookmarkFill size={30} />,
      },
      disabled: false,
    },
    {
      href: `/${user.username}`,
      text: t("Navigation.profile"),
      logo: {
        outline: <BiUser size={30} />,
        filled: <BiSolidUser size={30} />,
      },
      disabled: false,
    }
  ];

  useEffect(() => {
    if (message) {
      setTimeout(() => setMessage(""), 5000);
    }
  }, [message]);

  return (
    <>
      <ul className="hidden sm:flex flex-col xl:items-stretch items-center gap-2 w-full max-w-[235px]">
        {/* <li>
          <Button as={Link} href="/home" size="lg" isIconOnly className=" flex hover:no-underline min-w-max items-center xl:px-3 justify-center gap-4 text-xl" variant="light" radius="full">
            <Logo width={30} height={30} />
          </Button>
        </li> */}
        {links.map((link, idx) => (
          <li key={idx}>
            {idx === 0 ? (
              <>
                <Button
                  as={link.disabled ? "button" : link?.href ? Link : "button"}
                  href={link?.href || undefined}
                  variant="light"
                  size="lg"
                  className="xl:flex hidden w-full hover:no-underline px-3 min-w-max items-center justify-start gap-4 text-xl"
                  radius="full"
                  onClick={() =>
                    link.disabled
                      ? setMessage("This page is not available for now.")
                      : {}
                  }
                >
                  {/* <Badge content="" size="sm" color="primary">
                    {pathname
                      ? pathname === link.href
                        ? link.logo.filled
                        : link.logo.outline
                      : null}
                  </Badge> */}
                  {pathname
                    ? pathname === link.href
                      ? link.logo.filled
                      : link.logo.outline
                    : null}
                  <span
                    className={`xl:block hidden ${pathname === link.href ? "font-bold" : ""
                      }`}
                  >
                    {link?.text}
                  </span>
                </Button>
                <Button
                  variant="light"
                  as={link.disabled ? "button" : link?.href ? Link : "button"}
                  href={link?.href || undefined}
                  size="lg"
                  isIconOnly
                  className="xl:hidden flex hover:no-underline  min-w-max items-center py-7 px-[13px] justify-center gap-4 text-xl"
                  radius="full"
                  onClick={() =>
                    link.disabled
                      ? setMessage("This page is not available for now.")
                      : {}
                  }
                >
                  {/* <Badge content="" size="sm" color="primary">
                    {pathname
                      ? pathname === link.href
                        ? link.logo.filled
                        : link.logo.outline
                      : null}
                  </Badge> */}
                  {pathname
                    ? pathname === link.href
                      ? link.logo.filled
                      : link.logo.outline
                    : null}
                </Button>
              </>
            ) : (
              <>
                <Button
                  variant="light"
                  as={link.disabled ? "button" : link?.href ? Link : "button"}
                  href={link?.href || undefined}
                  size="lg"
                  className="xl:flex hidden w-full hover:no-underline px-3 min-w-max items-center justify-start gap-4 text-xl"
                  radius="full"
                  onClick={() =>
                    link.disabled
                      ? setMessage("This page is not available for now.")
                      : {}
                  }
                >
                  {link.href === "/notifications" && notifs.length > 0 ? (
                    <Badge content={notifs.length} size="sm" color="primary">
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
                  <span
                    className={`xl:block hidden ${pathname === link.href ? "font-bold" : ""
                      }`}
                  >
                    {link?.text}
                  </span>
                </Button>

                <Button
                  variant="light"
                  as={link.disabled ? "button" : link?.href ? Link : "button"}
                  href={link?.href || undefined}
                  size="lg"
                  className="xl:hidden flex hover:no-underline min-w-max items-center relative py-7 px-[13px] justify-center gap-4 text-xl"
                  radius="full"
                  onClick={() =>
                    link.disabled
                      ? setMessage("This page is not available for now.")
                      : {}
                  }
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
              </>
            )}
          </li>
        ))}
        <li>
          <LanguageSwitcher />
        </li>
        <li>
          <Button
            color="secondary"
            as={Link}
            href="/post"
            size="lg"
            className="hidden xl:flex w-full hover:no-underline px-3 items-center gap-4 text-xl font-medium"
            radius="full"
          >
            <span className="xl:block hidden">{t("post")}</span>
          </Button>
          <Button
            color="secondary"
            as={Link}
            href="/post"
            size="lg"
            isIconOnly
            className="xl:hidden flex hover:no-underline  min-w-max items-center justify-center gap-4 text-xl"
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
        </li>
      </ul>

      {user && (
        <Dropdown>
          <DropdownTrigger>
            <Button
              variant="light"
              className="xl:py-8 sm:flex hidden xl:justify-start xl:px-3 justify-center items-center xl:w-full xl:max-w-[235px] xl:max-h-max w-11 h-11 min-w-0 px-0 rounded-full"
            >
              <div className="flex items-center justify-center overflow-hidden gap-3">
                <img
                  width={44}
                  height={44}
                  alt={user?.name!}
                  src={user.profile}
                  className="rounded-full w-11 h-11 flex-shrink-0"
                />
                <div className="text-left xl:flex flex-col items-start justify-center hidden gap-0 truncate">
                  <h3 className="font-bold truncate max-w-full">{user.name}</h3>
                  <p className="text-default-400 truncate max-w-full">
                    @{user.username}
                  </p>
                </div>
              </div>
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
                case "subscribe_to_premium": {
                  startTransition(async () => {
                    router.push("/premium_sign_up");
                  })
                  break;
                };
                case "logout": {
                  startTransition(async () => {
                    await logOut();
                  })
                  break;
                }
              }
            }}
          >
            <DropdownItem key="subscribe_to_premium">
              {t("getPremium")}
            </DropdownItem>
            <DropdownItem key="logout" className="text-danger" color="danger">
              {t("Navigation.logout")} @{user.username}
            </DropdownItem>
          </DropdownMenu>
        </Dropdown>
      )}
      {message && <Alert type="fixed">{message}</Alert>}
      {isPending && <PageLockLoading />}
    </>
  );
}

export default Navigation;
