"use client";

import { useLocale } from "next-intl";
import React from "react";

function TopHeader() {
  const locale = useLocale();

  return (
    <div
      className="w-full p-1 text-center bg-default/20 z-[6] relative animate-top-header"
      dir={locale === "fa" ? "rtl" : "ltr"}
    >
      <p className="text-xs">
        {locale === "en" && (
          <>
            <span className="text-success">**Disclaimer**:</span> This project
            is a personal, non-commercial portfolio piece. all trademarks belong
            to their respective{" "}
            <a
              href="https://www.x.com"
              target="_blank"
              className="text-primary"
            >
              owners
            </a>
            .
          </>
        )}
        {locale === "fa" && (
          <>
            <span className="text-success">**سلب مسئولیت**:</span> این پروژه یک
            نمونه کار شخصی و غیرتجاری است. همه علائم تجاری متعلق به{" "}
            <a
              href="https://www.x.com"
              target="_blank"
              className="text-primary"
            >
              مالکان
            </a>{" "}
            مربوطه می باشند.
          </>
        )}
      </p>
    </div>
  );
}

export default TopHeader;
