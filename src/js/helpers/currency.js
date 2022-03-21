const dictionary = {
  USD: "$",
  EUR: "€",
};

export function getCurrencySymbolByCode(code) {
  return dictionary[code] ?? "";
}
