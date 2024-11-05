"use client";

import { Select, SelectItem } from "@nextui-org/react";
import { useLocale } from "next-intl";
import { ChangeEvent, useState } from "react";
import { changeLanguage } from "../_lib/actions";
import { useRouter } from "next/navigation";
import LoadingSpinner from "./LoadingSpinner";

function LanguageSwitcher() {
  const [showLoading, setShowLoading] = useState(false);
  const defaultLocale = useLocale();
  const router = useRouter();

  async function handleChangeLocale(e: ChangeEvent<HTMLSelectElement>) {
    setShowLoading(true);
    await changeLanguage(e.target.value);
    location.reload();
    router.back();
  }

  return (
    <>
      {showLoading && (
        <div className="bg-background/60 absolute z-50 inset-0 flex items-center justify-center">
          <LoadingSpinner />
        </div>
      )}
      <div>
        <Select
          variant="bordered"
          defaultSelectedKeys={defaultLocale}
          label="Language"
          onChange={handleChangeLocale}
          selectedKeys={[defaultLocale]}
        >
          <SelectItem value="en" key="en">
            English
          </SelectItem>
          <SelectItem value="fa" key="fa" dir="rtl" className="text-right">
            فارسی
          </SelectItem>
        </Select>
      </div>
    </>
  );
}

export default LanguageSwitcher;
