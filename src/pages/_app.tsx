import { AppProps } from "next/app";
import Head from "next/head";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { I18nextProvider, useTranslation } from "react-i18next";
import Txt, { TxtSize } from "~/components/ui/txt";
import useConnectivity from "~/hooks/connectivity";
import { i18n } from "~/lib/i18n";
import { logFailedPromise } from "~/lib/errors";
import "../styles/style.css";

export default function App(props: AppProps) {
  return (
    <I18nextProvider i18n={i18n}>
      <GetawayGhost {...props} />
    </I18nextProvider>
  );
}

function GetawayGhost({ Component, pageProps }: AppProps) {
  const { t } = useTranslation();
  const router = useRouter();

  useEffect(() => {
    i18n.changeLanguage(router.locale).catch(logFailedPromise);
  }, [router.locale]);

  const [showOffline, setShowOffline] = useState(true);
  const online = useConnectivity();

  return (
    <>
      <Head>
        <title>{t("appTitle")}</title>
        <meta charSet="utf-8" />
        <meta content="IE=edge" httpEquiv="X-UA-Compatible" />
        <meta content="width=device-width, initial-scale=1" name="viewport" />
        <meta content={t("tagline")} name="description" />
      </Head>

      <div className="aspect-ratio--object">
        {/* Offline indicator */}
        {!online && showOffline && (
          <div className="relative flex items-center justify-center bg-red shadow-4 b--red ba pa2 z-99">
            <Txt uppercase size={TxtSize.MEDIUM} value={t("offline")} />
            <a className="absolute right-1" onClick={() => setShowOffline(false)}>
              <Txt value="×" />
            </a>
          </div>
        )}
        <Component {...pageProps} />
      </div>
    </>
  );
}
