import { useRouter } from "next/router";
import React from "react";
import { useTranslation } from "react-i18next";
import { Select } from "~/components/ui/forms";
import { logFailedPromise } from "~/lib/errors";

export const Languages = {
  en: "English",
  zh: "简体中文",
};

interface Props {
  outlined?: boolean;
}

export default function LanguageSelector(props: Props) {
  const { outlined = false } = props;
  const router = useRouter();
  const { t } = useTranslation();

  return (
    <label title={t("selectLanguage", "Select a language")}>
      <Select
        options={Languages}
        outlined={outlined}
        value={router.locale}
        onChange={(e) => {
          router.push(router.pathname, router.asPath, { locale: e.target.value }).catch(logFailedPromise);
        }}
      />
    </label>
  );
}
