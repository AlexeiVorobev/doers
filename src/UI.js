export function renderInbox() {
    const header = document.createElement('h1');
    header.textContent = "Inbox";

    const content = document.getElementById("content");
    content.appendChild(header);
    for (task in currentProject.tasks) {
        content.appendChild(createTask(task));
    }
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

function createTask(task) {
    const newTask = document.createElement('div');
    newTask.classList.add('task');
    const markup = `
    <h1>Hello there!</h1>
    `
    newTask.innerHTML = markup;
    
    return newTask;
}

export default function renderPage() {
    renderInbox();
}