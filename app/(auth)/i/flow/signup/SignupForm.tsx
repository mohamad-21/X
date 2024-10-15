"use client";
import Logo from "@/app/_ui/Logo";
import { Button } from "@nextui-org/button";
import React from "react";
import OAuthButton from "@/app/_ui/OAuthButton";
import { AppleFilled } from "@ant-design/icons";
import GoogleIcon from "@/app/_ui/GoogleIcon";
import Link from "next/link";
import { signinWithGoogle } from "@/app/_lib/actions";
import { useRouter } from "next/navigation";

function SignupForm() {
  const router = useRouter();

  return (
    <div className="flex items-start lg:items-center justify-between gap-16 w-full lg:max-w-5xl max-w-lg lg:flex-row flex-col lg:pt-20 pt-7 relative">
      <div>
        <Logo className="lg:block hidden -mt-16" width={320} height={320} />
        <Logo className="lg:hidden block" width={70} height={70} />
      </div>
      <div className="flex flex-col sm:gap-12 gap-7">
        <h1 className="sm:text-7xl text-5xl lg:max-w-full max-w-[400px] font-bold">Happening now</h1>
        <div className="max-w-[300px]">
          <h2 className="sm:text-3xl text-xl font-bold mb-6">Join today.</h2>
          <div className="flex flex-col gap-2.5">
            <form action={signinWithGoogle}>
              <OAuthButton logo={<GoogleIcon />}><span className="text-[15px] font-bold">Sign up with Google</span></OAuthButton>
            </form>
            <OAuthButton logo={<AppleFilled width={30} height={30} />}>Sign up with Apple</OAuthButton>
            <div className="relative flex items-center justify-center before:absolute before:left-0 after:right-0 after:absolute before:bg-gray-700 before:h-[0.2px] before:w-[45%]  after:bg-gray-700 after:h-[0.2px] after:w-[45%]">
              <span className="relative ">or</span>
            </div>
            <Button color="primary" radius="full" className="w-full text-base font-bold" onClick={() => router.push('/i/flow/signup')}>Create Account</Button>
            <p className="text-xs font-light text-darkgray">By signing up, you aggre the <Link href="/tos">Terms of Service</Link> and <Link href="/policy">Privacy Policy</Link>, including <Link href="/rules-and-policies/twitter-cookies">Cookie Use</Link></p>
          </div>
          <div className="mt-12">
            <h3 className="mb-4 text-lg">Already have account?</h3>
            <Button onClick={() => router.push('/i/flow/login')} radius="full" variant="bordered" className="w-full text-base font-bold">Sign in</Button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SignupForm;
