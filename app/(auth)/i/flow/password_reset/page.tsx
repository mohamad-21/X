import { Metadata } from "next";
import PasswordResetFlow from "./PasswordResetFlow";
import React from "react";

export const metadata: Metadata = {
  title: "Reset password"
};

function Page() {
  return (
    <PasswordResetFlow />
  )
}

export default Page;
