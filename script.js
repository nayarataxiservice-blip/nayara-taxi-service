```javascript
"use strict";

document.addEventListener("DOMContentLoaded", () => {
  // 1. Update copyright year.
  const currentYear = document.getElementById("current-year");

  if (currentYear) {
    currentYear.textContent = new Date().getFullYear();
  }

  // 2. Mobile navigation.
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

      const currentlyOpen =
        menuToggle.getAttribute("aria-expanded") === "true";

      setMenuState(!currentlyOpen);
    });

    primaryNav.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        setMenuState(false);
      });
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

  // 3. Set the earliest allowed travel date.
  const travelDate = document.getElementById("travel-date");

  const setMinimumTravelDate = () => {
    if (!travelDate) return;

    const now = new Date();

    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const day = String(now.getDate()).padStart(2, "0");

    travelDate.min = `${year}-${month}-${day}`;
  };

  setMinimumTravelDate();

  // 4. Booking form and WhatsApp enquiry.
  const bookingForm = document.getElementById("booking-form");
  const formError = document.getElementById("form-error");

  if (bookingForm) {
    bookingForm.addEventListener("submit", (event) => {
      event.preventDefault();

      if (formError) {
        formError.hidden = true;
        formError.textContent = "";
      }

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

      // Validate phone number length.
      const phoneDigits = phone.replace(/\D/g, "");

      if (phoneDigits.length < 7 || phoneDigits.length > 15) {
        showError("Please enter a valid contact number.");
        return;
      }

      // Prevent past travel dates.
      if (date) {
        setMinimumTravelDate();

        if (travelDate && date < travelDate.min) {
          showError("Please select today or a future travel date.");
          return;
        }
      }

      ```javascript
      // Create the WhatsApp message.
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

      window.open(whatsappURL, "_blank");
```
    });
  }
});
```
