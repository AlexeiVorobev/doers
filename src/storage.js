import { compareAsc, format } from "date-fns";

class Task {
    constructor(title, description = "", priority, dueDate, id = Date.now().toString(), completed = false) {
        this.title = title;
        this.description = description;
        this.priority = priority;
        this.dueDate = dueDate;
        this.completed = completed;
        this.id = id;
    }

    isOverdue() {
        const currentDate = new Date().toISOString().slice(0, 10);
        if (compareAsc(new Date(this.dueDate), new Date(currentDate)) == -1) {
            return true;
        } else return false;
    }
}

class Project {
    constructor(name, color = "#ffffff", id = Date.now().toString()) {
        this.name = name;
        this.color = color;
        this.tasks = [];
        this.id = id;
    }

    addTask(task) {
        this.tasks.push(task)
    }
}

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

export function setTask(title, description, priority, dueDate, projectId, taskId) {
    projects.forEach((project) => {
        if (project.id === projectId) {
            project.tasks.push(
                new Task(title, description, priority, dueDate, taskId)
            );
        }
    });
}

export function getTask(id) {
    for (let i = 0; i < projects.length; i++) {
        const project = projects[i]
        for (let j = 0; j < project.tasks.length; j++) {
            if (project.tasks[j].id === id) {
                return project.tasks[j]
            }
        }
    }
    return project.tasks.find((task) => task.id === id);
}

export function getTaskProject(taskId) {
    for (let i = 0; i < projects.length; i++) {
        const project = projects[i]
        for (let j = 0; j < project.tasks.length; j++) {
            if (project.tasks[j].id === taskId) {
                return project.id
            }
        }
    }
}

export function getTodayTasks() {
    const tasks = []
    const today = format(new Date(), 'yyyy-MM-dd')
    projects.forEach(project => {
        project.tasks.forEach(task => {
            if (task.dueDate === today) {
                tasks.push(task)
            }
        })
    })
    return tasks
}

export function deleteTask(id) {
    for (let i = 0; i < projects.length; i++) {
        const project = projects[i];
        project.tasks = project.tasks.filter((task) => task.id !== id);
    }
}

export function editTask(taskId, title, description, priority, dueDate, projectId) {
    deleteTask(taskId);
    setSelectedProjectId(projectId);
    setTask(title, description, priority, dueDate, projectId, taskId);
}

export function toggleTaskComplete(taskId) {
    for (let i = 0; i < projects.length; i++) {
        const project = projects[i]
        for (let j = 0; j < project.tasks.length; j++) {
            const task = project.tasks[j]
            if (task.id === taskId) {
                task.completed = (task.completed) ? false : true;
            }
        }
    }
}

export function getTodayDatestring() {
    return format(new Date(), "yyyy-MM-dd")
}
