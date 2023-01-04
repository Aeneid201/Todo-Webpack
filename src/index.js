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
  getCurrentProject,
  pushProject,
  renderProject,
  findProjectIndex,
  isUniqueProject,
  isUniqueTask,
  isDuplicated,
} from "./functions.js";

// DOM elements
let addBtn = document.querySelector("#add");
let taskBar = document.querySelector("#item");
let itemsList = document.querySelector(".items");
const todo_section = document.querySelector(".todo");
let projects_list = document.querySelector(".projects__list");
let current_project__title = document.querySelector(".current-project__title");
let addProjectBtn = document.querySelector(".addProject");
let current_project;
let projects = [];
// Modal elements
const customModal = document.querySelector(".custom-modal");
let task__title = document.querySelector(".task__title");
let task__date = document.querySelector(".task__date");
let task__description = document.querySelector(".task__description");
let task__priority = document.querySelectorAll('input[name="priority_input"]');
const saveChangesButton = document.querySelector(".save_changes");

// First/default project
let defaultProject = createProject("Default Project");
pushProject(projects, defaultProject);
current_project = defaultProject;
current_project__title.innerText = current_project.title;

// test tasks
let myTask = createTask(
  "test",
  "this is a short description of my first task",
  "medium"
);
let task2 = createTask(
  "buy groceries",
  "need to do groceries before xmas break",
  "high"
);
pushTask(current_project, myTask);
pushTask(current_project, task2);

// Display the tasks
function render() {
  current_project["tasks"].forEach((item, i) => {
    renderTask(itemsList, item);
  });
}
render();

// Display the projects
function renderAllProjects() {
  projects.forEach((project, i) => {
    renderProject(projects_list, project);
  });
}

renderAllProjects();

// Add new task
addBtn.addEventListener("click", function (e) {
  e.preventDefault();

  // validate input
  if (taskBar.value && isUniqueTask(current_project, taskBar.value)) {
    pushTask(current_project, createTask(taskBar.value));
    clearField(taskBar);
    clearAll(itemsList);
    render();
  } else {
    alert("This task already exists within your project");
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
    current_project,
    currentItem__title.innerText
  );
  let currentItemObj = current_project.tasks[currentItem__index];

  if (clickedBtn) {
    // Delete task
    if (clickedBtn.classList.contains("delete")) {
      current_project.tasks.splice(currentItem__index, 1);
      currentItem.remove();
    }

    // Edit task
    if (clickedBtn.classList.contains("edit")) {
      currentItem__title.classList.add("d-none");
      currentItem__input.classList.remove("d-none");

      currentItem__input.addEventListener("keypress", function (e) {
        if (e.key === "Enter") {
          current_project.tasks[currentItem__index].title =
            currentItem__input.value;
          currentItem__title.classList.remove("d-none");
          currentItem__input.classList.add("d-none");
          clearAll(itemsList);
          render();
        }
      });
    }

    // Task Settings
    if (clickedBtn.classList.contains("settings")) {
      let priority_input = document.querySelector(
        "#" + currentItemObj.priority
      );
      customModal.setAttribute("data-item", currentItem__index);
      customModal.classList.remove("d-none");
      todo_section.classList.add("blur");
      task__title.value = currentItemObj.title;
      task__date.value = currentItemObj.dueDate;
      task__description.value = currentItemObj.description;
      priority_input.checked = true;
    }
  }
});

// Save changes (task settings)
saveChangesButton.addEventListener("click", function (e) {
  e.preventDefault();
  let currentItem__index = customModal.getAttribute("data-item");
  let currentItem = current_project.tasks[currentItem__index];

  // check title
  if (
    task__title.value !== currentItem.title &&
    isUniqueTask(current_project, task__title.value)
  ) {
    currentItem.title = task__title.value;
  } else if (
    task__title.value !== currentItem.title &&
    !isUniqueTask(current_project, task__title.value)
  ) {
    alert("This task already exists within your project");
  }

  // check description
  if (task__description.value !== currentItem.description) {
    currentItem.description = task__description.value;
  }

  // check date
  if (task__date.value !== currentItem.dueDate) {
    currentItem.dueDate = task__date.value;
  }

  // check priority
  if (getCurrentTaskPriority() !== currentItem.priority) {
    currentItem.priority = getCurrentTaskPriority();
  }

  // close the modal and render the changes
  closeCustomModal();
  clearAll(itemsList);
  render();
});

// Close the modal
let closeModal = document.querySelector(".closeModal");
closeModal.addEventListener("click", closeCustomModal);
function closeCustomModal() {
  customModal.classList.add("d-none");
  todo_section.classList.remove("blur");
}

// Add project functionality
addProjectBtn.addEventListener("click", function () {
  let projectTitle = prompt("Enter your project title");
  if (projectTitle && isUniqueProject(projects, projectTitle)) {
    let newProject = createProject(projectTitle);
    pushProject(projects, newProject);
    clearAll(projects_list);
    renderAllProjects();
    pushToStorage();
  } else {
    alert("This project already exists!");
  }
});

// Get current priority
function getCurrentTaskPriority() {
  let currentPriority;
  for (let i = 0; i < task__priority.length; i++) {
    if (task__priority[i].checked) {
      currentPriority = task__priority[i].value;
      break;
    }
  }
  return currentPriority;
}

// Get current project
projects_list.addEventListener("click", function (e) {
  let clickedProject__wrapper = e.target.closest(".project__wrapper");
  let clickedProject__button =
    clickedProject__wrapper.querySelector(".project__btn");
  let clickedProject__span = e.target.closest(".deleteProject");

  // remove active class from other buttons
  document.querySelector(".active")
    ? document.querySelector(".active").classList.remove("active")
    : "";

  // add active class to clicked project
  clickedProject__wrapper.classList.add("active");

  let clickedProject__title = clickedProject__button.innerText;
  let clickedProject =
    projects[findProjectIndex(projects, clickedProject__title)];
  current_project = clickedProject;

  // delete project
  if (clickedProject__span) {
    let userResponse = confirm("Are you sure you want to delete this project?");
    if (userResponse) {
      let projectToDelete = findProjectIndex(projects, clickedProject__title);
      projects.splice(projectToDelete, 1);
      clickedProject__wrapper.remove();
    }
  }

  clearAll(itemsList);
  render();
});

// add projects to Local Storage
function pushToStorage() {
  localStorage.setItem("projects", JSON.stringify(projects));
}
