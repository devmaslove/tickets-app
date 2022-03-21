import { formatDate } from "../helpers/date";
import { getCurrencySymbolByCode } from "../helpers/currency";
import api from "../services/apiService";

class Locations {
  constructor(api, helpers) {
    this.api = api;
    this.countries = null;
    this.cities = null;
    this.airlines = null;
    this.shortCitiesList = null;
    this.lastSearch = null;
    this.formatDate = helpers.formatDate;
    this.getCurrencySymbolByCode = helpers.getCurrencySymbolByCode;
  }
  async init() {
    const res = await Promise.all([
      this.api.cities(),
      this.api.countries(),
      this.api.airlines(),
    ]);
    const [cities, countries, airlines] = res;
    this.countries = this.serializeCounties(countries);
    this.cities = this.serializeCities(cities);
    this.shortCitiesList = this.createShortCitiesList(this.cities);
    this.airlines = this.serializeAirlines(airlines);
    return this;
  }
  serializeCounties(countries) {
    // { 'Country code', {...} }
    return countries.reduce((acc, country) => {
      acc[country.code] = country;
      return acc;
    }, {});
  }
  serializeCities(cities) {
    // { 'City, Country', {...} }
    return cities.reduce((acc, city) => {
      const country_name = this.getCountryNameByCode(city.country_code);
      city.name ??= city.name_translations.en;
      const full_name = `${city.name}, ${country_name}`;
      acc[city.code] = { ...city, country_name, full_name };
      return acc;
    }, {});
  }
  serializeAirlines(airlines) {
    return airlines.reduce((acc, airline) => {
      airline.logo = `http://pics.avs.io/200/200/${airline.code}.png`;
      airline.name ??= airline.name_translations.en;
      const key = airline.code;
      acc[key] = airline;
      return acc;
    }, {});
  }
  serializeTickets(tickets, currencySymbol) {
    return Object.values(tickets).map((ticket) => {
      return {
        ...ticket,
        currency_symbol: currencySymbol,
        origin_name: this.getCityNameByCode(ticket.origin),
        destination_name: this.getCityNameByCode(ticket.destination),
        airline_logo: this.getAirlineLogoByCode(ticket.airline),
        airline_name: this.getAirlineNameByCode(ticket.airline),
        departure_date: this.formatDate(
          ticket.departure_at,
          "dd MMM yyyy HH:mm",
        ),
        return_date: this.formatDate(ticket.return_at, "dd MMM yyyy HH:mm"),
      };
    });
  }
  createShortCitiesList(cities) {
    // { 'City, Country': null }
    // entries => [ key, value ]
    return Object.entries(cities).reduce((acc, [, city]) => {
      acc[city.full_name] = null;
      return acc;
    }, {});
  }
  getCountryNameByCode(code) {
    return this.countries[code].name;
  }
  getCityCodeByKey(key) {
    if (!this.cities) return "";
    const city = Object.values(this.cities).find(
      (value) => value.full_name === key,
    );
    return city?.code ?? "";
  }
  getCityNameByCode(code) {
    return this.cities[code].name;
  }
  getAirlineNameByCode(code) {
    return this.airlines[code]?.name ?? "";
  }
  getAirlineLogoByCode(code) {
    return this.airlines[code]?.logo ?? "";
  }
  async fetchTickets(params) {
    const currencyCode = params?.currency ?? "USD";
    const currencySymbol = this.getCurrencySymbolByCode(currencyCode);
    const res = await this.api.prices(params);
    this.lastSearch = this.serializeTickets(res.data, currencySymbol);
    console.log(this.lastSearch);
  }
}

const locations = new Locations(api, { formatDate, getCurrencySymbolByCode });

export default locations;
