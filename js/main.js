"use strict";

const inputText = document.querySelector(".todo-text_input"),
      addBtn = document.querySelector(".todo-add_btn"),
      listItem = document.querySelector(".todo-items"),
      todoItemCounter = document.querySelector(".todo-counter");

const todoFilter = document.querySelectorAll(".todo-filter-item"),
      filterItems = document.querySelector(".todo-filter-items");

let saveItemList = [];

console.log(filterItems);

loadItemsFromLocalStorage();

saveItemList.forEach(item => {
    addItem(saveItemList);
});

changeItemCounter();

function loadItemsFromLocalStorage() {
    if (localStorage.getItem("saveItems")) {
        saveItemList = JSON.parse(localStorage.getItem("saveItems"));
    }
}

function createItem(check = false, text = "") {
    const todoItem = {
        check,
        text,
    }

    saveItemList.push(todoItem);
}

function addItem(array) {
    listItem.innerHTML = "";
    array.forEach((item, index) => {
        const newItem = document.createElement("li");
        newItem.classList.add("todo-item");
        newItem.dataset.id = index;

        newItem.innerHTML = `<label class="todo-item_text ${item.check ? "complete" : ""}">
            <input type="checkbox" class="checkbox_btn" ${item.check ? "checked" : ""}>
            <span class="style-checkbox"></span>
            ${item.text}
            </label>
            <button class="todo-item-remove_btn"></button>`;
      
        listItem.append(newItem);
    });
}

function appendNewItem() {
    createItem(false, inputText.value);
    addItem(saveItemList);
    inputText.value = "";
    saveToLocalStorage();
}

function removeItem(e) {
    if (e.target.classList.contains("todo-item-remove_btn")) {
        saveItemList.forEach((item, index) => {
            if (index == e.target.parentNode.dataset.id) {
                saveItemList.splice(index, 1);
            }
        });
        addItem(saveItemList);
    }
    saveToLocalStorage();
}

function completeQuestion(e) {
    saveItemList.forEach((item, index) => {
        if (index == e.target.closest(".todo-item").dataset.id) {
            if (e.target.checked) {
                e.target.parentNode.classList.add("complete");
                saveItemList[index].check = true;
            } else {
                e.target.parentNode.classList.remove("complete");
                saveItemList[index].check = false;
            }
        }
    });
}

function saveToLocalStorage() {
    localStorage.removeItem("saveItems");
    localStorage.setItem("saveItems", JSON.stringify(saveItemList));
}

function changeItemCounter() {
    todoItemCounter.innerHTML = `${saveItemList.length} items`;
}

function selectFilter(e) {
    todoFilter.forEach(item => {
        item.classList.remove("active");
    });
    e.target.classList.add("active");
}

function filterItem() {
    
}

addBtn.addEventListener("click", () => {
    appendNewItem();
    changeItemCounter();
});
inputText.addEventListener("keydown", (e) => {
    if (e.key == "Enter") {
        appendNewItem();
        changeItemCounter();
    }
});

listItem.addEventListener("click", (e) => {
    removeItem(e);
    changeItemCounter();
});
listItem.addEventListener("click", completeQuestion);

todoFilter.forEach(item => {
    item.addEventListener("click", selectFilter);
});

filterItems.addEventListener("click", e => {
    if (e.target.getAttribute("id") == "all") {
        addItem(saveItemList);
    } else  if (e.target.getAttribute("id") == "active") {
        const sort = saveItemList.filter(item => !item.check);
        addItem(sort);
    } else  if (e.target.getAttribute("id") == "complete") {
        const sort = saveItemList.filter(item => item.check);
        addItem(sort);
    }
});