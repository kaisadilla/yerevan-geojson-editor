import i18n from 'i18next';
import Logger from 'Logger';
import { initReactI18next } from 'react-i18next';

import icon_en_UK from 'assets/img/lang/en-UK.svg';
import icon_es_ES from 'assets/img/lang/es-ES.svg';
import Local from 'Local';

const locales = import.meta.glob('./.gen/locale/*.json', { eager: true });

const params = new URLSearchParams(window.location.search);
const langParam = params.get('lang');

i18n
  .use(initReactI18next)
  .use({
    type: 'backend',
    read: async (lng: string, ns: string, callback: any) => {
      try {
        const key = `.gen/locale/${lng}.${ns}.json`;
        const module = locales[key];

        if (module) {
          const data = (module as any).default ?? module;
          callback(null, data);
        }
        else {
          Logger.error(`[i18n] Missing translation file: ${key}`);
          callback(new Error(`Missing ${key}`), false);
        }
      } catch (err) {
        Logger.error("[i18n]", err);
        callback(err as any, false);
      }
    },
  })
  .init({
    lng: langParam ?? Local.getLocale() ?? "en-GB",
    fallbackLng: 'en-GB',
    debug: import.meta.env.DEV,
    interpolation: {
      escapeValue: false,
    },
    ns: [
      'ui',
      'data',
    ],
    defaultNS: 'ui',
    react: {
      useSuspense: true,
    },
  });

if (import.meta.hot) {
  const locales = import.meta.glob('./.gen/locale/*.json');

  Object.keys(locales).forEach((key) => {
    import.meta.hot?.accept(key, async (module) => {
      const match = key.match(/\/(\w{2}-\w{2})\.(\w+)\.json$/);
      if (!match) return;

      const [, lng, ns] = match;
      const data = module ? (module as any).default ?? module : {};
      i18n.addResources(lng, ns, data.default ?? data);
      i18n.reloadResources(lng, ns);
      console.log(`[i18n] Reloaded ${lng}.${ns}`);
    });
  });
};

const LOCALE_ICONS = {
  "en-GB": icon_en_UK,
  "es-ES": icon_es_ES,
};

export const LOCALE_NAMES = {
  "en-GB": "English (United Kingdom)",
  "es-ES": "Español (España)",
};

export function getLocaleIcon (key: string) : string {
  if (key in LOCALE_ICONS) {
    return LOCALE_ICONS[key as keyof typeof LOCALE_ICONS];
  }

  return icon_en_UK;
}

export function getLocaleName (key: string) : string {
  if (key in LOCALE_NAMES) {
    return LOCALE_NAMES[key as keyof typeof LOCALE_NAMES];
  }

  return "[Unknown locale]";
}

export default i18n;
