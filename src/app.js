import { compareAsc } from "date-fns";

export class Task {
    constructor(title, description = "", priority, dueDate) {
        this.title = title;
        this.description = description;
        this.priority = priority;
        this.dueDate = dueDate;
        this.completed = false;
        this.id = newId++;
    }

    isOverdue() {
        const currentDate = new Date().toISOString().slice(0, 10);
        if (compareAsc(new Date(this.dueDate), new Date(currentDate)) == -1) {
            return true;
        } else return false;
    }
}

export class Project {
    constructor(name, color = "#ffffff") {
        this.name = name;
        this.color = color;
        this.tasks = [];
        this.id = Date.now().toString()
    }

    addTask(title, description, priority, dueDate) {
        this.tasks.push(new Task(title, description, priority, dueDate));
    }

    getTasks() {
        return this.tasks;
    }
}

export function getProjectByName(name) {
    myProjects.forEach(project => {
        if (project.name === name) {
            return project;
        }
    })
}
