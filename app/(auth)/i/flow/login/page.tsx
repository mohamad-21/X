import LoginFlow from "@/app/(auth)/i/flow/login/LoginFlow";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Login on X"
};

export default function Page() {
  return (
    <LoginFlow />
  )
}