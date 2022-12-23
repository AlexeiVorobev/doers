import { Task } from "./app";
import { Project } from "./app";

const LOCAL_STORAGE_PROJECT_KEY = 'doers.projects'
let projects = JSON.parse(localStorage.getItem(LOCAL_STORAGE_PROJECT_KEY)) || getDefaultProjects()
save();

export function save() {
    localStorage.setItem(LOCAL_STORAGE_PROJECT_KEY, JSON.stringify(projects))
}

export function getProjects() {
    return projects
}

export function getInboxProject() {
    return projects[0]
}

export function setProject(name, color) {
    projects.push(new Project(name, color));
}

function getDefaultProjects() {
    const projects = []
    projects.push(new Project("inbox"));
    projects.push(new Project("today"));
    projects.push(new Project("Upcoming"));
    return projects
}