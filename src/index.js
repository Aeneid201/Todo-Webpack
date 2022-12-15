// Bootstrap
import "bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import { compareAsc, format } from "date-fns";
// format(new Date(2014, 1, 11), 'yyyy-MM-dd');

// Custom stylesheet
import "./style.css";

// Importing necessary functions
import {
  getCurrentDate,
  clearAll,
  clearField,
  createTask,
  createProject,
  pushTask,
  renderTask,
  findCurrentIndex,
} from "./functions.js";
import { ta } from "date-fns/locale";

// DOM elements
let addBtn = document.querySelector("#add");
let taskBar = document.querySelector("#item");
let itemsList = document.querySelector(".items");
const todo_section = document.querySelector(".todo");
const customModal = document.querySelector(".custom-modal");
const item__title = document.querySelector(".item__title");
const item__input = document.querySelector(".item__input");

// First/default project
let defaultProject = createProject("First Project");

// test task
let myTask = createTask("test");
let task2 = createTask("buy groceries");
pushTask(defaultProject, myTask);
pushTask(defaultProject, task2);

// Display the tasks
function render() {
  defaultProject["tasks"].forEach((item, i) => {
    renderTask(itemsList, item);
  });
}
render();

// Add new task
addBtn.addEventListener("click", function (e) {
  e.preventDefault();

  // validate input
  if (taskBar.value) {
    pushTask(defaultProject, createTask(taskBar.value));
    console.log(defaultProject);
    clearField(taskBar);
    clearAll(itemsList);
    render();
  } else {
    alert("Please enter a task");
  }
});

// Edit task
itemsList.addEventListener("click", function (e) {
  let clickedBtn = e.target.closest("button");
  let currentItem = e.target.closest(".item");
  let currentItem__title = currentItem.querySelector(".item__title");
  let currentItem__button = currentItem.querySelectorAll("button");
  let currentItem__input = currentItem.querySelector(".item__input");
  let currentItem__index = findCurrentIndex(
    defaultProject,
    currentItem__title.innerText
  );

  if (clickedBtn) {
    // Delete task
    if (clickedBtn.classList.contains("delete")) {
      defaultProject.tasks.splice(currentItem__index, 1);
      clearAll(itemsList);
      render();
    }

    // Edit task
    if (clickedBtn.classList.contains("edit")) {
      currentItem__title.classList.add("d-none");
      currentItem__input.classList.remove("d-none");

      currentItem__input.addEventListener("keypress", function (e) {
        if (e.key === "Enter") {
          defaultProject.tasks[currentItem__index].title =
            currentItem__input.value;
          currentItem__title.classList.remove("d-none");
          currentItem__input.classList.add("d-none");
          clearAll(itemsList);
          render();
        }
      });
    }
  }
});

// Populate the modal
let task__title = document.querySelector(".task__title");
let priority_checkbox = document.querySelector(".priority_checkbox");
let task__priority = document.querySelector(".task__priority");
let priority_input = document.querySelector(".priority_input");
let task__date = document.querySelector(".task__date");
let task__description = document.querySelector(".task__description");

// Close the modal
let closeModal = document.querySelector(".closeModal");
closeModal.addEventListener("click", closeCustomModal);
function closeCustomModal() {
  customModal.classList.add("d-none");
  todo_section.classList.remove("blur");
}
