"use client";

import PageHeader from "@/app/_ui/PageHeader";
import { useRouter } from "next/navigation";

function TwittHeader() {
  const router = useRouter();

  return (
    <PageHeader title="Post" />
  )
}

export default TwittHeader;