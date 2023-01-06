const CHECKED_SYMBOL = '✓' // ✓ ✔
const UNCHECKED_SYMBOL = '○'

const newProjectName = document.getElementById("new-project-name");
const newProjectColor = document.getElementById("new-project-color");
const customProjectsContainer = document.querySelector(".custom-projects");
const standartProjectsContainer = document.querySelector(".standart-projects");
const overlay = document.querySelector(".overlay");
const taskContainer = document.getElementById("task-container");
const addTaskBtn = document.getElementById("add-task-btn");

let selectedTaskId = null;
const editTaskTitle = document.getElementById('edit-task-title')
const editTaskDescription = document.getElementById('edit-task-description')
const editTaskDate = document.getElementById('edit-task-date')
const editTaskPriority = document.getElementById('edit-task-priority')
const editTaskProject = document.getElementById('edit-task-project')

import * as storage from "./storage.js";
import { format } from "date-fns";

const header = document.getElementById("project-title");

function renderProject(id = storage.getSelectedProjectId() || "0") {
    clearElement(taskContainer);
    const project = storage.getProject(id);

    // Hide edit-project button if standart project is rendered
    if (project.id in ["0", "1", "2"]) {
        if (project.id === "1") renderTodayTasks()
        editProjectBtn.classList.add("invisible");
    } else {
        editProjectBtn.classList.remove("invisible");
    }

    header.textContent = project.name;
    renderTasks();
}

function renderProjects() {
    const selectedProjectId = storage.getSelectedProjectId();
    unselectStandartProjects();
    if (selectedProjectId === "0") {
        const btn = document.getElementById("inbox-btn");
        btn.classList.add("active");
    } else if (selectedProjectId === "1") {
        const btn = document.getElementById("today-btn");
        btn.classList.add("active");
    } else if (selectedProjectId === "2") {
        const btn = document.getElementById("upcoming-btn");
        btn.classList.add("active");
    }

    const projects = storage.getProjects();
    clearElement(customProjectsContainer);
    for (let i = 3; i < projects.length; i++) {
        const project = projects[i];
        const btn = document.createElement("button");
        btn.dataset.projectId = project.id;
        btn.classList.add("nav-button");
        if (project.id === storage.getSelectedProjectId()) {
            btn.classList.add("active");
        }

        const projectColor = document.createElement("span");
        projectColor.classList.add("project-color");
        projectColor.textContent = "●";
        projectColor.style.color = projects[i].color;

        btn.appendChild(projectColor);
        btn.insertAdjacentText("beforeend", projects[i].name);
        customProjectsContainer.appendChild(btn);
    }
}

function renderTasks() {
    const project = storage.getProject();
    const tasks = project.tasks;
    for (let i = 0; i < tasks.length; i++) {
        const task = createTask(tasks[i]);
        task.dataset.taskId = tasks[i].id;
        if (tasks[i].isOverdue()) {
            task.classList.add("overdue");
        }
        if (tasks[i].completed) {
            task.classList.add("complete")
        }
        taskContainer.appendChild(task);
    }
}

function renderTodayTasks() {
    const tasks = storage.getTodayTasks()
    for (let i = 0; i < tasks.length; i++) {
        const task = createTask(tasks[i]);
        task.dataset.taskId = tasks[i].id;
        if (tasks[i].isOverdue()) {
            task.classList.add("overdue");
        }
        if (tasks[i].completed) {
            task.classList.add("complete")
        }
        taskContainer.appendChild(task);
    }
}

function formatDate(dateString) {
    if (dateString === undefined) return;
    const date = new Date(dateString);
    return format(date, "MMM do");
}

function createTask(task) {
    const newTask = document.createElement("div");
    newTask.classList.add("task");
    const date = task.dueDate === "" ? "" : formatDate(task.dueDate);

    newTask.innerHTML = `
    <div class="left">
            <button class="check-button ${task.priority}">${(task.completed) ? CHECKED_SYMBOL : UNCHECKED_SYMBOL}</button>
            <span class="title">${task.title}</span>
        </div>
        <div class="right">
            <span class="date">${date}</span>
            <button class="edit-task-btn"><img src="images/edit.svg" alt=""></button>
            <button class="delete-task-btn"><img src="images/delete.svg" alt=""></button>
        </div>
        <div class="description">
            ${task.description}
        </div>
    `;
    return newTask;
}

export default function renderPage() {
    renderProjects();
    renderProject();
}

function unselectStandartProjects() {
    const buttons = document.querySelectorAll(".standart-projects button");
    buttons.forEach((button) => {
        button.classList.remove("active");
    });
}

function clearElement(element) {
    while (element.firstChild) {
        element.removeChild(element.firstChild);
    }
}

const newProjectModal = document.getElementById("new-project-modal");
const editProjectModal = document.getElementById("edit-project-modal");
const addTaskModal = document.getElementById("add-task-modal");
const editTaskModal = document.getElementById("edit-task-modal");
const addProjectBtn = document.getElementById("add-project-btn");
const editProjectBtn = document.getElementById("edit-project-btn");
const deleteProjectBtn = document.getElementById("delete-project-btn");
const saveProjectBtn = document.getElementById("save-project-btn");
const editProjectName = document.getElementById("edit-project-name");
const editProjectColor = document.getElementById("edit-project-color");

newProjectModal.addEventListener("submit", (e) => {
    e.preventDefault();
    const projectName = newProjectName.value;
    if (projectName == null || projectName == "") return;
    const projectColor = newProjectColor.value;

    storage.setProject(projectName, projectColor);
    storage.save();
    renderProjects();
    closeModals();
});

editProjectModal.addEventListener("submit", (e) => {
    e.preventDefault();
});

editTaskModal.addEventListener("submit", (e) => {
    e.preventDefault();

	storage.editTask(selectedTaskId, editTaskTitle.value, editTaskDescription.value, editTaskPriority.value, editTaskDate.value, editTaskProject.value)
	closeModals()
	storage.save()
	renderPage()
});

overlay.onclick = closeModals;

function closeModals() {
    newProjectModal.reset();
    addTaskModal.reset();
    overlay.classList.add("invisible");
    newProjectModal.classList.add("invisible");
    editProjectModal.classList.add("invisible");
    addTaskModal.classList.add("invisible");
    addTaskModal.classList.add("invisible");
	editTaskModal.classList.add('invisible')
}

addProjectBtn.onclick = function () {
    overlay.classList.remove("invisible");
    newProjectModal.classList.remove("invisible");
};

editProjectBtn.onclick = function () {
    const project = storage.getProject(storage.getSelectedProjectId());
    overlay.classList.remove("invisible");
    editProjectModal.classList.remove("invisible");
    editProjectName.value = project.name;

    editProjectColor.value = project.color;
};

deleteProjectBtn.onclick = function () {
    storage.deleteProject();
    closeModals();
    storage.setSelectedProjectId("0");
    renderPage();
};

saveProjectBtn.onclick = function () {
    storage.editProject(
        storage.getSelectedProjectId(),
        editProjectName.value,
        editProjectColor.value
    );
    closeModals();
    renderPage();
};

addTaskBtn.onclick = function () {
    overlay.classList.remove("invisible");
    addTaskModal.classList.remove("invisible");

    renderProjectDropdown();
};

addTaskModal.addEventListener("submit", (e) => {
    e.preventDefault();
    const title = document.getElementById("new-task-name").value;
    const description = document.getElementById("new-task-description").value;
    const priority = document.getElementById("new-task-priority").value;
    const dueDate = document.getElementById("new-task-date").value;
    storage.setTask(title, description, priority, dueDate);
    storage.save();
    closeModals();
    renderPage();
});

taskContainer.addEventListener('click', e => {
	if (e.target.classList.contains('delete-task-btn')) {
		const id = e.target.parentNode.parentNode.dataset.taskId
		storage.deleteTask(id)
		storage.save()
		renderPage()
	} else if (e.target.classList.contains('edit-task-btn')) {
		selectedTaskId = e.target.parentNode.parentNode.dataset.taskId
		const task = storage.getTask(selectedTaskId)
		overlay.classList.remove("invisible")
		editTaskModal.classList.remove("invisible")
		editTaskTitle.value = task.title
		editTaskDate.value = task.dueDate
		editTaskDescription.value = task.description
		editTaskPriority.value = task.priority
		renderEditProjectDropdown()
	} else if (e.target.classList.contains('check-button')) {
		selectedTaskId = e.target.parentNode.parentNode.dataset.taskId
		storage.toggleTaskComplete(selectedTaskId)
        storage.save()
        renderPage()
	}
})


function renderProjectDropdown() {
    const newTaskProject = document.getElementById("new-task-project");
    clearElement(newTaskProject);

    const inboxOption = document.createElement("option");
    inboxOption.value = "0";
    inboxOption.textContent = "Inbox";
    newTaskProject.appendChild(inboxOption);

    const projects = storage.getProjects();
    for (let i = 3; i < projects.length; i++) {
        const project = projects[i];
        const option = document.createElement("option");
        option.value = project.id;
        option.textContent = project.name;

        if (project.id === storage.getSelectedProjectId()) {
            option.setAttribute("selected", "selected");
        }
        newTaskProject.appendChild(option);
	
    }
}

function renderEditProjectDropdown() {
	const editTaskProject = document.getElementById("edit-task-project")
	clearElement(editTaskProject)

	const inboxOption = document.createElement("option");
    inboxOption.value = "0";
    inboxOption.textContent = "Inbox";
    editTaskProject.appendChild(inboxOption);

    const projects = storage.getProjects();
    for (let i = 3; i < projects.length; i++) {
        const project = projects[i];
        const option = document.createElement("option");
        option.value = project.id;
        option.textContent = project.name;

        if (project.id === storage.getSelectedProjectId()) {
            option.setAttribute("selected", "selected");
        }
        editTaskProject.appendChild(option);
	
    }
}

customProjectsContainer.addEventListener("click", (e) => {
    if (e.target.tagName.toLowerCase() === "button") {
        storage.setSelectedProjectId(e.target.dataset.projectId);
        storage.save();
        renderPage();
    }
});

standartProjectsContainer.addEventListener("click", (e) => {
    if (e.target.tagName.toLowerCase() === "button") {
        const id = e.target.dataset.projectId;
        storage.setSelectedProjectId(id);
        storage.save();
        renderPage();
    }
});
