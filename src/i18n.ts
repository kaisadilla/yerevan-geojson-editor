import i18n from 'i18next';
import Logger from 'Logger';
import { initReactI18next } from 'react-i18next';

const locales = import.meta.glob('./.gen/locale/*.json', { eager: true });
console.log(locales);

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
    fallbackLng: 'en-US',
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
}

export default i18n;
