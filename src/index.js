class Task {
    constructor(title, description = "", priority) {
        this.title = title;
        this.description = description;
        this.priority = priority;
        this.completed = false;
        this.dueDate = undefined;
    }
}

class Project {
    constructor(name, color = "#ffffff") {
        this.name = name;
        this.color = color;
        this.tasks = [];
    }
}

