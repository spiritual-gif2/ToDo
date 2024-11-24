document.addEventListener("DOMContentLoaded", () => {
    const taskInput = document.getElementById("task-input");
    const taskList = document.getElementById("task-list");
    const addTaskButton = document.getElementById("add-task");
  
    const fetchTasks = async () => {
      const res = await fetch("http://127.0.0.1:3000/api/tasks");
      const tasks = await res.json();
      taskList.innerHTML = tasks
        .map(
          (task) => `
        <li data-id="${task.id}" class="${task.completed ? "completed" : ""}">
          ${task.title}
          <button class="delete-task">❌</button>
        </li>
      `
        )
        .join("");
    };
  
    const addTask = async (title) => {
      await fetch("http://127.0.0.1:3000/api/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title }),
      });
      fetchTasks();
    };
  
    taskList.addEventListener("click", async (e) => {
      if (e.target.classList.contains("delete-task")) {
        const id = e.target.parentNode.dataset.id;
        await fetch(`http://127.0.0.1:3000/api/tasks/${id}`, { method: "DELETE" });
        fetchTasks();
      }
    });
  
    addTaskButton.addEventListener("click", () => {
      if (taskInput.value.trim()) {
        addTask(taskInput.value.trim());
        taskInput.value = "";
      }
    });
  
    fetchTasks();
  });
  