```javascript
"use strict";

document.addEventListener("DOMContentLoaded", () => {
  // 1. Automatically update the copyright year.
  const currentYear = document.getElementById("current-year");

  if (currentYear) {
    currentYear.textContent = new Date().getFullYear();
  }

  // 2. Mobile navigation menu.
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

    // Open and close the menu when the button is clicked.
    menuToggle.addEventListener("click", (event) => {
      event.preventDefault();

      const isCurrentlyOpen =
        menuToggle.getAttribute("aria-expanded") === "true";

      setMenuState(!isCurrentlyOpen);
    });

    // Close the menu after clicking a navigation link.
    primaryNav.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        setMenuState(false);
      });
    });

    // Close the menu when the Escape key is pressed.
    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") {
        setMenuState(false);
      }
    });

    // Close the mobile menu when returning to desktop width.
    window.addEventListener("resize", () => {
      if (window.innerWidth > 760) {
        setMenuState(false);
      }
    });
  }

  // 3. Prevent selecting a travel date in the past.
  const travelDate = document.getElementById("travel-date");

  const setMinimumTravelDate = () => {
    if (!travelDate) {
      return;
    }

    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const day = String(now.getDate()).padStart(2, "0");

     travelDate.min = year + "-" + month + "-" + day;
  };

  setMinimumTravelDate();

  // 4. Booking form: validate details and open WhatsApp.
  const bookingForm = document.getElementById("booking-form");
  const formError = document.getElementById("form-error");

  if (bookingForm) {
    bookingForm.addEventListener("submit", (event) => {
      event.preventDefault();

      if (formError) {
        formError.hidden = true;
        formError.textContent = "";
      }

      // Check required HTML form fields.
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
          window.alert(message);
        }
      };

      // Validate required booking details.
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

      // Validate the selected travel date.
      if (date) {
        setMinimumTravelDate();

        if (travelDate && date < travelDate.min) {
          showError("Please select today or a future travel date.");
          return;
        }
      }

      // Prepare the WhatsApp enquiry message.
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

      // Open WhatsApp using the Nayara business number.
      const whatsappURL =
        "https://wa.me/918762578495?text=" +
        encodeURIComponent(message);

      window.open(whatsappURL, "_blank", "noopener,noreferrer");
    });
  }
});
```
