"use client";
import { signinWithGoogle } from "@/app/_lib/actions";
import GoogleIcon from "@/app/_ui/GoogleIcon";
import Logo from "@/app/_ui/Logo";
import OAuthButton from "@/app/_ui/OAuthButton";
import { Button } from "@nextui-org/button";
import Link from "next/link";
import { useRouter } from "next/navigation";
import DemoLoginButton from "./DemoLoginButton";
import { useLocale, useTranslations } from "next-intl";

function SignupForm() {
  const router = useRouter();
  const t = useTranslations();
  const locale = useLocale();

  return (
    <div className="flex items-start lg:items-center justify-between gap-10 w-full lg:max-w-5xl max-w-lg lg:flex-row flex-col pt-7 relative">
      <div>
        <Logo className="lg:block hidden -mt-16" width={320} height={320} />
        <Logo className="lg:hidden block" width={70} height={70} />
      </div>
      <div className="flex flex-col gap-7">
        <h1 className={`sm:text-7xl text-5xl ${locale === "fa" ? "!leading-[5.2rem]" : ""} lg:max-w-full max-w-[400px] font-bold`}>
          {t("happeningNow")}
        </h1>
        <div className="max-w-[300px]">
          <h2 className="sm:text-3xl text-xl font-bold mb-6">
            {t("joinToday")}.
          </h2>
          <div className="flex flex-col gap-2.5">
            <DemoLoginButton />
            <form action={signinWithGoogle}>
              <OAuthButton logo={<GoogleIcon />}>
                <span className="text-[15px] font-bold">
                  {t("signupWithGoogle")}
                </span>
              </OAuthButton>
            </form>
            <div className="relative flex items-center justify-center before:absolute before:left-0 after:right-0 after:absolute before:bg-gray-700 before:h-[0.2px] before:w-[45%]  after:bg-gray-700 after:h-[0.2px] after:w-[45%]">
              <span className="relative ">{t("or")}</span>
            </div>
            <Button
              color="primary"
              radius="full"
              className="w-full text-base font-bold"
              onClick={() => router.push("/i/flow/signup")}
            >
              {t("createAccount")}
            </Button>
            {locale === "fa" && (
              <p className="text-xs font-light text-default-400">
                نام نویسی, به معنای موافقت شما{" "}
                <Link href="/tos">شرایط استفاده</Link> و{" "}
                <Link href="/policy">سیاست های مربوط به حریم خصوصی</Link>, شامل{" "}
                <Link href="/rules-and-policies/twitter-cookies">
                  استفاده از کوکی ها
                </Link>
              </p>
            )}
            {locale === "en" && (
              <p className="text-xs font-light text-default-400">
                By signing up, you aggre the{" "}
                <Link href="/tos">Terms of Service</Link> and{" "}
                <Link href="/policy">Privacy Policy</Link>, including{" "}
                <Link href="/rules-and-policies/twitter-cookies">
                  Cookie Use
                </Link>
              </p>
            )}
          </div>
          <div className="mt-12">
            <h3 className="mb-4 text-lg">{t("alreadyHaveAnAccount")}</h3>
            <Button
              onClick={() => router.push("/i/flow/login")}
              radius="full"
              variant="bordered"
              className="w-full text-base font-bold"
            >
              {t("signin")}
            </Button>
          </div>
        </div>
      </div>
    </div>

    // <div className="flex items-start justify-center gap-16 w-full max-w-lg flex-col pt-7 relative">
    //   <div className="flex flex-col sm:gap-12 gap-7">
    //     <h1 className="sm:text-7xl text-5xl lg:max-w-full max-w-[400px] font-bold">Happening now</h1>
    //     <div className="max-w-[300px]">
    //       <h2 className="sm:text-3xl text-xl font-bold mb-6">Join today.</h2>
    //       <div className="flex flex-col gap-2.5">
    //         <DemoLoginButton />
    //         <form action={signinWithGoogle}>
    //           <OAuthButton logo={<GoogleIcon />}><span className="text-[15px] font-bold">Sign up with Google</span></OAuthButton>
    //         </form>
    //         {/* <OAuthButton logo={<AppleFilled width={30} height={30} />}>Sign up with Apple</OAuthButton> */}
    //         <div className="relative flex items-center justify-center before:absolute before:left-0 after:right-0 after:absolute before:bg-gray-700 before:h-[0.2px] before:w-[45%]  after:bg-gray-700 after:h-[0.2px] after:w-[45%]">
    //           <span className="relative ">or</span>
    //         </div>
    //         <Button color="primary" radius="full" className="w-full text-base font-bold" onClick={() => router.push('/i/flow/signup')}>Create Account</Button>
    //         <p className="text-xs font-light text-default-400">By signing up, you aggre the <Link href="#">Terms of Service</Link> and <Link href="#">Privacy Policy</Link>, including <Link href="#">Cookie Use</Link></p>
    //       </div>
    //       <div className="mt-12">
    //         <h3 className="mb-4 text-lg">Already have account?</h3>
    //         <Button onClick={() => router.push('/i/flow/login')} radius="full" variant="bordered" className="w-full text-base font-bold">Sign in</Button>
    //       </div>
    //     </div>
    //   </div>
    // </div>
  );
}

export default SignupForm;
