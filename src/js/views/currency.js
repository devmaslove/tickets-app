import { getCurrencySymbolByCode } from "../helpers/currency";

class CurrencyUI {
  constructor(helpers) {
    this.currency = document.getElementById("currency");
    this.getCurrencySymbolByCode = helpers.getCurrencySymbolByCode;
  }
  get currencyValue() {
    return this.currency.value;
  }
  getCurrencySymbol() {
    return this.getCurrencySymbolByCode(this.currencyValue);
  }
}

const currencyUI = new CurrencyUI({ getCurrencySymbolByCode });

export default currencyUI;
