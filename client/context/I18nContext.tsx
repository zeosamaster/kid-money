import { useRouter } from "next/router";
import React from "react";

interface Translations
  extends Record<
    string,
    string | ((...args: any[]) => string) | Translations
  > {}

const missingKey = (key: string, ...args: any[]) => `__${key}__`;

export const I18nContext = React.createContext(missingKey);

export const I18nContextProvider = function ({
  children,
}: React.PropsWithChildren<{}>) {
  const { locale, locales, defaultLocale } = useRouter();
  const translations = React.useMemo(() => {
    const realLocale = locale || defaultLocale || locales?.[0] || "en";
    const data: Translations = require(`/i18n/${realLocale}.ts`).default;
    return data;
  }, [locale, locales, defaultLocale]);

  const translateFn = React.useCallback(
    (key: string, ...args: any[]) => {
      try {
        const splitKeys: string[] = key.split(".");
        let currentKey: string | undefined;
        let translation: string | ((...args: any[]) => string) | Translations =
          translations;

        while ((currentKey = splitKeys.shift())) {
          translation = (translation as Translations)[currentKey];
        }

        if (typeof translation === "function") {
          return translation(...args);
        }

        if (typeof translation === "string") {
          return translation as string;
        }

        throw Error("Incomplete translation key");
      } catch (e) {
        console.error(`Error getting translation for key ${key}`, e);
        return missingKey(key);
      }
    },
    [translations]
  );

  return (
    <I18nContext.Provider value={translateFn}>{children}</I18nContext.Provider>
  );
};
