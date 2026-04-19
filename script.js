class ToDo {
    constructor() {
        this.toDoList = [];
    }

    addTask(text, date, description) {
        const task = {
            text: text,
            date: date,
            description: description,
            createdAt: new Date(),
            completed: false
        };
        this.toDoList.push(task);
    }

    removeTask(index) {
        if (index >= 0 && index < this.toDoList.length) {
            this.toDoList.splice(index, 1);
        }
    }

    toggleTask(index) {
        if (index >= 0 && index < this.toDoList.length) {
            this.toDoList[index].completed = !this.toDoList[index].completed;
        }
    }

    searchTasks(query) {
        return this.toDoList.filter(task =>
            task.text.toLowerCase().includes(query.toLowerCase()) ||
            (task.description && task.description.toLowerCase().includes(query.toLowerCase()))
        );
    }
}





const toDo = new ToDo();
const taskInput = document.getElementById('taskInput');
const dateInput = document.getElementById('dateInput');
const descriptionInput = document.getElementById('descriptionInput');
const addButton = document.getElementById('addButton');
const taskList = document.getElementById('taskList');
const searchBar = document.getElementById("searchBar");

function highlight(text, query) {
    if (!query) return text;

    const regex = new RegExp(`(${query})`, "gi");
    return text.replace(regex, "<mark>$1</mark>");
}

function renderTasks(query = "") {
    taskList.innerHTML = "";

    const tasks = query ? toDo.searchTasks(query) : toDo.toDoList;

    tasks.forEach((task) => {
        const realIndex = toDo.toDoList.indexOf(task);
        const taskClass = realIndex % 2 === 0 ? "-rr" : "-rl";   

        if (task.completed) {
            const taskItem = document.createElement("li");
            taskItem.className = "task-item";

            taskItem.innerHTML = `
                <div class="task-completed${taskClass}">
                    <div class="task-info">
                        <h3 class="task-text">${highlight(task.text, query)}</h3>
                        <p class="task-p">Data wykonania: ${task.date}</p>
                        <p class="task-description">${task.description}</p>
                    </div>
                    <div class="task-actions">
                        <input type="checkbox" checked>
                        <button>Usuń</button>
                    </div>
                </div>
            `;

            taskItem.querySelector("input[type='checkbox']").addEventListener("change", () => {
                toDo.toggleTask(realIndex);
                renderTasks(query);
            });

            taskItem.querySelector("button").addEventListener("click", () => {
                toDo.removeTask(realIndex);
                renderTasks(query);
            });

            taskItem.addEventListener("click", (e) => {
            const title = taskItem.querySelector(".task-text");

            if (title && (e.target === title || title.contains(e.target))) {
                makeEditable(title, "text", task.text, (newValue) => {
                    toDo.toDoList[realIndex].text = newValue;
                    renderTasks(query);
                });
            }});

            const textElement = taskItem.querySelector(".task-text");
            const dateElement = taskItem.querySelector(".task-p");
            const descriptionElement = taskItem.querySelector(".task-description");

            textElement.addEventListener("click", () => {
                makeEditable(textElement, "text", task.text, (newValue) => {
                    toDo.toDoList[realIndex].text = newValue;
                    renderTasks(query);
                });
            });

            dateElement.addEventListener("click", () => {
                makeEditable(dateElement, "date", task.date, (newValue) => {
                    toDo.toDoList[realIndex].date = newValue;
                    renderTasks(query);
                });
            });

            descriptionElement.addEventListener("click", () => {
                makeEditable(descriptionElement, "textarea", task.description, (newValue) => {
                    toDo.toDoList[realIndex].description = newValue;
                    renderTasks(query);
                });
            });

            taskList.appendChild(taskItem);
        } else {
            const taskItem = document.createElement("li");
            taskItem.className = "task-item";

            taskItem.innerHTML = `
                <div class="task${taskClass}">
                    <div class="task-info">
                        <h3 class="task-text">${highlight(task.text, query)}</h3>
                        <p class="task-p">Data wykonania: ${task.date}</p>
                        <p class="task-description">${task.description}</p>
                    </div>
                    <div class="task-actions">
                        <input type="checkbox">
                        <button>Usuń</button>
                    </div>
                </div>
            `;

            taskItem.querySelector("input[type='checkbox']").addEventListener("change", () => {
                toDo.toggleTask(realIndex);
                renderTasks(query);
            });

            taskItem.querySelector("button").addEventListener("click", () => {
                toDo.removeTask(realIndex);
                renderTasks(query);
            });

            taskItem.addEventListener("click", (e) => {
            const title = taskItem.querySelector(".task-text");

            if (title && (e.target === title || title.contains(e.target))) {
                makeEditable(title, "text", task.text, (newValue) => {
                    toDo.toDoList[realIndex].text = newValue;
                    renderTasks(query);
                });
            }});

            const textElement = taskItem.querySelector(".task-text");
            textElement.classList.add("editable-text");
            const dateElement = taskItem.querySelector(".task-p");
            dateElement.classList.add("editable-date");
            const descriptionElement = taskItem.querySelector(".task-description");
            descriptionElement.classList.add("editable-description");

            textElement.addEventListener("click", () => {
                makeEditable(textElement, "text", task.text, (newValue) => {
                    toDo.toDoList[realIndex].text = newValue;
                    renderTasks(query);
                });
            });

            dateElement.addEventListener("click", () => {
                makeEditable(dateElement, "date", task.date, (newValue) => {
                    toDo.toDoList[realIndex].date = newValue;
                    renderTasks(query);
                });
            });

            descriptionElement.addEventListener("click", () => {
                makeEditable(descriptionElement, "textarea", task.description, (newValue) => {
                    toDo.toDoList[realIndex].description = newValue;
                    renderTasks(query);
                });
            });

            taskList.appendChild(taskItem);
        }
    });
}

addButton.addEventListener("click", () => {
    const text = taskInput.value;
    const date = dateInput.value;
    const description = descriptionInput.value;

    if (text == "") {
        alert("Nie wprowadzono nazwy zadania.");
        return;
    }

    if (date == "") {
        alert("Nie wprowadzono daty wykonania zadania.");
        return;
    }

    taskInput.value = "";
    dateInput.value = "";
    descriptionInput.value = "";

    toDo.addTask(text, date, description);
    renderTasks(searchBar.value);
});

searchBar.addEventListener("input", () => {
    const value = searchBar.value.trim();

    if (value.length < 3) {
        renderTasks("");
        return;
    }

    renderTasks(value);
});

function makeEditable(element, type, initialValue, onSave) {
    const input = document.createElement(type === "textarea" ? "textarea" : "input");
    input.value = initialValue;

    if (type === "date") {
        input.type = "date";
    }

    if (type === "textarea") {
        input.classList.add("edit-textarea");
    } else if (type === "date") {
        input.classList.add("edit-date");
    } else {
        input.classList.add("edit-input");
    }

    element.replaceWith(input);
    input.focus();

    const save = () => {
        onSave(input.value);
    }

    input.addEventListener("blur", save);
    input.addEventListener("keydown", (e) => {
        if (e.key === "Enter" && type !== "textarea") {
            input.blur();
        }
    });
}

renderTasks();
