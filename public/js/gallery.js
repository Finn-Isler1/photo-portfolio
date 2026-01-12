document.addEventListener("DOMContentLoaded", () => {
  const modal = document.getElementById("modal");
  const modalImage = document.getElementById("modal-image");
  const closeBtn = document.querySelector(".modal-close");
  const prevBtn = document.querySelector(".modal-prev");
  const nextBtn = document.querySelector(".modal-next");

  const items = Array.from(document.querySelectorAll(".gallery-item"));
  const photoData = items.map((el) => ({
    id: parseInt(el.getAttribute("data-image-id"), 10),
    path: el.getAttribute("data-path"),
    alt: el.querySelector("img")?.getAttribute("alt") || "",
  }));

  let currentIndex = 0;
  let isTransitioning = false;

  function openModal(photoId) {
    currentIndex = photoData.findIndex((p) => p.id === photoId);
    if (currentIndex === -1) return;
    updateModalContent();
    modal.classList.add("active");
    document.body.style.overflow = "hidden";
  }

  function closeModal() {
    modal.classList.remove("active");
    document.body.style.overflow = "";
  }

  function updateModalContent(fade = false) {
    if (!photoData[currentIndex]) return;
    if (fade && !isTransitioning) {
      isTransitioning = true;
      modalImage.classList.add("fading");
      setTimeout(() => {
        modalImage.src = photoData[currentIndex].path;
        modalImage.alt = photoData[currentIndex].alt;
        modalImage.classList.remove("fading");
        isTransitioning = false;
      }, 300);
    } else if (!fade) {
      modalImage.src = photoData[currentIndex].path;
      modalImage.alt = photoData[currentIndex].alt;
    }
  }

  function nextImage() {
    if (isTransitioning) return;
    currentIndex = (currentIndex + 1) % photoData.length;
    updateModalContent(true);
  }

  function prevImage() {
    if (isTransitioning) return;
    currentIndex = (currentIndex - 1 + photoData.length) % photoData.length;
    updateModalContent(true);
  }

  items.forEach((item) => {
    const photoId = parseInt(item.getAttribute("data-image-id"), 10);
    item.addEventListener("click", () => openModal(photoId));
  });

  closeBtn?.addEventListener("click", closeModal);
  prevBtn?.addEventListener("click", prevImage);
  nextBtn?.addEventListener("click", nextImage);

  modal?.addEventListener("click", (e) => {
    if (e.target === modal) closeModal();
  });

  document.addEventListener("keydown", (e) => {
    if (!modal.classList.contains("active")) return;
    if (e.key === "Escape") closeModal();
    if (e.key === "ArrowLeft") prevImage();
    if (e.key === "ArrowRight") nextImage();
  });
});
