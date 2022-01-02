window.onload = function () {
    const tasks = document.getElementsByClassName("task");
    const newTaskText = document.getElementById("newText");
    const newTaskButton = document.getElementById("add");
    //NEW TASK
    //NEW TASK TEXT
    let showDefaultText = true;
    newTaskText.addEventListener('click', function () {
        if (showDefaultText) {
            this.textContent = "";
            showDefaultText = false;
        }
    }, false);
    newTaskText.addEventListener("input", function () {
        console.log(this.textContent);
    }, false);
    //NEW TASK BUTTON
    newTaskButton.addEventListener('click', taskAdd, false);
    //END NEW TASK
    for (let i = 0; i < tasks.length; i++) {
        for (const child of tasks[i].childNodes) {
            if (child.classList.contains('text')) {
                child.addEventListener("input", () => taskTextUpdate(i, this.textContent), false);
            }
            if (child.classList.contains('changeState')) {
                child.addEventListener('click', () => taskChangeStatus(i), false)
            }
            if (child.classList.contains('delete')) {
                child.addEventListener('click', () => taskDelete(i), false)
            }
        }
    }

    function taskAdd() {
        console.log("addTask");
        fetch("/tasks", {
            method: "POST",
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({task: 'add', text: newTaskText.textContent})
        }).then(res => {
            console.log("Request complete! response:", res);
            location.reload();
        });
    }

    function taskTextUpdate(id, text) {
        console.log("taskTextUpdate", id, text);
        fetch("/tasks", {
            method: "POST",
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({task: 'updateText', text: text, id: id})
        }).then(res => {
            console.log("Request complete! response:", res);
            location.reload();
        });
    }

    function taskChangeStatus(id) {
        console.log("taskChangeStatus", id);
        fetch("/tasks", {
            method: "POST",
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({task: 'updateStatus', id: id})
        }).then(res => {
            console.log("Request complete! response:", res);
            location.reload();
        });
    }

    function taskDelete(id) {
        console.log("taskDelete", id);
        if (window.confirm("Delete task can not be restored, continue?")) {
            fetch("/tasks", {
                method: "POST",
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({task: 'delete', id: id})
            }).then(res => {
                console.log("Request complete! response:", res);
                location.reload();
            });
        }
    }
};