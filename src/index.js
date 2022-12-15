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
} from "./functions.js";

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
    pushTask(defaultProject, taskBar.value);
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
  let currentItem = e.target.closest(".item");
  let currentItem__title = currentItem.querySelector(".item__title");
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
