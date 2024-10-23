"use client";

import PageHeader from "@/app/_ui/PageHeader";
import { Input } from "@nextui-org/react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import React, { FormEvent, useState } from "react";
import { BiSearch } from "react-icons/bi";

function SearchHeader() {
  const searchParams = useSearchParams();
  const [searchTerm, setSearchTerm] = useState(searchParams.get('q') || '');
  const pathname = usePathname();
  const router = useRouter();

  function handleSearch(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const params = new URLSearchParams(searchParams);
    if (searchTerm) {
      params.set('q', searchTerm);
    } else {
      params.delete('q');
    }
    router.replace(`${pathname}?${params.toString()}`);
  }

  return (
    <PageHeader
      title="Search people and posts"
    >
      <form onSubmit={handleSearch} className="mr-auto w-full">
        <Input
          radius="full"
          placeholder="Search"
          classNames={{
            input: "placeholder:text-default-400"
          }}
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          startContent={<BiSearch className="text-default-400" size={20} />}
        />
      </form>
    </PageHeader>
  )
}

export default SearchHeader;
