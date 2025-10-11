const Fmt = {
  number (number: number, decimalPlaces: number = 2) : string {
    return number.toLocaleString(undefined, {
      minimumFractionDigits: decimalPlaces,
      maximumFractionDigits: decimalPlaces,
    });
  },
};

export default Fmt;
