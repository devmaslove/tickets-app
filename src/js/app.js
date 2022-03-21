import "../css/style.css";
import "./plugins";
import favoritesUI from "./views/favorites";
import favorites from "./store/favorites";
import ticketsUI from "./views/tickets";
import locations from "./store/locations";
import formUI from "./views/form";
import currencyUI from "./views/currency";

document.addEventListener("DOMContentLoaded", () => {
  initApp();
  const form = formUI.form;
  // Events
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    onFormSubmit();
  });
  ticketsUI.container.addEventListener("click", (e) => {
    e.preventDefault();
    if (e.target.classList.contains("add-favorite")) {
      const parent = e.target.closest("[data-ticket-index]");
      const indexTicket = parent.getAttribute("data-ticket-index");
      const ticket = locations.lastSearch[indexTicket];
      onAddTicketToFavorite(ticket);
    }
  });
  favoritesUI.container.addEventListener("click", (e) => {
    e.preventDefault();
    if (e.target.classList.contains("delete-favorite")) {
      const parent = e.target.closest("[data-ticket-index]");
      const indexTicket = parent.getAttribute("data-ticket-index");
      const ticket = favorites.tickets[indexTicket];
      onRemoveTicketFromFavorite(ticket);
    }
  });
  // Handlers
  function onAddTicketToFavorite(ticket) {
    if (ticket) {
      favorites.tickets.push(ticket);
      favoritesUI.renderFavoritesTickets(favorites.tickets);
    }
  }
  function onRemoveTicketFromFavorite(ticket) {
    if (ticket) {
      const index = favorites.tickets.indexOf(ticket);
      if (index > -1) {
        favorites.tickets.splice(index, 1);
        favoritesUI.renderFavoritesTickets(favorites.tickets);
      }
    }
  }
  async function initApp() {
    await locations.init();
    formUI.setAutocompleteData(locations.shortCitiesList);
    favoritesUI.renderFavoritesTickets([]);
    console.log(locations);
  }
  async function onFormSubmit() {
    // собрать данные из инпутов
    const origin = locations.getCityCodeByKey(formUI.originValue);
    const destination = locations.getCityCodeByKey(formUI.destinationValue);
    const depart_date = formUI.departDate;
    const return_date = formUI.returnDate;
    const currency = currencyUI.currencyValue;
    await locations.fetchTickets({
      origin,
      destination,
      depart_date,
      return_date,
      currency,
    });
    ticketsUI.renderTickets(locations.lastSearch);
  }
});
