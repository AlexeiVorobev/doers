const newProjectName = document.getElementById('new-project-name')
const newProjectColor = document.getElementById('new-project-color')

import { getInboxProject, getProjects, setProject } from "./app.js";
import { format } from "date-fns";

const header = document.getElementById('main-header');
const content = document.getElementById("content");

export function renderInbox() {
    header.textContent = "Inbox";
    renderTasks(getInboxProject());
    content.appendChild(createAddTaskBtn());
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
    const projects = getProjects();
    const projectsContainer = document.querySelector('.custom-projects');
    clearElement(projectsContainer)
    for (let i = 3; i < projects.length; i++) {
        const btn = document.createElement('button');
        btn.dataset.projectId = i;
        btn.classList.add('nav-button');

        const projectColor = document.createElement('span')
        projectColor.classList.add('project-color')
        projectColor.textContent = '●'
        projectColor.style.color = projects[i].color;
        
        btn.appendChild(projectColor)
        btn.insertAdjacentText("beforeend", projects[i].name)
        projectsContainer.appendChild(btn);
    }
}

function renderTasks(project) {
    const tasks = project.tasks;
    for (let i = 0; i < tasks.length; i++) {
        const task = createTask(tasks[i]);
        task.setAttribute("data", i);
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
    renderInbox();
    renderProjects();
}

function clearElement(element) {
    while(element.firstChild){
        element.removeChild(element.firstChild);
    }
}

const newProjectForm = (function () {
    const overlay = document.querySelector('.overlay')
    const form = document.getElementById('new-project-modal')
    const addProjectButton = document.querySelector('.add-project-btn')

    form.addEventListener('submit', e => {
        e.preventDefault()
        const projectName = newProjectName.value
        if(projectName == null || projectName == "") return;
        const projectColor = newProjectColor.value
    
        setProject(projectName, projectColor)
        renderProjects();
        close()
    })

    overlay.onclick = close;

    function close() {
        form.reset()
        overlay.classList.add('invisible')
        form.classList.add('invisible')
    }

    addProjectButton.onclick = function() {
        overlay.classList.remove('invisible')
        form.classList.remove('invisible')
    }
})();
