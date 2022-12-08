import { compareAsc } from "date-fns";



class Task {
    constructor(title, description = "", priority, dueDate) {
        this.title = title;
        this.description = description;
        this.priority = priority;
        this.dueDate = dueDate;
        this.completed = false;
    }

    isOverdue() {
        const currentDate = new Date().toISOString().slice(0, 10);
        if (compareAsc(new Date(this.dueDate), new Date(currentDate)) == -1) {
            return true;
        } else return false;
    }
}


class Project {
    constructor(name, color = "#ffffff") {
        this.name = name;
        this.color = color;
        this.tasks = [];
    }

    addTask(title, description, priority, dueDate) {
        this.tasks.push(new Task(title, description, priority, dueDate));
    }

    getTasks() {
        return this.tasks;
    }
}

export function getProjects() {
    return myProjects;
}

export function getProjectByName(name) {
    myProjects.forEach(project => {
        if (project.name === name) {
            return project;
        }
    })
}

export function getInboxProject() {
    return myProjects[0];
}

export function setProject(name, color) {
    myProjects.push(new Project(name, color));
}

const myProjects = [];
myProjects.push(new Project("inbox"));
myProjects.push(new Project("today"));
myProjects.push(new Project("Upcoming"));

// Test projects
myProjects.push(new Project("Project 1", 'brown'));
myProjects.push(new Project("Project 2"));

// Test tasks
myProjects[0].addTask("Do stuff", "Grind hard on this one.", "high", "2022-12-02");
myProjects[0].addTask("Do other stuff", "Just takie it easy", "low", "2023-01-01");