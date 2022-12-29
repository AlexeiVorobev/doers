import { Task } from "./app";
import { Project } from "./app";

const LOCAL_STORAGE_PROJECT_KEY = 'doers.projects'
const SELECTED_PROJECT_ID_KEY = 'doers.selectedProjectId'
let projects = JSON.parse(localStorage.getItem(LOCAL_STORAGE_PROJECT_KEY)) || getDefaultProjects()
let selectedProjectId = localStorage.getItem(SELECTED_PROJECT_ID_KEY) 

export function save() {
    localStorage.setItem(LOCAL_STORAGE_PROJECT_KEY, JSON.stringify(projects))
    localStorage.setItem(SELECTED_PROJECT_ID_KEY, selectedProjectId)
}

export function getSelectedProjectId() {
    return selectedProjectId
}

export function setSelectedProjectId(id) {
    selectedProjectId = id
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

export function getProject(id) {
    for (let i = 0; i < projects.length; i++) {
        const project = projects[i]
        if (project.id === id) {
            return project;
        }
    }
    };

function getDefaultProjects() {
    const projects = []
    projects.push(new Project("Inbox", null, "0"));
    projects.push(new Project("Today", null, "1"));
    projects.push(new Project("Upcoming", null, "2"));
    return projects
}