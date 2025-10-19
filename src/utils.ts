/**
 * Generates the className string from the arguments given.
 * Two types of arguments can be passed:
 ** A string, which will be added to the class names.
 ** An array containing a string and a boolean. The string will be added as
 * a class name only if the boolean given is true.
 * @param params 
 * @returns 
 */
export function $cl(
  ...params: (string | boolean | [string, boolean | undefined] | undefined | null)[]
): string | undefined {
  let str = "";

  for (const classEntry of params) {
    if (classEntry === undefined) {
      continue;
    }
    if (classEntry === null) {
      continue;
    }
    if (classEntry === false) {
      continue;
    }
    // if the entry is conditional.
    if (Array.isArray(classEntry)) {
      if (classEntry[1]) {
        str += classEntry[0] + " ";
      }
    }
    else {
      str += classEntry + " ";
    }
  }

  const cls = str.trim();
  return cls === "" ? undefined : cls;
}

export function deleteItemAt<T> (array: T[], index: number): T[] {
  if (index < 0 || index >= array.length) {
    return array.slice();
  }

  return [...array.slice(0, index), ...array.slice(index + 1)];
}

export function repeat<T> (amount: number, callback: (i: number) => T) {
  return Array.from({ length: amount }).map((_, i) => callback(i));
}

export function randomUuid(): string {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  } else {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
      const r = Math.random() * 16 | 0;
      const v = c === 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }
}

export function formatHourTimestamp (date: Date) {
  const hh = date.getHours().toString().padStart(2, '0');
  const mm = date.getMinutes().toString().padStart(2, '0');
  const ss = date.getSeconds().toString().padStart(2, '0');

  return `${hh}:${mm}:${ss}`;
}

export function delay (ms: number) {
  return new Promise(res => setTimeout(res, ms));
}

/**
 * Given the hex color of a background, calculates whether the color of higher
 * contrast for text in that background is black or white.
 * @param background 
 */
export function chooseW3CTextColor (background: string) : 'black' | 'white' {
  // Done according to this: https://stackoverflow.com/a/3943023/23342298

  if (background.startsWith("#")) background = background.substring(1, 7);
  if (background.length < 6) throw `'${background}' is not a valid color.`;


  const r = parseInt(background.substring(0, 2), 16);
  const g = parseInt(background.substring(2, 4), 16);
  const b = parseInt(background.substring(4, 6), 16);

  let rVal = calculateVal(r);
  let gVal = calculateVal(g);
  let bVal = calculateVal(b);

  const l = (0.2126 * rVal) + (0.7152 * gVal) + (0.0722 * bVal);

  return l > 0.179 ? 'black' : 'white';

  function calculateVal (c: number) {
    c /= 255;

    if (c < 0.04045) {
      return c / 12.92;
    }
    else {
      return ((c + 0.055) / 1.055) ** 2.4;
    }
  }
}

export function romanNumber (num: number) {
  if (typeof num !== 'number' || num <= 0 || num >= 4000 || !Number.isInteger(num)) {
    return num;
  }

  const romanNumerals = [
    { value: 1000, numeral: 'M' },
    { value: 900,  numeral: 'CM' },
    { value: 500,  numeral: 'D' },
    { value: 400,  numeral: 'CD' },
    { value: 100,  numeral: 'C' },
    { value: 90,   numeral: 'XC' },
    { value: 50,   numeral: 'L' },
    { value: 40,   numeral: 'XL' },
    { value: 10,   numeral: 'X' },
    { value: 9,    numeral: 'IX' },
    { value: 5,    numeral: 'V' },
    { value: 4,    numeral: 'IV' },
    { value: 1,    numeral: 'I' },
  ];

  let result = '';
  for (const { value, numeral } of romanNumerals) {
    while (num >= value) {
      result += numeral;
      num -= value;
    }
  }
  return result;
}

export function numberWithDecimals (num: number, dec: number) : string {
  return parseFloat(num.toFixed(dec)).toString();
}

/**
 * Returns true if the target of an event is editable - i.e. it receives
 * keyboard input.
 * @param target The target of an event (evt.target).
 */
export function isEventTargetEditable (target: EventTarget | null) {
  if (!(target instanceof HTMLElement)) return false;

  if (target.isContentEditable) return true;

  const tag = target.tagName.toLowerCase();

  if (tag === 'textarea') return true;

  if (tag === 'input') {
    const input = target as HTMLInputElement;
    const type = input.type?.toLowerCase() ?? 'text';

    return type === 'text'
      || type === 'search'
      || type === 'password'
      || type === 'email'
      || type === 'url'
      || type === 'tel'
      || type === 'number'
      ;
  }

  return false;
}

/**
 * By default, shift + click on a label won't act as a click on the input
 * element the label is pointing to. By calling this function with the click
 * event 
 * @param evt 
 * @returns 
 */
export function allowLabelShiftClick (evt: MouseEvent) {
  if (!evt.shiftKey) return;
  
  const lbl = (evt.target as HTMLElement)?.closest('label');
  if (!lbl) return;

  const inputId = lbl.getAttribute('for');
  if (!inputId) return;

  const input = document.getElementById(inputId);
  if (!input) return;

  evt.preventDefault();
  input.click();
}
