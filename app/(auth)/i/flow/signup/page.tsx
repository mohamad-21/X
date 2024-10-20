import React from "react";
import CredentialsFlow from "@/app/(auth)/i/flow/signup/credentials/CredentailsFlow";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign up for X"
};

function Page() {
  return (
    <CredentialsFlow />
  )
}

export default Page;
