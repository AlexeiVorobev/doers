const newProjectName = document.getElementById('new-project-name')
const newProjectColor = document.getElementById('new-project-color')
const customProjectsContainer = document.querySelector('.custom-projects')
const standartProjectsContainer = document.querySelector('.standart-projects')
const overlay = document.querySelector('.overlay')
const editProjectBtn = document.getElementById('edit-project-btn')
const projectTitle = document.getElementById('project-title')
const taskContainer = document.getElementById('task-container')

import * as storage from "./storage.js";
import { format } from "date-fns";

const header = document.getElementById('project-title');
const content = document.getElementById("content");

export function renderInbox() {
    header.textContent = "Inbox";
    renderTasks(storage.getInboxProject());
    content.appendChild(createAddTaskBtn());
}

function renderProject(id = storage.getSelectedProjectId()) {
    const project = storage.getProject(id)

    // Hide edit-project button if standart project is rendered
    if (project.id in ['0', '1', '2']) {
        editProjectBtn.classList.add('invisible')
    } else {
        editProjectBtn.classList.remove('invisible')
    }

    header.textContent = project.name
}

function createAddTaskBtn() {
    const btn = document.createElement('button');
    btn.classList.add("add-task-btn");

    const icon = document.createElement('img');
    icon.src = "images/add.svg";

    const text = document.createElement('div');
    text.textContent = "Add task";

    btn.appendChild(icon);
    btn.appendChild(text);

    return btn;
}

function renderProjects() {
    const selectedProjectId = storage.getSelectedProjectId();
    unselectStandartProjects()
    if (selectedProjectId === "0") {
        const btn = document.getElementById('inbox-btn')
        btn.classList.add('active')
    } else if (selectedProjectId === "1") {
        const btn = document.getElementById('today-btn')
        btn.classList.add('active')
    } else if (selectedProjectId === "2") {
        const btn = document.getElementById('upcoming-btn')
        btn.classList.add('active')
    } 

    const projects = storage.getProjects();
    clearElement(customProjectsContainer)
    for (let i = 3; i < projects.length; i++) {
        const project = projects[i]
        const btn = document.createElement('button');
        btn.dataset.projectId = project.id;
        btn.classList.add('nav-button');
        if (project.id === storage.getSelectedProjectId()) {
            btn.classList.add('active')
        }

        const projectColor = document.createElement('span')
        projectColor.classList.add('project-color')
        projectColor.textContent = '●'
        projectColor.style.color = projects[i].color;

        btn.appendChild(projectColor)
        btn.insertAdjacentText("beforeend", projects[i].name)
        customProjectsContainer.appendChild(btn);
    }
}

function renderTasks(project) {
    const tasks = project.tasks;
    for (let i = 0; i < tasks.length; i++) {
        const task = createTask(tasks[i]);
        task.dataset.taskId = tasks[i].id;
        if (tasks[i].isOverdue()) {
            task.classList.add('overdue');
        }
        content.appendChild(task);
    }
}

function formatDate(dateString) {
    const date = new Date(dateString);

    return format(date, "MMM do");
}

function createTask(task) {
    const newTask = document.createElement('div');
    newTask.classList.add('task');
    const date = (task.dueDate === undefined) ? "" : formatDate(task.dueDate);

    newTask.innerHTML = `
    <div class="left">
            <button class="check-button ${task.priority}">○</button>
            <span class="title">${task.title}</span>
        </div>
        <div class="right">
            <span class="date">${date}</span>
            <button><img src="images/edit.svg" alt=""></button>
            <button><img src="images/delete.svg" alt=""></button>
        </div>
        <div class="description">
            ${task.description}
        </div>
    `
    return newTask;
}

export default function renderPage() {
    renderProjects()
    renderProject()
}

function unselectStandartProjects() {
    const buttons = document.querySelectorAll('.standart-projects button')
    buttons.forEach(button => {
        button.classList.remove('active')
    })
}

function clearElement(element) {
    while (element.firstChild) {
        element.removeChild(element.firstChild);
    }
}

const modals = (function () {
    const newProjectModal = document.getElementById('new-project-modal')
    const editProjectModal = document.getElementById('edit-project-modal')
    const addProjectBtn = document.getElementById('add-project-btn')
    const editProjectBtn = document.getElementById('edit-project-btn')
    const deleteProjectBtn = document.getElementById('delete-project-btn')
    const saveProjectBtn = document.getElementById('save-project-btn')
    const editProjectName = document.getElementById('edit-project-name')
    const editProjectColor = document.getElementById('edit-project-color')

    newProjectModal.addEventListener('submit', e => {
        e.preventDefault()
        const projectName = newProjectName.value
        if (projectName == null || projectName == "") return;
        const projectColor = newProjectColor.value

        storage.setProject(projectName, projectColor)
        storage.save()
        renderProjects();
        close()
    })

    editProjectModal.addEventListener('submit', e => {
        e.preventDefault()
    })

    overlay.onclick = close;

    function close() {
        newProjectModal.reset()
        overlay.classList.add('invisible')
        newProjectModal.classList.add('invisible')
        editProjectModal.classList.add('invisible')
    }

    addProjectBtn.onclick = function () {
        overlay.classList.remove('invisible')
        newProjectModal.classList.remove('invisible')
    }

    editProjectBtn.onclick = function () {
        const project = storage.getProject(storage.getSelectedProjectId())
        overlay.classList.remove('invisible')
        editProjectModal.classList.remove('invisible')
        editProjectName.value = project.name

        editProjectColor.value = project.color
    }

    deleteProjectBtn.onclick = function () {
        storage.deleteProject();
        close()
        storage.setSelectedProjectId('0')
        renderPage()
    }

    saveProjectBtn.onclick = function () {
        storage.editProject(storage.getSelectedProjectId(), editProjectName.value, editProjectColor.value)
        close()
        renderPage()
    }

})();


customProjectsContainer.addEventListener('click', e => {
    if (e.target.tagName.toLowerCase() === 'button') {
        storage.setSelectedProjectId(e.target.dataset.projectId)
        storage.save()
        renderPage()
    }
})

standartProjectsContainer.addEventListener('click', e => {
    if (e.target.tagName.toLowerCase() === 'button') {
        const id = e.target.dataset.projectId
        storage.setSelectedProjectId(id)
        storage.save()
        renderPage()
    }
})
