const KEY_PREFIX = "azaria/yerevan";
const KEY_LOCALE = KEY_PREFIX + "/locale";

const Local = {
  setLocale (key: string) {
    localStorage.setItem(KEY_LOCALE, key);
  },

  getLocale () {
    return localStorage.getItem(KEY_LOCALE);
  }
}

export default Local;
