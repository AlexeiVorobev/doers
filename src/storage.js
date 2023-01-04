import { Task, Project } from "./app";

const LOCAL_STORAGE_PROJECT_KEY = "doers.projects";
const SELECTED_PROJECT_ID_KEY = "doers.selectedProjectId";
// let projects = JSON.parse(localStorage.getItem(LOCAL_STORAGE_PROJECT_KEY)) || getDefaultProjects()
let projects = JSON.parse(localStorage.getItem(LOCAL_STORAGE_PROJECT_KEY))
    ? loadProjects()
    : getDefaultProjects();
let selectedProjectId = localStorage.getItem(SELECTED_PROJECT_ID_KEY) || "0";

function loadProjects() {
    const projects = JSON.parse(
        localStorage.getItem(LOCAL_STORAGE_PROJECT_KEY)
    );
    const output = [];
    projects.forEach((project) => {
        const newProject = new Project(project.name, project.color, project.id);
        project.tasks.forEach((task) => {
            newProject.tasks.push(
                new Task(
                    task.title,
                    task.description,
                    task.priority,
                    task.dueDate,
                    task.id,
                    task.completed
                )
            );
        });
        output.push(newProject);
    });
    return output;
}

export function save() {
    localStorage.setItem(LOCAL_STORAGE_PROJECT_KEY, JSON.stringify(projects));
    localStorage.setItem(SELECTED_PROJECT_ID_KEY, selectedProjectId);
}

export function getSelectedProjectId() {
    return selectedProjectId;
}

export function setSelectedProjectId(id) {
    selectedProjectId = id;
}

export function getProjects() {
    return projects;
}

export function setProject(name, color) {
    projects.push(new Project(name, color));
}

export function editProject(id = getSelectedProjectId(), name, color) {
    for (let i = 0; i < projects.length; i++) {
        const project = projects[i];
        if (project.id === id) {
            project.name = name;
            project.color = color;

            save();
            return;
        }
    }
}

export function deleteProject(id = getSelectedProjectId()) {
    for (let i = 0; i < projects.length; i++) {
        const project = projects[i];
        if (project.id === id) {
            projects.splice(i, 1);
            save();
            return;
        }
    }
}

export function getProject(id = getSelectedProjectId()) {
    for (let i = 0; i < projects.length; i++) {
        const project = projects[i];
        if (project.id === id) {
            return project;
        }
    }
}

function getDefaultProjects() {
    const projects = [];
    projects.push(new Project("Inbox", null, "0"));
    projects.push(new Project("Today", null, "1"));
    projects.push(new Project("This week", null, "2"));
    return projects;
}

export function setTask(title, description, priority, dueDate, id) {
    projects.forEach((project) => {
        if (project.id === getSelectedProjectId()) {
            project.tasks.push(new Task(title, description, priority, dueDate, id));
        }
    });
}

export function getTask(id) {
    const project = getProject()
    return project.tasks.find(task => task.id === id)
}


export function deleteTask(id) {
    for (let i = 0; i < projects.length; i++) {
        const project = projects[i];
        if (project.id === getSelectedProjectId()) {
            project.tasks = project.tasks.filter(task => task.id !== id)
            return
        }
    }
}

export function editTask(id, title, description, priority, dueDate, projectId) {
    deleteTask(id)
    setSelectedProjectId(projectId)
    setTask(title, description, priority, dueDate, id)
    }