const CHECKED_SYMBOL = `<span class="material-symbols-outlined">
check_circle
</span>`;
const UNCHECKED_SYMBOL = `<span class="material-symbols-outlined">
circle
</span>`;
let currentTask = null;
let selectedTaskProject = null;

const navbar = document.querySelector('nav');
const newProjectName = document.getElementById("new-project-name");
const newProjectColor = document.getElementById("new-project-color");
const customProjects = document.querySelector(".custom-projects");
const standartProjectsContainer = document.querySelector(".standart-projects");

const overlay = document.querySelector(".overlay");
const sidebarOverlay = document.querySelector('.sidebar-overlay');

const taskContainer = document.getElementById("task-container");
const addTaskBtn = document.getElementById("add-task-btn");
const newTaskDate = document.getElementById("new-task-date");

const newProjectModal = document.getElementById("new-project-modal");
const newTaskDescription = document.getElementById("new-task-description")
const newTaskTitle = document.getElementById("new-task-title")
const editProjectModal = document.getElementById("edit-project-modal");
const addTaskModal = document.getElementById("add-task-modal");
const editTaskModal = document.getElementById("edit-task-modal");
const addProjectBtn = document.getElementById("add-project-btn");
const deleteProjectBtn = document.getElementById("delete-project-btn");
const saveProjectBtn = document.getElementById("save-project-btn");
const editProjectName = document.getElementById("edit-project-name");
const editProjectColor = document.getElementById("edit-project-color");

const changePriorityBtn = document.getElementById("change-priority-btn");
const priorityDropdown = document.getElementById("priority-dropdown");
const changeTaskProjectBtn = document.getElementById("change-task-project-btn");
const projectDropdown = document.getElementById("project-dropdown");

import * as storage from "./storage.js";
import { format, getWeek } from "date-fns";

const header = document.getElementById("project-title");
const toggleMenuBtn = document.querySelector('.toggle-menu-btn');

function renderProject(id = storage.getSelectedProjectId() || "0") {
    clearElement(taskContainer);
    const project = storage.getProject(id);

    if (project.id in ["0", "1", "2"]) {
        if (project.id === "1") {
            renderTodayTasks();
        } else if (project.id === "2") {
            renderThisWeekTasks();
        }
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
    clearElement(customProjects);
    for (let i = 3; i < projects.length; i++) {
        const project = projects[i];
        const btn = document.createElement("button");
        btn.dataset.projectId = project.id;
        btn.classList.add("nav-button");
        if (project.id === storage.getSelectedProjectId()) {
            btn.classList.add("active");
        }

        btn.innerHTML = `<div class="left"><span class="project-color" style="color: ${project.color};">●</span>${project.name}</div> <div class="right"><button data-project-id=${project.id} class="edit-project-btn hidden"><span class="material-symbols-outlined">
        edit
        </span></button></div>`;

        customProjects.appendChild(btn);
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
            task.classList.add("complete");
        }
        taskContainer.appendChild(task);
    }
}

function renderTodayTasks() {
    const projects = storage.getProjects();

    for (let i = 0; i < projects.length; i++) {
        const project = projects[i];
        for (let i = 0; i < project.tasks.length; i++) {
            const task = project.tasks[i];
            if (task.dueDate === storage.getTodayDatestring()) {
                const taskDiv = createTask(task);
                taskDiv.dataset.taskId = task.id;
                taskDiv.dataset.taskProjectId = project.id;
                if (task.isOverdue()) {
                    taskDiv.classList.add("overdue");
                }
                if (task.completed) {
                    taskDiv.classList.add("complete");
                }
                taskContainer.appendChild(taskDiv);
            }
        }
    }
}

function renderThisWeekTasks() {
    const projects = storage.getProjects();

    for (let i = 0; i < projects.length; i++) {
        const project = projects[i];
        for (let i = 0; i < project.tasks.length; i++) {
            const task = project.tasks[i];
            if (getWeek(new Date()) === getWeek(new Date(task.dueDate))) {
                const taskDiv = createTask(task);
                taskDiv.dataset.taskId = task.id;
                taskDiv.dataset.taskProjectId = project.id;
                if (task.isOverdue()) {
                    taskDiv.classList.add("overdue");
                }
                if (task.completed) {
                    taskDiv.classList.add("complete");
                }
                taskContainer.appendChild(taskDiv);
            }
        }
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
            <button class="check-button ${task.priority}">${
        task.completed ? CHECKED_SYMBOL : UNCHECKED_SYMBOL
    }</button>
            <span class="title">${task.title}</span>
        </div>
        <div class="right">
            <span class="date">${date}</span>
            <button class="edit-task-btn icon-btn"><span class="material-symbols-outlined">edit</span></button>
            <button class="delete-task-btn icon-btn"><span class="material-symbols-outlined">delete</span></button>
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

newProjectModal.addEventListener("submit", (e) => {
    e.preventDefault();
    const projectName = newProjectName.value;
    const projectColor = newProjectColor.value;
    storage.setProject(projectName, projectColor);
    storage.save();
    renderProjects();
    closeModals();
});

editProjectModal.addEventListener("submit", (e) => {
    e.preventDefault();
});

overlay.onclick = closeModals;

function closeModals() {
    newProjectModal.reset();
    addTaskModal.reset();
    overlay.classList.add("hidden");
    newProjectModal.classList.add("hidden");
    editProjectModal.classList.add("hidden");
    addTaskModal.classList.add("hidden");
    addTaskModal.classList.add("hidden");
    editTaskModal.classList.add("hidden");
}

addProjectBtn.onclick = function () {
    overlay.classList.remove("hidden");
    newProjectModal.classList.remove("hidden");
    newProjectName.focus()
};

deleteProjectBtn.onclick = function () {
    if (confirm("Are you sure you want to delete the project? All todos inside a project will be gone forever.")) {
        storage.deleteProject();
        closeModals();
        storage.setSelectedProjectId("0");
        renderPage();
    }
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
    currentTask = null
    selectedTaskProject = storage.getSelectedProjectId()
    overlay.classList.remove("hidden");
    addTaskModal.classList.remove("hidden");
    newTaskDate.value = storage.getTodayDatestring();
    newTaskTitle.focus()
    updatePriorityDropdown("null")
    renderProjectDropdown();
};

addTaskModal.addEventListener("submit", (e) => {
    e.preventDefault();
    const title = document.getElementById("new-task-title").value;
    const description = document.getElementById("new-task-description").value;
    const priority = changePriorityBtn.value;
    const dueDate = newTaskDate.value;
    const projectId = changeTaskProjectBtn.value
    if (currentTask === null) {
        storage.setTask(title, description, priority, dueDate, projectId);
        storage.save();
        closeModals();
        renderPage();
    } else {
        storage.editTask(currentTask, title, description, priority, dueDate, projectId)
        storage.save();
        closeModals();
        renderPage()
    }
});

taskContainer.addEventListener("click", (e) => {
    if (e.target.classList.contains("delete-task-btn")) {
        const id = e.target.parentNode.parentNode.dataset.taskId;
        storage.deleteTask(id);
        storage.save();
        renderPage();
    } else if (e.target.classList.contains("edit-task-btn")) {
        currentTask = e.target.parentNode.parentNode.dataset.taskId;
        selectedTaskProject =
            storage.getTaskProject(currentTask)
        const task = storage.getTask(currentTask);
        overlay.classList.remove("hidden");
        addTaskModal.classList.remove("hidden");
        newTaskTitle.value = task.title;
        newTaskDate.value = task.dueDate;
        newTaskDescription.value = task.description;
        newTaskTitle.focus()
        updatePriorityDropdown(task.priority)
        renderProjectDropdown()
    } else if (e.target.classList.contains("check-button")) {
        currentTask = e.target.parentNode.parentNode.dataset.taskId;
        storage.toggleTaskComplete(currentTask);
        storage.save();
        renderPage();
    }
});

function renderProjectDropdown() {
    clearElement(projectDropdown);
    const currentProject = storage.getProject(selectedTaskProject)

    const inboxOption = document.createElement("button");
    inboxOption.value = "0";
    inboxOption.type = "button";
    inboxOption.innerHTML = `<span class="material-symbols-outlined" style="font-size: 20px">
    inbox
    </span>Inbox</button>`;
    projectDropdown.appendChild(inboxOption);

    const projects = storage.getProjects();
    for (let i = 3; i < projects.length; i++) {
        const project = projects[i];
        const option = document.createElement("button");
        option.value = project.id;
        option.type = "button";
        option.innerHTML = `<span class="material-symbols-outlined color-icon" style="color: ${project.color};">
        circle
        </span>${project.name}</button>`;
        projectDropdown.appendChild(option);
    }

    changeTaskProjectBtn.value = selectedTaskProject
    if (selectedTaskProject in ['0', '1', '2']) {
        changeTaskProjectBtn.innerHTML = `<span class="material-symbols-outlined">inbox</span>Inbox`
        changeTaskProjectBtn.value = '0'
    } else {
        changeTaskProjectBtn.innerHTML = `<span class="material-symbols-outlined color-icon" style="color: ${currentProject.color}">circle</span>${currentProject.name}`
        changeTaskProjectBtn.value = selectedTaskProject
    }
}

customProjects.addEventListener("click", (e) => {
    if (e.target.tagName.toLowerCase() === "button") {
        storage.setSelectedProjectId(e.target.dataset.projectId);
        storage.save();
        renderPage();
    }
    if (e.target.matches(".edit-project-btn")) {
        const project = storage.getProject(storage.getSelectedProjectId());
        overlay.classList.remove("hidden");
        editProjectModal.classList.remove("hidden");
        editProjectName.value = project.name;
        editProjectName.focus()
        editProjectColor.value = project.color;
    }
});

customProjects.addEventListener("mouseover", (e) => {
    if (e.target.tagName.toLowerCase() === "button") {
        document
            .querySelector(
                `button[data-project-id="${e.target.dataset.projectId}"] .edit-project-btn`
            )
            .classList.remove("hidden");
    }
});

customProjects.addEventListener("mouseout", (e) => {
    if (e.target.tagName.toLowerCase() === "button") {
        document
            .querySelector(
                `button[data-project-id="${e.target.dataset.projectId}"] .edit-project-btn`
            )
            .classList.add("hidden");
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

changePriorityBtn.onclick = function () {
    priorityDropdown.classList.toggle("hidden");
};

changeTaskProjectBtn.onclick = function () {
    projectDropdown.classList.toggle("hidden");
};

projectDropdown.addEventListener("click", e => {
    if (e.target.tagName.toLowerCase() === "button") {
        const newProjectId = e.target.value
        const project = storage.getProject(newProjectId)
        changeTaskProjectBtn.value = newProjectId
        if (newProjectId === '0') {
            changeTaskProjectBtn.innerHTML = `<span class="material-symbols-outlined">inbox</span>Inbox`
        } else {
            changeTaskProjectBtn.innerHTML = `<span class="material-symbols-outlined color-icon" style="color: ${project.color}">circle</span>${project.name}`
        }
    }
})

priorityDropdown.addEventListener("click", (e) => {
    if (e.target.tagName.toLowerCase() === "button") {
        updatePriorityDropdown(e.target.value)
    }
});

function updatePriorityDropdown(newPriority) {
    const priorityIcon = document.querySelector(
            "#change-priority-btn span"
        );
    changePriorityBtn.value = newPriority;
        priorityIcon.classList.remove(
            "priority-high",
            "priority-low",
            "priority-medium",
            "priority-null"
        );
        priorityIcon.classList.add("priority-" + newPriority);
}

window.onclick = function (event) {
    if (!event.target.matches(".dropbtn")) {
        var dropdowns = document.getElementsByClassName("dropdown-content");
        var i;
        for (i = 0; i < dropdowns.length; i++) {
            var openDropdown = dropdowns[i];
            openDropdown.classList.add("hidden");
        }
    }
};

addTaskBtn.addEventListener("mouseover", () => {
    document.querySelector("#add-task-btn span").textContent = "add_circle";
});

addTaskBtn.addEventListener("mouseout", () => {
    document.querySelector("#add-task-btn span").textContent = "add";
});

document.getElementById('save-task-btn').addEventListener('click', () => {
    if (newTaskTitle.validity.valueMissing) {
        newTaskTitle.setCustomValidity("Fill in the title name.");
    } else {
        newTaskTitle.setCustomValidity("");
    }
})

document.getElementById("new-task-cancel-btn").onclick = closeModals;
document.getElementById("new-project-cancel-btn").onclick = closeModals
document.getElementById("edit-task-cancel-btn").onclick = closeModals
sidebarOverlay.onclick = function() {
    navbar.classList.remove('active');
    sidebarOverlay.classList.add('hidden');
}

toggleMenuBtn.onclick = function() {
    if (navbar.classList.contains('active')) {
        navbar.classList.remove('active') // Hide navbar
        sidebarOverlay.classList.add('hidden');
    } else {
        closeModals();
        navbar.classList.add('active'); // Show navbar
        sidebarOverlay.classList.remove('hidden')
    }
}