"use strict";

document.addEventListener("DOMContentLoaded", () => {
  // Update the copyright year.
  const currentYear = document.getElementById("current-year");

  if (currentYear) {
    currentYear.textContent = new Date().getFullYear();
  }

  // Mobile navigation.
  const menuToggle = document.querySelector(".menu-toggle");
  const primaryNav = document.getElementById("primary-nav");

  if (menuToggle && primaryNav) {
    const setMenuState = (isOpen) => {
      menuToggle.setAttribute("aria-expanded", String(isOpen));
      menuToggle.setAttribute(
        "aria-label",
        isOpen ? "Close navigation" : "Open navigation"
      );

      primaryNav.classList.toggle("is-open", isOpen);
      document.body.classList.toggle("menu-open", isOpen);
    };

    menuToggle.addEventListener("click", (event) => {
      event.preventDefault();

      const isOpen =
        menuToggle.getAttribute("aria-expanded") === "true";

      setMenuState(!isOpen);
    });

    // Close the menu when a navigation link is selected.
    primaryNav.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        setMenuState(false);
      });
    });

    // Close the menu with the Escape key.
    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") {
        setMenuState(false);
      }
    });

    // Close the menu when returning to desktop layout.
    window.addEventListener("resize", () => {
      if (window.innerWidth > 760) {
        setMenuState(false);
      }
    });
  }

  // Prevent selection of a past travel date.
  const travelDate = document.getElementById("travel-date");

  const setMinimumTravelDate = () => {
    if (!travelDate) return;

    // Use the local calendar date rather than UTC.
    const now = new Date();

    const localDate = [
      now.getFullYear(),
      String(now.getMonth() + 1).padStart(2, "0"),
      String(now.getDate()).padStart(2, "0")
    ].join("-");

    travelDate.min = localDate;
  };

  setMinimumTravelDate();

  // Booking form: prepare the enquiry in WhatsApp.
  const bookingForm = document.getElementById("booking-form");
  const formError = document.getElementById("form-error");

  if (bookingForm) {
    bookingForm.addEventListener("submit", (event) => {
      event.preventDefault();

      if (formError) {
        formError.hidden = true;
        formError.textContent = "";
      }

      // Check built-in HTML form validation.
      if (!bookingForm.reportValidity()) {
        return;
      }

      const formData = new FormData(bookingForm);

      const name = String(formData.get("name") || "").trim();
      const phone = String(formData.get("phone") || "").trim();
      const service = String(formData.get("service") || "").trim();
      const pickup = String(formData.get("pickup") || "").trim();
      const destination = String(
        formData.get("destination") || ""
      ).trim();
      const date = String(formData.get("date") || "").trim();
      const details = String(
        formData.get("details") || ""
      ).trim();

      // Display a helpful validation message.
      const showError = (message) => {
        if (formError) {
          formError.textContent = message;
          formError.hidden = false;
          formError.focus();
        } else {
          alert(message);
        }
      };

      // Validate required fields.
      if (!name || !phone || !service || !pickup || !destination) {
        showError("Please complete all required fields.");
        return;
      }

      // Validate the contact number.
      const phoneDigits = phone.replace(/\D/g, "");

      if (phoneDigits.length < 7 || phoneDigits.length > 15) {
        showError("Please enter a valid contact number.");
        return;
      }

      // Validate the travel date again before submitting.
      if (date) {
        setMinimumTravelDate();

        if (travelDate && date < travelDate.min) {
          showError("Please select today or a future travel date.");
          return;
        }
      }

      // Build the WhatsApp enquiry.
      const message = [
        "Hello Nayara Taxi Service Mangalore,",
        "",
        "I would like to enquire about a taxi.",
        "",
        "Name: " + name,
        "Contact number: " + phone,
        "Travel service: " + service,
        "Pickup location: " + pickup,
        "Destination: " + destination,
        "Travel date: " + (date || "Not specified"),
        "Additional details: " + (details || "None"),
        "",
        "Please contact me regarding availability and pricing."
      ].join("\n");

      const whatsappURL =
        "https://wa.me/918762578495?text=" +
        encodeURIComponent(message);

      // Open WhatsApp. The customer must press Send.
      const whatsappWindow = window.open(
        whatsappURL,
        "_blank",
        "noopener,noreferrer"
      );

      // Explain if the browser blocks the new window.
      if (!whatsappWindow) {
        showError(
          "WhatsApp could not open automatically. Please allow pop-ups or contact us directly on +91 87625 78495."
        );
      }
    });
  }
});
```
