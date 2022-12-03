export default class Task {
    constructor(title, description = "", priority) {
        this.title = title;
        this.description = description;
        this.priority = priority;
        this.completed = false;
    }

    
}
