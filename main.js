import { fetchTasks } from "./api.js";
import { Task, TaskManager } from "./taskManager.js";

const loadBtn = document.getElementById("loadTasksBtn");
const statusMessage = document.getElementById("statusMessage");
const taskList = document.getElementById("taskList");

const manager = new TaskManager();

loadBtn.addEventListener("click", async () => {
    statusMessage.textContent = "Loading tasks...";

    try {
        const rawTasks = await fetchTasks();

        // JSON requirement
        const jsonData = JSON.stringify(rawTasks);
        const parsedTasks = JSON.parse(jsonData);

        const tasks = parsedTasks.map(
            t => new Task(t.id, t.title, t.completed)
        );

        manager.setTasks(tasks);
        renderTasks();

        statusMessage.textContent = "";
    } catch (error) {
        statusMessage.textContent = "Error loading tasks.";
    }
});

function renderTasks() {
    taskList.innerHTML = "";

    manager.tasks.forEach(task => {
        const taskDiv = document.createElement("div");
        taskDiv.className = "task";

        if (task.completed) {
            taskDiv.classList.add("completed");
        }

        const titleSpan = document.createElement("span");
        titleSpan.textContent = task.title;

        const toggleBtn = document.createElement("button");
        toggleBtn.textContent = "Toggle";
        toggleBtn.addEventListener("click", () => {
            manager.toggleTask(task.id);
            renderTasks();
        });

        const deleteBtn = document.createElement("button");
        deleteBtn.textContent = "Delete";
        deleteBtn.addEventListener("click", () => {
            manager.removeTask(task.id);
            renderTasks();
        });

        taskDiv.appendChild(titleSpan);
        taskDiv.appendChild(toggleBtn);
        taskDiv.appendChild(deleteBtn);

        taskList.appendChild(taskDiv);
    });
}
