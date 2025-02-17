import { sendVerification, checkExistsEmail } from "@/app/_lib/actions";
import { SignupData, SignupScheme } from "@/app/_lib/definitions";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Button,
  Input,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Select,
  SelectItem,
} from "@nextui-org/react";
import { eachYearOfInterval } from "date-fns";
import React, { useRef } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import Logo from "@/app/_ui/Logo";
import { useAppDispatch } from "@/app/_lib/hooks";
import { setSignupData } from "@/app/_lib/slices/userSlice";
import { useTranslations } from "next-intl";

const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];
const days = Array.from({ length: 31 }, (_, i) => i + 1);
const years = eachYearOfInterval({
  start: new Date(1904),
  end: new Date(),
})
  .map((date) => new Date(date).getFullYear())
  .reverse();

function Step1({
  onTransition,
}: {
  onTransition: (callback: () => Promise<any>) => void;
}) {
  const formRef = useRef<HTMLFormElement>(null);
  const dispatch = useAppDispatch();
  const t = useTranslations();

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    setError,
  } = useForm<SignupData>({
    resolver: zodResolver(SignupScheme),
    mode: "onTouched",
  });

  const onSubmit: SubmitHandler<SignupData> = (data) => {
    if (!isValid) return;
    onTransition(async () => {
      const emailIsDuplicated = await checkExistsEmail(data.email);
      if (emailIsDuplicated)
        return setError("email", {
          message: t("emailAlreadyTaken"),
        });

      await sendVerification(data.email);
      dispatch(
        setSignupData({
          data,
          step: 2,
        })
      );
    });
  };

  return (
    <>
      <ModalHeader className="mx-auto">
        <Logo width={27} height={27} />
      </ModalHeader>
      <ModalBody>
        <h1 className="text-3xl font-bold mb-6">{t("createYourAccount")}</h1>
        <form
          ref={formRef}
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col gap-5"
        >
          <Input
            variant="bordered"
            radius="sm"
            color="primary"
            label={t("name")}
            size="lg"
            classNames={{
              label: "text-default-400",
            }}
            {...register("name")}
            errorMessage={errors?.name?.message}
            isInvalid={Boolean(errors?.name?.message)}
          />
          <Input
            variant="bordered"
            type="email"
            radius="sm"
            color="primary"
            label={t("email")}
            size="lg"
            classNames={{
              label: "text-default-400",
            }}
            {...register("email")}
            errorMessage={errors?.email?.message}
            isInvalid={Boolean(errors?.email?.message)}
          />
          <div className="mt-6">
            <h3 className="text-lg mb-2 font-bold">
              {t("credentialsSignup.dateOfBirth")}
            </h3>
            <p className="text-[15px] text-default-400">
              {t("credentialsSignup.dateOfBirthDesc")}
            </p>
          </div>
          <div className="flex gap-3">
            <Select
              radius="sm"
              variant="bordered"
              color="primary"
              label={t("credentialsSignup.month")}
              classNames={{
                label: "text-default-400",
              }}
              errorMessage={errors?.month?.message}
              isInvalid={Boolean(errors?.month?.message)}
              {...register("month")}
            >
              {months.map((month) => (
                <SelectItem value={month} key={month}>
                  {month}
                </SelectItem>
              ))}
            </Select>
            <Select
              radius="sm"
              variant="bordered"
              color="primary"
              label={t("credentialsSignup.day")}
              classNames={{
                label: "text-default-400",
              }}
              className="max-w-[100px]"
              errorMessage={errors?.day?.message}
              isInvalid={Boolean(errors?.day?.message)}
              {...register("day")}
            >
              {days.map((day) => (
                <SelectItem value={String(day)} key={String(day)}>
                  {String(day)}
                </SelectItem>
              ))}
            </Select>
            <Select
              radius="sm"
              variant="bordered"
              color="primary"
              label={t("credentialsSignup.year")}
              classNames={{
                label: "text-default-400",
              }}
              className="max-w-[100px]"
              errorMessage={errors?.year?.message}
              isInvalid={Boolean(errors?.year?.message)}
              {...register("year")}
            >
              {years.map((year) => (
                <SelectItem value={String(year)} key={String(year)}>
                  {String(year)}
                </SelectItem>
              ))}
            </Select>
          </div>
        </form>
      </ModalBody>

      <ModalFooter className="flex justify-center border-t border-t-gray-700">
        <Button
          color="secondary"
          onClick={() => formRef?.current?.requestSubmit()}
          className="w-full text-lg font-bold"
          size="lg"
          radius="full"
          isDisabled={!isValid}
        >
          {t("next")}
        </Button>
      </ModalFooter>
    </>
  );
}

export default Step1;
