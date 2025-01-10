"use client";

import PageHeader from "@/app/_ui/PageHeader";
import { Input } from "@nextui-org/react";
import { useTranslations } from "next-intl";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import React, { FormEvent, useState } from "react";
import { BiSearch } from "react-icons/bi";

function SearchHeader() {
  const searchParams = useSearchParams();
  const [searchTerm, setSearchTerm] = useState(searchParams.get("q") || "");
  const pathname = usePathname();
  const router = useRouter();
  const t = useTranslations();

  function handleSearch(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const params = new URLSearchParams(searchParams);
    if (searchTerm) {
      params.set("q", searchTerm);
    } else {
      params.delete("q");
    }
    router.replace(`${pathname}?${params.toString()}`);
  }

  return (
    <PageHeader title={t("searchPeopleAndPosts")} sticky={false}>
      <form onSubmit={handleSearch} className="mr-auto w-full px-4">
        <Input
          radius="full"
          placeholder={t("search")}
          classNames={{
            input: "placeholder:text-default-400",
          }}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          startContent={<BiSearch className="text-default-400" size={20} />}
        />
      </form>
    </PageHeader>
  );
}

export default SearchHeader;
