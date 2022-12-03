const myProjects = [];
myProjects.push(new Project("inbox"));

class Project {
    constructor(name, color = "#ffffff") {
        this.name = name;
        this.color = color;
        this.tasks = [];
    }
}

export function getProjects() {
    return myProjects;
}

export function setProject(name, color) {
    myProjects.push(new Project(name, color));
}