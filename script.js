
"use strict";

document.addEventListener("DOMContentLoaded", () => {
  // Update the copyright year.
  const currentYear = document.getElementById("current-year");

  if (currentYear) {
    currentYear.textContent = new Date().getFullYear();
  }

 ```javascript
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

    primaryNav.addEventListener("click", (event) => {
      if (event.target.closest("a")) {
        setMenuState(false);
      }
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") {
        setMenuState(false);
      }
    });

    window.addEventListener("resize", () => {
      if (window.innerWidth > 760) {
        setMenuState(false);
      }
    });
  }
```

  // Prevent selection of a past travel date.
  const travelDate = document.getElementById("travel-date");

  const setMinimumTravelDate = () => {
    if (!travelDate) return;

    // Use the user's local calendar date, not UTC.
    const now = new Date();

    const localDate = [
      now.getFullYear(),
      String(now.getMonth() + 1).padStart(2, "0"),
      String(now.getDate()).padStart(2, "0")
    ].join("-");

    travelDate.min = localDate;
  };

  setMinimumTravelDate();

  // Booking form: prepare the customer's enquiry in WhatsApp.
  const bookingForm = document.getElementById("booking-form");
  const formError = document.getElementById("form-error");

  if (bookingForm) {
    bookingForm.addEventListener("submit", (event) => {
      event.preventDefault();

      if (formError) {
        formError.hidden = true;
        formError.textContent = "";
      }

      // Check native HTML validation first.
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

      // Show a helpful validation message.
      const showError = (message) => {
        if (formError) {
          formError.textContent = message;
          formError.hidden = false;
          formError.focus();
        } else {
          alert(message);
        }
      };

      // Validate required fields, including whitespace-only input.
      if (!name || !phone || !service || !pickup || !destination) {
        showError("Please complete all required fields.");
        return;
      }

      // Accept common Indian and international phone formats.
      const phoneDigits = phone.replace(/\D/g, "");

      if (phoneDigits.length < 7 || phoneDigits.length > 15) {
        showError("Please enter a valid contact number.");
        return;
      }

      // Check the date again in case it was entered manually.
      if (date) {
        setMinimumTravelDate();

        if (travelDate && date < travelDate.min) {
          showError("Please select today or a future travel date.");
          return;
        }
      }

      // Prepare the enquiry message.
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

      // Open WhatsApp from the submit action.
      // The customer must press Send in WhatsApp.
      window.open(whatsappURL, "_blank");
    });
  }
});
