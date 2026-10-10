"use strict";

document.addEventListener("DOMContentLoaded", function () {
  // Update copyright year
  var currentYear = document.getElementById("current-year");

  if (currentYear) {
    currentYear.textContent = new Date().getFullYear();
  }

  // Mobile navigation
  var menuToggle = document.querySelector(".menu-toggle");
  var primaryNav = document.getElementById("primary-nav");

  if (menuToggle && primaryNav) {
    function setMenuState(isOpen) {
      menuToggle.setAttribute("aria-expanded", String(isOpen));
      menuToggle.setAttribute(
        "aria-label",
        isOpen ? "Close navigation" : "Open navigation"
      );

      primaryNav.classList.toggle("is-open", isOpen);
      document.body.classList.toggle("menu-open", isOpen);
    }

    menuToggle.addEventListener("click", function (event) {
      event.preventDefault();

      var isOpen =
        menuToggle.getAttribute("aria-expanded") === "true";

      setMenuState(!isOpen);
    });

    primaryNav.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        setMenuState(false);
      });
    });

    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape") {
        setMenuState(false);
      }
    });

    window.addEventListener("resize", function () {
      if (window.innerWidth > 760) {
        setMenuState(false);
      }
    });
  }

  // Set the earliest allowed travel date
  var travelDate = document.getElementById("travel-date");

  function setMinimumTravelDate() {
    if (!travelDate) {
      return;
    }

    var now = new Date();
    var year = now.getFullYear();
    var month = String(now.getMonth() + 1).padStart(2, "0");
    var day = String(now.getDate()).padStart(2, "0");

    travelDate.min = year + "-" + month + "-" + day;
  }

  setMinimumTravelDate();

  // Booking form and WhatsApp enquiry
  var bookingForm = document.getElementById("booking-form");
  var formError = document.getElementById("form-error");

  if (bookingForm) {
    bookingForm.addEventListener("submit", function (event) {
      event.preventDefault();

      if (formError) {
        formError.hidden = true;
        formError.textContent = "";
      }

      if (!bookingForm.reportValidity()) {
        return;
      }

      var formData = new FormData(bookingForm);

      var name = String(formData.get("name") || "").trim();
      var phone = String(formData.get("phone") || "").trim();
      var service = String(formData.get("service") || "").trim();
      var pickup = String(formData.get("pickup") || "").trim();
      var destination = String(
        formData.get("destination") || ""
      ).trim();
      var date = String(formData.get("date") || "").trim();
      var details = String(
        formData.get("details") || ""
      ).trim();

      function showError(message) {
        if (formError) {
          formError.textContent = message;
          formError.hidden = false;
          formError.focus();
        } else {
          window.alert(message);
        }
      }

      // Check required fields
      if (!name || !phone || !service || !pickup || !destination) {
        showError("Please complete all required fields.");
        return;
      }

      // Validate contact number
      var phoneDigits = phone.replace(/\D/g, "");

      if (phoneDigits.length < 7 || phoneDigits.length > 15) {
        showError("Please enter a valid contact number.");
        return;
      }

      // Prevent past travel dates
      if (date) {
        setMinimumTravelDate();

        if (travelDate && date < travelDate.min) {
          showError("Please select today or a future travel date.");
          return;
        }
      }

      // Build the WhatsApp message
      var message = [
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

      var whatsappURL =
        "https://wa.me/918762578495?text=" +
        encodeURIComponent(message);

      window.open(whatsappURL, "_blank");
    });
  }
});
```
