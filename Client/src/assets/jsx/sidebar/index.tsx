import { useEffect } from "react";

const SidebarToggle = () => {
  useEffect(() => {
    setTimeout(() => {
      const sidebar = document.getElementById("sidebar");
      const toggleSidebarMobileEl = document.getElementById("toggleSidebarMobile");
      const sidebarBackdrop = document.getElementById("sidebarBackdrop");
      const toggleSidebarMobileHamburger = document.getElementById("toggleSidebarMobileHamburger");
      const toggleSidebarMobileClose = document.getElementById("toggleSidebarMobileClose");
      const toggleSidebarMobileSearch = document.getElementById("toggleSidebarMobileSearch");

      console.log("sidebar:", sidebar);
      console.log("toggleSidebarMobileEl:", toggleSidebarMobileEl);
      console.log("sidebarBackdrop:", sidebarBackdrop);
      console.log("toggleSidebarMobileHamburger:", toggleSidebarMobileHamburger);
      console.log("toggleSidebarMobileClose:", toggleSidebarMobileClose);
      console.log("toggleSidebarMobileSearch:", toggleSidebarMobileSearch);

      if (
        sidebar &&
        toggleSidebarMobileEl &&
        sidebarBackdrop &&
        toggleSidebarMobileHamburger &&
        toggleSidebarMobileClose &&
        toggleSidebarMobileSearch
      ) {
        const toggleSidebarMobile = () => {
          sidebar.classList.toggle("hidden");
          sidebarBackdrop.classList.toggle("hidden");
          toggleSidebarMobileHamburger.classList.toggle("hidden");
          toggleSidebarMobileClose.classList.toggle("hidden");
        };

        toggleSidebarMobileSearch.addEventListener("click", toggleSidebarMobile);
        toggleSidebarMobileEl.addEventListener("click", toggleSidebarMobile);
        sidebarBackdrop.addEventListener("click", toggleSidebarMobile);

        return () => {
          toggleSidebarMobileSearch.removeEventListener("click", toggleSidebarMobile);
          toggleSidebarMobileEl.removeEventListener("click", toggleSidebarMobile);
          sidebarBackdrop.removeEventListener("click", toggleSidebarMobile);
        };
      } else {
        console.error("Required elements are missing from the DOM.");
      }
    }, 0);
  });

  return null;
};

export default SidebarToggle;
