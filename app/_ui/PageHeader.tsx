"use client";

import { ArrowLeftOutlined, ArrowRightOutlined } from "@ant-design/icons";
import { Button } from "@nextui-org/button";
import { useLocale } from "next-intl";
import { useRouter } from "next/navigation";
import React from "react";

function PageHeader({
  title,
  desc,
  endContent,
  children,
  sticky = true,
}: {
  title?: string;
  endContent?: React.ReactNode;
  desc?: string;
  children?: React.ReactNode;
  sticky?: boolean;
}) {
  const router = useRouter();
  const locale = useLocale();

  return (
    <header
      className={`${
        sticky ? "sticky top-0 left-0" : ""
      } w-full bg-background/40 backdrop-blur-lg px-2 z-[3]`}
    >
      <div className="flex items-center justify-between py-3 gap-4 w-full">
        <div className="flex items-center gap-4">
          <Button
            variant="light"
            className="text-lg"
            radius="full"
            isIconOnly
            onClick={() => router.back()}
            startContent={
              locale === "fa" ? <ArrowRightOutlined /> : <ArrowLeftOutlined />
            }
          ></Button>
          {(title || desc) && (
            <div>
              {title && (
                <h2 className="text-xl leading-5 font-bold">{title}</h2>
              )}
              {desc && <p className="text-default-400 text-sm">{desc}</p>}
            </div>
          )}
        </div>
        <div className="pb-3">{endContent}</div>
      </div>
      {children}
    </header>
  );
}

export default PageHeader;
