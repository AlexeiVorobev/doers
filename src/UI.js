import { getInboxProject, getProjects } from "./app.js";
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

function renderNavProjects() {
    const projects = getProjects();
    const projectsDiv = document.querySelector('.custom-projects');
    for (let i = 3; i < projects.length; i++) {
        const btn = document.createElement('button');
        btn.classList.add('nav-button');
        btn.textContent = projects[i].name;
        projectsDiv.appendChild(btn);
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
            <button><img src="images/unchecked${getPriorityColor()}.svg" alt=""></button>
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

    function getPriorityColor() {
        if (task.priority === undefined) return "";
        if (task.priority === "low") return "-blue";
        if (task.priority === "medium") return "-orange";
        if (task.priority === "high") return "-red";
    }
    return newTask;
}

export default function renderPage() {
    renderInbox();
    renderNavProjects();
}

