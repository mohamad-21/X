"use client";

import {
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from "@nextui-org/react";
import { useLocale, useTranslations } from "next-intl";
import { Key, useState, useTransition } from "react";
import { IoLanguageOutline } from "react-icons/io5";
import { changeLanguage } from "../_lib/actions";
import LoadingSpinner from "./LoadingSpinner";
import { useRouter } from "next/navigation";

function LanguageSwitcher({ isBottomNav }: { isBottomNav?: boolean }) {
  const [showLoading, setShowLoading] = useState(false);
  const t = useTranslations();
  const locale = useLocale();
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  async function handleLangChange(key: Key) {
    if (locale === key) return;
    await changeLanguage(key as string);
    setShowLoading(true);
    startTransition(() => {
      router.refresh();
    });
  }

  return (
    <>
      {pending && (
        <div className="bg-background/60 fixed z-50 inset-0 flex items-center justify-center">
          <LoadingSpinner />
        </div>
      )}
      <Dropdown>
        <DropdownTrigger>
          <Button
            variant="light"
            className="flex hover:no-underline min-w-max items-center relative py-7 px-[13px] justify-start gap-4 text-xl rounded-full w-full"
          >
            <IoLanguageOutline size={30} />
            {!isBottomNav && (
              <span className="xl:block hidden">{t("Navigation.language")}</span>
            )}
          </Button>
        </DropdownTrigger>
        <DropdownMenu
          color="primary"
          onAction={(key) => handleLangChange(key)}
          itemClasses={{ base: "py-2" }}
        >
          <DropdownItem
            key="en"
            className={`${locale === "en" ? "bg-primary" : ""}`}
          >
            English
          </DropdownItem>
          <DropdownItem
            key="fa"
            className={`${locale === "fa" ? "bg-primary" : ""}`}
          >
            فارسی
          </DropdownItem>
        </DropdownMenu>
      </Dropdown>
    </>
  );
}

export default LanguageSwitcher;
