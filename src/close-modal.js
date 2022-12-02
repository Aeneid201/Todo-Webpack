// close modal
let closeModal = document.querySelector(".closeModal");
let customModal = document.querySelector(".custom-modal");
let closeModalFunc = closeModal.addEventListener("click", function (e) {
  e.preventDefault();
  customModal.classList.add("d-none");
});

export { closeModal };
