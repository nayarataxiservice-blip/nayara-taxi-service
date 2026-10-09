
"use strict";

document.addEventListener("DOMContentLoaded", () => {
  const menuToggle = document.querySelector(".menu-toggle");
  const primaryNav = document.querySelector("#primary-nav");
  const bookingForm = document.querySelector("#booking-form");
  const formError = document.querySelector("#form-error");
  const yearElement = document.querySelector("#current-year");
  const dateInput = document.querySelector("#travel-date");

  const whatsappNumber = "918762578495";

  // Automatically update the footer year.
  if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
  }

  // Prevent customers from choosing a past travel date.
  if (dateInput) {
    const today = new Date();
    const localToday = [
      today.getFullYear(),
      String(today.getMonth() + 1).padStart(2, "0"),
      String(today.getDate()).padStart(2, "0")
    ].join("-");

    dateInput.min = localToday;
  }

  // Accessible mobile navigation.
  function closeMenu() {
    if (!menuToggle || !primaryNav) return;

    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-label", "Open navigation");
    primaryNav.classList.remove("is-open");
    document.body.classList.remove("menu-open");
  }

  if (menuToggle && primaryNav) {
    menuToggle.addEventListener("click", () => {
      const isExpanded =
        menuToggle.getAttribute("aria-expanded") === "true";

      menuToggle.setAttribute("aria-expanded", String(!isExpanded));
      menuToggle.setAttribute(
        "aria-label",
        isExpanded ? "Open navigation" : "Close navigation"
      );

      primaryNav.classList.toggle("is-open", !isExpanded);
      document.body.classList.toggle("menu-open", !isExpanded);
    });

    primaryNav.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", closeMenu);
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") {
        closeMenu();
        menuToggle.focus();
      }
    });

    document.addEventListener("click", (event) => {
      if (
        primaryNav.classList.contains("is-open") &&
        !primaryNav.contains(event.target) &&
        !menuToggle.contains(event.target)
      ) {
        closeMenu();
      }
    });

    window.addEventListener("resize", () => {
      if (window.innerWidth > 760) {
        closeMenu();
      }
    });
  }

  // Build the customer's enquiry and open WhatsApp.
  if (bookingForm) {
    bookingForm.addEventListener("submit", (event) => {
      event.preventDefault();

      if (formError) {
        formError.hidden = true;
      }

      if (!bookingForm.checkValidity()) {
        bookingForm.reportValidity();
        return;
      }

      const formData = new FormData(bookingForm);

      const name = String(formData.get("name") || "").trim();
      const phone = String(formData.get("phone") || "").trim();
      const service = String(formData.get("service") || "").trim();
      const pickup = String(formData.get("pickup") || "").trim();
      const destination =
        String(formData.get("destination") || "").trim();
      const date = String(formData.get("date") || "").trim();
      const details =
        String(formData.get("details") || "").trim();

      // Basic checks before preparing the enquiry.
      const phoneDigits = phone.replace(/\D/g, "");

      if (
        name.length < 2 ||
        phoneDigits.length < 7 ||
        !service ||
        !pickup ||
        !destination
      ) {
        if (formError) {
          formError.hidden = false;
          formError.textContent =
            "Please enter your name, a valid contact number, service, pickup and destination.";
        }
        return;
      }

      const message = [
        "Hello Nayara Taxi Service Mangalore,",
        "",
        "I would like to make a travel enquiry.",
        "",
        "Name: " + name,
        "Contact number: " + phone,
        "Service: " + service,
        "Pickup: " + pickup,
        "Destination: " + destination,
        "Travel date: " + (date || "Not specified"),
        "Additional details: " + (details || "None"),
        "",
        "Please contact me regarding availability and pricing."
      ].join("\n");

      const whatsappURL =
        "https://wa.me/" +
        whatsappNumber +
        "?text=" +
        encodeURIComponent(message);

      // The customer reviews and sends the message in WhatsApp.
      const openedWindow = window.open(
        whatsappURL,
        "_blank",
        "noopener,noreferrer"
      );

      // Fallback for browsers that block new windows.
      if (!openedWindow) {
        window.location.href = whatsappURL;
      }
    });
  }
});
