
export default function modalPokeDetails() {
    const modal = document.querySelector(".modalContainer");
    const closeButton = modal.querySelector(".closeModal");

    closeButton.addEventListener("click", () => {
      modal.classList.remove("visible");
    });

    window.addEventListener("click", (event) => {
      if (event.target === modal) {
        modal.classList.remove("visible");
      }
    });

    function toggleActive(e) {
      const opt = document.querySelectorAll(".menu a");
      opt.forEach((link) => {
        link.classList.remove("active");
      });
      e.currentTarget.classList.add("active");
    
      const target = e.currentTarget.dataset.target;
      const sections = document.querySelectorAll(".section");
    
      sections.forEach((section) => {
        if (section.id === target) {
          section.style.display = "block";
        } else {
          section.style.display = "none";
        }
      });
    }
    
    const opt = document.querySelectorAll(".menu a");
    opt.forEach((link) => {
      link.addEventListener("click", toggleActive);
    });



}
