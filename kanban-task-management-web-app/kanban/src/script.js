"use strict";

/* HTML elements */
const boardsEl = document.querySelector('.boards');
const mainEl = document.querySelector('.main');
const newTaskContainerEl = document.querySelector('.new-task-container');
const addNewBoardContainerEl = document.querySelector('.add-new-board-container');
const overlayEl = document.querySelector('.overlay');

/* buttons */
const addNewTaskBtn = document.querySelector('.add-new-task-btn');
const createNewBoardBtn = document.querySelector('.create-new-board-btn');
const createNewColumnBtn = document.querySelector('.add-new-column-btn');
const createNewBoardModalBtn = document.querySelector('.create-new-board-btn-modal');


let columnCount = 1;
let addNewTaskModalIsOpen;
let createNewBoardModalIsOpen;

class Board {
    constructor() {}
}

fetch("data.json")
    .then(res => {
        if (!res.ok) {
            throw new Error("not found");
        }
        return res.json();
    })
    .then(data => {
        const { boards } = data;
        displayBoardHeaders(boards);
    })
    .catch(err => {
        console.log(err);
    });

function displayBoardHeaders(boards) {
    boards.forEach(board => {
        const boardsNames = `
        <li>
            <span class="board-icon">
                <img 
                src="assets/icon-board.svg" 
                alt="board-icon" 
                class="board-icon">
                <p class="board-name">${board.name}</p>
            </span>
        </li>
        `;
        boardsEl.insertAdjacentHTML('beforeend', boardsNames);
    });
}

function addNewTask() {
    let taskStorage = JSON.parse(localStorage.getItem("tasks")) || [];

    const task = {
        title: "",
        description: "",
        subtasks: [],
        status: ""
    };

    taskStorage.push(task);
    localStorage.setItem("tasks", JSON.stringify(taskStorage));
    console.log("task added");
    console.log(taskStorage);
}

function displayNewTaskModal(event) {
    const div = document.createElement('div');
    div.className = 'add-new-task-container';

    div.innerHTML = `
        <h2>Add New Task</h2>
        <label for="title"></label>
        <input type="text" placeholder="e.g. Take coffee break" id="title">
        
        <label for="description">Description</label>
        <textarea id="description"
            placeholder="e.g. It's always good to take a break. This 15-minute break will recharge the batteries a little.">
        </textarea>

        <label for="subtasks">Subtasks</label>
        <input type="text" placeholder="e.g. Make coffee" id="subtasks">

        <button>Add New Subtask</button>

        <label for="status">Choose a status:</label>
        <select name="status" id="status">
          <option value="todo">Todo</option>
          <option value="doing">Doing</option>
          <option value="done">Done</option>
        </select>

        <button class="close-task-btn">Create Task</button>
    `;

    mainEl.appendChild(div);
    addNewTaskModalIsOpen = true;

    document.querySelector('.close-task-btn').addEventListener('click', function () {
        closeModal('.add-new-task-container', addNewTaskBtn);
        overlayEl.classList.add('hidden');
    });
}



function closeModal(className, button) {
    const modal = document.querySelector(className);
    if (modal) {
        modal.remove();
        addNewTaskModalIsOpen = false;
        button.disabled = false;
    }
}

function closeModal2(className, button) {
    const modal = document.querySelector(className);
    if (modal) {
        modal.classList.add('hidden');
        createNewBoardModalIsOpen = false;
        button.disabled = false;
    }
}



mainEl.addEventListener('click', function(event) {
    const newTaskModal = document.querySelector('.add-new-task-container');
    const newBoardModal = document.querySelector('.add-new-board-container');

    if (addNewTaskModalIsOpen && newTaskModal && !newTaskModal.contains(event.target) && event.target !== addNewTaskBtn) {
        closeModal('.add-new-task-container', addNewTaskBtn);
        overlayEl.classList.add('hidden');
    }

    if (createNewBoardModalIsOpen && newBoardModal && !newBoardModal.contains(event.target) && event.target !== createNewBoardBtn) {
        closeModal2('.add-new-board-container', createNewBoardBtn);
        overlayEl.classList.add('hidden');
    }
});


function createNewColumn() {
    const columnContainerEl = document.querySelector('.columns-container');
    //const columnId = `column-input-${String(columnCount).padStart(2, '0')}`;
    const columnId = Date.now();

    if (columnCount > 4) return;

    const newColumnHTML = `
        <div class="flex">
            ${columnCount < 4 ? `<label for="${columnId}"></label>` : ""}
            <input type="text"
                   placeholder="e.g. Todo"
                   id="${columnId}"
            />
            <span class="close-icon-container">
                <img src="assets/icon-cross.svg" 
                     alt="close icon"
                     class="close-icon"
                />
            </span>
        </div>
    `;

    columnContainerEl.insertAdjacentHTML('beforeend', newColumnHTML);
    columnCount++;
}
document.querySelector('.columns-container').addEventListener('click', function (event) {
    if (event.target.classList.contains('close-icon')) {
        event.stopPropagation();
        const columnDiv = event.target.closest('.flex'); // Find the closest parent div with class "flex"
        if (columnDiv) {
            columnDiv.remove();
            columnCount--;
            console.log(columnCount);
        }
    }
});


createNewBoardModalBtn.addEventListener('click',function(){
    validateColumnInput()
})


function validateColumnInput(){
    const boardNameInput = document.getElementById('board-name');
    const boardColumn01 = document.getElementById('column-input-01');
    if(boardNameInput.value.trim() === ""){
        console.log("name is empty")
    }
    if(boardColumn01 !== null){
        if(boardColumn01.value.trim() === ""){
            console.log("01 is empty")
        }
    }
}



addNewTaskBtn.addEventListener('click', function(){
    overlayEl.classList.remove('hidden');
    addNewTaskModalIsOpen = true;
    addNewTaskBtn.disabled = true;
    displayNewTaskModal();
});

createNewBoardBtn.addEventListener('click', function() {
    overlayEl.classList.remove('hidden');
    createNewBoardModalIsOpen = true;
    createNewBoardBtn.disabled = true;
    addNewBoardContainerEl.classList.remove('hidden');
});

if (createNewColumnBtn) {
    createNewColumnBtn.addEventListener('click', createNewColumn);
}
