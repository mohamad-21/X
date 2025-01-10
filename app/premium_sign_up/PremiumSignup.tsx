"use client";

import { CloseOutlined } from "@ant-design/icons";
import { Button } from "@nextui-org/button";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState, useTransition } from "react";
import { upgradeAccount } from "../_lib/actions";
import Alert from "../_ui/Alert";
import LoadingSpinner from "../_ui/LoadingSpinner";
import SubscribeCard from "../_ui/SubscribeCard";
import { User } from "../_lib/definitions";
import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";

function PremiumSignup({ user, isSubscribed }: { user: User, isSubscribed?: boolean }) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [message, setMessage] = useState("");
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const t = useTranslations();
  const locale = useLocale();

  const features = [
    {
      subscribeType: "Basic",
      duration: t("monthly"),
      features: locale === "en" ? [
        "Small reply boost",
        "Encrypted direct messages",
        "Bookmark folders",
        "Highlights tab",
        "Edit post",
        "Post longer videos",
        "Longer posts"
      ] : [
        "تقویت پاسخ کوچک",
        "پیام های مستقیم رمزگذاری شده",
        "پوشه های نشانک",
        "برگه هایلایت",
        "ویرایش پست",
        "ارسال ویدیوهای طولانی تر",
        "پست های طولانی تر"
      ],
      price: 4.88
    },
    {
      subscribeType: "Premium",
      duration: t("monthly"),
      features: locale === "en" ? [
        "Half Ads in For You and Following",
        "Larger reply boost",
        "Get paid to post",
        "Checkmark",
        "Grok with increased limits",
        "X Pro, Analytics, Media Studio",
        "Creator Subscriptions"
      ] : [
        "نیمی از تبلیغات برای شما و دنبال کردن",
        "تقویت پاسخ بزرگتر",
        "برای پست کردن پول بگیرید",
        "علامت چک",
        "Grok با محدودیت های افزایش یافته",
        "X Pro,  تجزیه و تحلیل, استودیو رسانه",
        "اشتراک‌های سازنده"
      ],
      price: 13
    },
    {
      subscribeType: "Premium+",
      duration: t("monthly"),
      features: locale === "en" ? [
        "Fully ad-free",
        "Largest reply boost",
        "Write Articles",
        "Radar",
        "Compare tiers & features"
      ] : [
        "کاملاً بدون آگهی",
        "بزرگترین افزایش پاسخ",
        "نوشتن مقاله",
        "رادار",
        "مقایسه سطوح و ویژگی ها"
      ],
      price: 35
    },
  ]

  useEffect(() => {
    if (message) {
      setTimeout(() => setMessage(""), 5000);
    }
  }, [message]);

  useEffect(() => {
    if (isSubscribed) {
      setTimeout(() => router.back(), 5000);
    }
  }, [isSubscribed]);

  function handleSubscribe(idx: number) {
    if (idx > 2) return;
    let subscribeType = "";
    switch (idx) {
      case 0: {
        subscribeType = "basic";
        break;
      }
      case 1: {
        subscribeType = "premium";
        break;
      }
      case 2: {
        subscribeType = "premium_plus";
        break;
      }
    };
    if (subscribeType === "basic" || subscribeType === "premium" || subscribeType === "premium_plus") {
      startTransition(async () => {
        const params = new URLSearchParams(searchParams);
        params.set("subscription", "success");
        params.set("subscription_type", features[idx].subscribeType);
        try {
          await upgradeAccount({ userId: user.id, type: subscribeType });
          router.replace(`${pathname}?${params.toString()}`)
        } catch (err: any) {
          console.log(err);
          setMessage(t("somethingWentWrong"));
        }
      })
    };
  }

  return (
    <>
      <Button variant="light" className="absolute top-4 left-6 z-[3] rounded-full" isIconOnly onClick={() => router.back()}>
        <CloseOutlined className="text-lg" />
      </Button>
      <div className="absolute top-[-70px] left-[15%] right-[15%] h-[300px] rounded-full z-0 primary-gradient-effect" />
      {user.account_type !== "normal" && !isSubscribed ? (
        <div className="max-w-2xl px-8 text-center flex items-center justify-center flex-col gap-6 h-full relative">
          <h1 className="md:text-5xl text-4xl font-bold">{t("alreadyIsPremium")}</h1>
          <Link href="/home" className="text-lg">{t("home")}</Link>
        </div>
      ) : (
        <>
          {isSubscribed ? (
            <div className="max-w-2xl px-8 text-center flex items-center justify-center flex-col gap-6 h-full relative">
              <h1 className="md:text-6xl sm:text-5xl text-4xl font-bold text-success">{t("congratulations")} {user.name}</h1>
              <img src={user.profile} className="w-[100px] h-[100px] rounded-full" alt={`${user.name}s profile`} />
              <h1 className="md:text-4xl sm:text-3xl text-2xl font-bold">{t("accountUpgrated")}</h1>
              <p className="text-default-400">{t("redirectingToHome")}</p>
            </div>
          ) : (
            <div className="w-full items-center h-full pb-[200px]">
              <div className="pt-20 pb-12 px-6 flex flex-col items-center gap-8 relative">
                <>
                  <div className="text-center max-w-3xl">
                    <h1 className="md:text-6xl text-5xl font-bold mb-7">{t("upgradeToPremium")}</h1>
                    <p className="text-default-500 md:text-lg">{t("upgradeDesc")}</p>
                  </div>
                  <div className="flex justify-center gap-3 flex-wrap w-full">
                    {features.map((feature, idx) => (
                      <SubscribeCard
                        subscribeType={feature.subscribeType}
                        duration={feature.duration}
                        price={feature.price}
                        features={feature.features}
                        onSelect={() => setSelectedIndex(idx)}
                        key={feature.subscribeType}
                        isSelected={selectedIndex === idx}
                        onSubscribe={() => handleSubscribe(idx)}
                        hideSubscribeBtnOnMd
                        isDisabled={isPending}
                      />
                    ))}
                  </div>
                  <div className="fixed bottom-0 left-0 right-0 bg-black/70 p-5 md:flex items-center justify-center gap-12 backdrop-blur-sm hidden">
                    <div>
                      <span className="text-xl">{features[selectedIndex].subscribeType}</span>
                      <div className="mt-3">
                        <h2 className="text-5xl font-bold inline">${features[selectedIndex].price} <span className="text-base font-medium text-default-600">/ {features[selectedIndex].duration}</span></h2>
                      </div>
                    </div>
                    <div className="flex flex-col gap-3">
                      <Button radius="full" className="text-base font-bold" color="primary" onClick={() => handleSubscribe(selectedIndex)} isDisabled={isPending} isLoading={isPending} spinner={<LoadingSpinner size="sm" noPadding color="#fff" />}>{t("subscribeAndPay")}</Button>
                      <div className="p-2 border border-default-400 text-default-500 text-xs max-w-md rounded-xl font-extralight">
                        <p>{t("subscribeNote")}</p>
                      </div>
                    </div>
                  </div>
                </>
              </div>
            </div>
          )}
        </>
      )}
      {message && <Alert type="fixed">{message}</Alert>}
    </>
  )
}

export default PremiumSignup;
