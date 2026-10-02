// Wait for DOM content to load before attaching events
document.addEventListener("DOMContentLoaded", () => {
  // DOM Element Selectors
  const taskInput = document.getElementById("taskInput");
  const addTaskBtn = document.getElementById("addTaskBtn");
  const loadSamplesBtn = document.getElementById("loadSamplesBtn");
  const taskList = document.getElementById("taskList");
  const taskMessage = document.getElementById("taskMessage");
  const totalCount = document.getElementById("totalCount");
  const pendingCount = document.getElementById("pendingCount");
  const completedCount = document.getElementById("completedCount");

  let taskCounter = 0;

  // 1. Create a single dynamic task element securely using createElement and textContent
  function createTaskElement(taskText, taskId) {
    const li = document.createElement("li");
    li.className = "task-item";
    li.dataset.taskId = taskId;
    li.dataset.state = "pending";

    const span = document.createElement("span");
    span.className = "task-text";
    span.textContent = taskText; // Safe text assignment preventing HTML/JS injection

    const completeBtn = document.createElement("button");
    completeBtn.className = "complete-btn";
    completeBtn.textContent = "Complete";

    const editBtn = document.createElement("button");
    editBtn.className = "edit-btn";
    editBtn.textContent = "Edit";

    const removeBtn = document.createElement("button");
    removeBtn.className = "remove-btn";
    removeBtn.textContent = "Remove";

    li.appendChild(span);
    li.appendChild(completeBtn);
    li.appendChild(editBtn);
    li.appendChild(removeBtn);

    return li;
  }

  // 2. Validate, create ID, append task to list, clear input, and update statistics
  function addTask(taskText) {
    const trimmedText = taskText.trim();
    if (!trimmedText) {
      taskMessage.textContent = "Task cannot be empty";
      return;
    }

    taskMessage.textContent = "";
    taskCounter++;
    const taskId = `task-${taskCounter}`;

    const taskElement = createTaskElement(trimmedText, taskId);
    taskList.appendChild(taskElement);

    taskInput.value = "";
    updateTaskCounts();
  }

  // 3. Toggle completed state class and dataset value
  function toggleTaskComplete(taskItem) {
    taskItem.classList.toggle("completed");
    const isCompleted = taskItem.classList.contains("completed");
    taskItem.dataset.state = isCompleted ? "completed" : "pending";
    updateTaskCounts();
  }

  // 4. Transform visible text span into an input field for editing
  function beginTaskEdit(taskItem) {
    const span = taskItem.querySelector(".task-text");
    if (!span) return;

    const currentText = span.textContent;
    const input = document.createElement("input");
    input.type = "text";
    input.className = "edit-input";
    input.value = currentText;

    taskItem.replaceChild(input, span);

    const editBtn = taskItem.querySelector(".edit-btn");
    if (editBtn) {
      editBtn.textContent = "Save";
    }
  }

  // 5. Validate edit input, safely create text span, replace input, restore button text
  function saveTaskEdit(taskItem) {
    const input = taskItem.querySelector(".edit-input");
    if (!input) return;

    const updatedText = input.value.trim();
    if (!updatedText) {
      taskMessage.textContent = "Task cannot be empty";
      return;
    }

    taskMessage.textContent = "";
    const span = document.createElement("span");
    span.className = "task-text";
    span.textContent = updatedText;

    taskItem.replaceChild(span, input);

    const editBtn = taskItem.querySelector(".edit-btn");
    if (editBtn) {
      editBtn.textContent = "Edit";
    }
  }

  // 6. Remove selected task from DOM and update summary stats
  function removeTask(taskItem) {
    taskItem.remove();
    updateTaskCounts();
  }

  // 7. Calculate and update summary count badges based on DOM nodes
  function updateTaskCounts() {
    const total = taskList.children.length;
    let pending = 0;
    let completed = 0;

    Array.from(taskList.children).forEach((item) => {
      if (item.dataset.state === "completed") {
        completed++;
      } else {
        pending++;
      }
    });

    totalCount.textContent = total;
    pendingCount.textContent = pending;
    completedCount.textContent = completed;
  }

  // 8. Event delegation handler attached to parent container #taskList
  function handleTaskListClick(event) {
    const target = event.target;
    const taskItem = target.closest(".task-item");

    if (!taskItem) return;

    if (target.classList.contains("complete-btn")) {
      toggleTaskComplete(taskItem);
    } else if (target.classList.contains("edit-btn")) {
      if (target.textContent === "Edit") {
        beginTaskEdit(taskItem);
      } else if (target.textContent === "Save") {
        saveTaskEdit(taskItem);
      }
    } else if (target.classList.contains("remove-btn")) {
      removeTask(taskItem);
    }
  }

  // 9. Batch load initial dynamic sample tasks using document fragment
  function loadSampleTasks() {
    const sampleTasks = [
      "Review DOM selectors",
      "Practice createElement",
      "Study event delegation"
    ];

    const fragment = document.createDocumentFragment();

    sampleTasks.forEach((text) => {
      taskCounter++;
      const taskId = `task-${taskCounter}`;
      const taskElem = createTaskElement(text, taskId);
      fragment.appendChild(taskElem);
    });

    taskList.appendChild(fragment);
    taskMessage.textContent = "";
    updateTaskCounts();
  }

  // Event Listener Attachments
  addTaskBtn.addEventListener("click", () => {
    addTask(taskInput.value);
  });

  taskInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
      addTask(taskInput.value);
    }
  });

  loadSamplesBtn.addEventListener("click", loadSampleTasks);

  // Single Delegated Listener for Task List Actions
  taskList.addEventListener("click", handleTaskListClick);
});