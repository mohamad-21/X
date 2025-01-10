import { getRequestConfig } from "next-intl/server";
import { cookies, headers } from "next/headers";

export default getRequestConfig(async () => {
  const cookieLocale = cookies().get("lang")?.value || "";
  const headersList = headers().get("accept-language");
  const browserLocale = headersList?.split(",")[0].split("-")[0] || "";
  const locale = cookieLocale || browserLocale || "en";

  return {
    locale,
    messages: (await import(`@/public/locales/${locale}.json`)).default,
  };
});
