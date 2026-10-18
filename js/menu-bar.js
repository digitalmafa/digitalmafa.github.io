    function openMenu() {
      document.getElementById("sidebar").classList.add("active");
      document.getElementById("overlay").classList.add("active");
      document.querySelector(".menu-btn")
        .setAttribute("aria-expanded", "true");
    }

    function closeMenu() {
      document.getElementById("sidebar").classList.remove("active");
      document.getElementById("overlay").classList.remove("active");
      document.querySelector(".menu-btn")
        .setAttribute("aria-expanded", "false");
    }

    document.addEventListener("keydown", function(event) {
      if (event.key === "Escape") closeMenu();
    });
