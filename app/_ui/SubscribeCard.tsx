"use client";
import { CheckOutlined } from "@ant-design/icons";
import { Button, Card, Checkbox } from "@nextui-org/react";
import React from "react";
import LoadingSpinner from "./LoadingSpinner";
import { useTranslations } from "next-intl";

interface Props extends React.HTMLAttributes<HTMLDivElement> {
  subscribeType: string;
  duration: string;
  features: string[];
  price: number;
  isSelected?: boolean;
  onSelect?: () => any;
  onSubscribe?: () => any;
  hideSubscribeBtnOnMd?: boolean;
  isDisabled?: boolean;
}

function SubscribeCard({ subscribeType, price, features, duration, isSelected, onSelect, onSubscribe, hideSubscribeBtnOnMd = false, isDisabled, ...props }: Props) {
  const t = useTranslations();

  return (
    <Card isPressable className={`border-3 ${isSelected ? "border-primary" : "border-primary/0"} justify-start text-left rounded-2xl py-8 px-6 ${isSelected ? "bg-gradient-to-b from-black to-primary-50/10" : "bg-default-400"} items-stretch gap-4 text-default-600 w-[300px] ${props.className}`} onClick={onSelect}>
      <div className="flex justify-between gap-3">
        <h2 className="text-xl">{subscribeType}</h2>
        <Checkbox size="lg" isSelected={isSelected} className="pointer-events-none z-0" radius="full" />
      </div>
      <div>
        <p className="text-4xl leading-normal font-bold text-foreground">${price} <span className="text-base font-normal text-default-600">/ {duration}</span></p>
      </div>
      <Button as="a" color="secondary" className={`text-base font-bold !no-underline ${hideSubscribeBtnOnMd ? "md:hidden" : ""}`} radius="full" onClick={onSubscribe} isDisabled={isDisabled} isLoading={isDisabled} spinner={<LoadingSpinner size="sm" noPadding />}>{t("subscribe")}</Button>
      <div className="flex flex-col gap-3">
        {features.map(feature => (
          <span className="inline" key={feature}><CheckOutlined className="mr-0.5" /> {feature}</span>
        ))}
      </div>
    </Card>
  )
}

export default SubscribeCard;
