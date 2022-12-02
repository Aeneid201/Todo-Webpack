// bootstrap
import "bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import { compareAsc, format } from "date-fns";
// format(new Date(2014, 1, 11), 'yyyy-MM-dd');

// custom styles
import "./style.css";

// functions
// import { closeModal } from "./close-modal.js";

("use strict");
// caching DOM
let addBtn = document.querySelector("#add");
let entry = document.querySelector("#item");
let itemsList = document.querySelector(".items");
const customModal = document.querySelector(".custom-modal");

// todo array
let todos = [
  {
    id: 0,
    title: "wash dishes",
    description: "need to wash dishes tonight",
    dueDate: "2022-11-29",
    priority: "medium",
  },
  {
    id: 1,
    title: "buy hamster food",
    description: "silver needs seeds",
    dueDate: "2023-01-01",
    priority: "high",
  },
];

// populating local storage
function populateStorage() {
  localStorage.setItem("list", JSON.stringify(todos));
}

let storedItems = JSON.parse(localStorage.getItem("list"));

// if localStorage is not empty, push the items to the todos array
if (storedItems) {
  todos.push(...storedItems);
}

// display todo items
function render() {
  todos.forEach((item, i) => {
    let html = `<div class="item" data-item="${i}">
    <div>
    <p class="item__title">${item.title}</p>
    <input class="item__input d-none" autocomplete="off" value="${item.title}">
    </div>

    <div class="item__date">
    ${item.dueDate}
    </div>
    <div class="item__priority badge ${item.priority}">
    ${item.priority}
    </div>
    <div class="item__buttons">
      <button class="edit"><img src="/images/pen.png"></button>
      <button class="delete"><img src="/images/trash.png"></button>
      <button class="settings"><img src="/images/settings.png"></button>
    </div>
  </div>`;
    itemsList.insertAdjacentHTML("afterbegin", html);
  });
}
render();

// add item
addBtn.addEventListener("click", function (e) {
  e.preventDefault();
  if (entry.value) {
    // create new object then push it to the array
    createItem(entry.value);
    // populateStorage();
  } else {
    alert("Field cannot be empty! Please try again.");
  }

  // clear and render
  clearAll();
  clearField();
  render();
});

// edit item
itemsList.addEventListener("click", function (e) {
  let currentItem = e.target.closest(".item");
  let item__index = currentItem.getAttribute("data-item");
  let clickedBtn = e.target.closest("button");
  let item__title = currentItem.querySelector(".item__title");
  let item__value = currentItem.querySelector(".item__input");

  // if button was clicked, check which one
  if (clickedBtn) {
    if (clickedBtn.classList.contains("edit")) {
      // edit item
      item__title.classList.add("d-none");
      item__value.classList.remove("d-none");

      item__value.addEventListener("keypress", function (e) {
        if (e.key === "Enter") {
          e.preventDefault();

          // TODO: check if edited title already exists

          // update item title
          todos[item__index].title = item__value.value;
          // populateStorage();
          item__title.classList.remove("d-none");
          item__value.classList.add("d-none");

          // clear and render
          clearAll();
          render();
        }
      });
    }
    // delete item
    else if (clickedBtn.classList.contains("delete")) {
      todos.splice(item__index, 1);
      // populateStorage();
      clearAll();
      render();
    }
    // open item settings
    else if (clickedBtn.classList.contains("settings")) {
      customModal.classList.remove("d-none");
      populateModal(todos[item__index]);
    }
  }
});

// clear all items
function clearAll() {
  itemsList.innerHTML = "";
}

// clear entry input
function clearField() {
  entry.value = "";
}

// populate modal

let task__title = document.querySelector(".task__title");
let task__priority = document.querySelector(".task__priority");
let task__date = document.querySelector(".task__date");
let task__description = document.querySelector(".task__description");
function populateModal(item) {
  task__title.value = item.title;
  task__priority.textContent = item.priority;
  task__priority.classList.add(item.priority);
  task__date.value = item.dueDate;
  task__description.value = item.description;
  customModal.setAttribute("data-item", item.id);
}

// save modal changes
let saveChanges = document.querySelector(".save_changes");
saveChanges.addEventListener("click", function (e) {
  e.preventDefault();

  let itemID = customModal.getAttribute("data-item");
  let currentItem = todos.filter((item) => item.id == itemID)[0];

  // update title
  if (task__title.value !== currentItem.title) {
    currentItem.title = task__title.value;
  }

  // update description
  if (task__description.value !== currentItem.description) {
    currentItem.description = task__description.value;
  }

  // update due date
  if (task__date.value !== currentItem.dueDate) {
    currentItem.dueDate = task__date.value;
  }

  clearAll();
  render();
  closeCustomModal();
});

// close modal
let closeModal = document.querySelector(".closeModal");
closeModal.addEventListener("click", closeCustomModal);

function closeCustomModal() {
  customModal.classList.add("d-none");
}

// create new item
const today = new Date();
function createItem(
  title,
  description = "",
  dueDate = today,
  priority = "low",
  id = 0
) {
  let new_item = new Object();
  new_item.title = title;
  new_item.description = description;
  new_item.dueDate = format(dueDate, "yyyy-MM-dd");
  new_item.priority = priority;
  new_item.id = id;
  todos.push(new_item);
}
