import { compareAsc } from "date-fns";

export class Task {
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

export class Project {
    constructor(name, color = "#ffffff", id = Date.now().toString()) {
        this.name = name;
        this.color = color;
        this.tasks = [];
        this.id = id;
    }

    addTask(task) {
        this.tasks.push(task)
    }

    getStuff() {
        console.log('We got stuff')
    }
}
