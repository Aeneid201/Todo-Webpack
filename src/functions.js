export {
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
};
// Current date
function getCurrentDate() {
  let today = new Date();
  var dd = String(today.getDate()).padStart(2, "0");
  var mm = String(today.getMonth() + 1).padStart(2, "0");
  var yyyy = today.getFullYear();

  today = yyyy + "-" + mm + "-" + dd;
  return today;
}

// Clear All Tasks
function clearAll(list) {
  return (list.innerHTML = "");
}

// Clear input field
function clearField(input) {
  return (input.value = "");
}

// Create new task
function createTask(
  title,
  description = "",
  dueDate = getCurrentDate(),
  priority = "low"
) {
  return { title, description, dueDate, priority };
}

// Push task
function pushTask(project, task) {
  return project["tasks"].push(task);
}

// Create new project
function createProject(title, tasks = []) {
  return { title, tasks };
}

// Push project
function pushProject(arr, project) {
  return arr.push(project);
}

// Render task
function renderTask(list, task) {
  let html = `<div class="item">
    <div>
    <p class="item__title">${task.title}</p>
    <input class="item__input d-none" autocomplete="off" value="${task.title}">
    </div>

    <div class="item__date">
    ${task.dueDate}
    </div>
    <div class="item__priority badge ${task.priority}">
    ${task.priority}
    </div>
    <div class="item__buttons">
      <button class="edit"><img src="/images/pen.png"></button>
      <button class="delete"><img src="/images/trash.png"></button>
      <button class="settings"><img src="/images/settings.png"></button>
    </div>
  </div>`;
  return list.insertAdjacentHTML("beforeend", html);
}

function renderProject(list, project) {
  let html = `<button class="project__btn">${project.title}</button>`;
  return list.insertAdjacentHTML("beforeend", html);
}

// Find index of task
function findCurrentIndex(project, title) {
  let currentIndex = project.tasks.findIndex((task) => task.title == title);
  return currentIndex;
}

// Check if edited task title already exists

// Get current project
function getCurrentProject(buttons_arr, project) {
  let current_project__title;
  buttons_arr.forEach((btn) => {
    if (btn.classList.contains("active")) {
      current_project__title = btn.innerText;
    }
  });
  return project;
}
