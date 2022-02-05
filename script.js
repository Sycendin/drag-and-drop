const addBtns = document.querySelectorAll('.add-btn:not(.solid)');
const saveItemBtns = document.querySelectorAll('.solid');
const addItemContainers = document.querySelectorAll('.add-container');
const addItems = document.querySelectorAll('.add-item');
// Item Lists
const listColumns = document.querySelectorAll('.drag-item-list');
const backlogList = document.getElementById('backlog-list');
const progressList = document.getElementById('progress-list');
const completeList = document.getElementById('complete-list');
const onHoldList = document.getElementById('on-hold-list');

// Items
let updatedOnLoad = false;

// Initialize Arrays
let backlogListArray = [];
let progressListArray = [];
let completeListArray = [];
let onHoldListArray = [];
let listArrays = [];

// Drag Functionality
let draggedItem;
let dragging = false;
let currentColumn;

// Get Arrays from localStorage if available, set default values if not
const getSavedColumns =()=> {
  if (localStorage.getItem('backlogItems')) {
    backlogListArray = JSON.parse(localStorage.backlogItems);
    progressListArray = JSON.parse(localStorage.progressItems);
    completeListArray = JSON.parse(localStorage.completeItems);
    onHoldListArray = JSON.parse(localStorage.onHoldItems);
  } else {
    backlogListArray = ['Release the course', 'Sit back and relax'];
    progressListArray = ['Work on projects', 'Listen to music'];
    completeListArray = ['Being cool', 'Getting stuff done'];
    onHoldListArray = ['Being uncool'];
  }
}



// Set localStorage Arrays
const updateSavedColumns= ()=> {
  listArrays = [backlogListArray, progressListArray, completeListArray, onHoldListArray];
  const arrayNames = ['backlog', 'progress', 'complete', 'onHold']
  listArrays.forEach((store, index)=>{
    localStorage.setItem(`${arrayNames[index]}Items`, JSON.stringify(store));
  })
}
// filter arrays to remove empty entries
const filterArray = (array) =>{
  const filteredArray = array.filter(item => item !== null)
  return filteredArray;

}
// Create DOM Elements for each list item
const createItemEl = (columnEl, column, item, index)=> {

  // List Item
  const listEl = document.createElement('li');
  listEl.classList.add('drag-item');
  listEl.textContent = item;
  listEl.draggable = true;
  listEl.setAttribute('ondragStart', 'drag(event)');
  listEl.contentEditable = true;
  listEl.id = index;
  listEl.setAttribute('onfocusout', `updateItem(${index}, ${column})`)
  //Apend
  columnEl.appendChild(listEl);

}

// Update Columns in DOM - Reset HTML, Filter Array, Update localStorage
const updateDOM = () => {
  // Check localStorage once
  if(!updatedOnLoad){
    getSavedColumns();
  }
  // Backlog Column
  backlogList.textContent = '';
  backlogListArray.forEach((backlogItem, index)=>{
    createItemEl(backlogList, 0, backlogItem, index);
  })
  backlogListArray = filterArray(backlogListArray);
  // Progress Column
  progressList.textContent = '';
  progressListArray.forEach((progressItem, index)=>{
    createItemEl(progressList, 1, progressItem, index);
  })
  progressListArray = filterArray(progressListArray);
  // Complete Column
  completeList.textContent = '';
  completeListArray.forEach((completeItem, index)=>{
    createItemEl(completeList, 2, completeItem, index);
  })
  completeListArray = filterArray(completeListArray);
  // On Hold Column
  onHoldList.textContent = '';
  onHoldListArray.forEach((onHoldItem, index)=>{
    createItemEl(onHoldList, 3, onHoldItem, index);
  })
  onHoldListArray = filterArray(onHoldListArray);
  // Run getSavedColumns only once, Update Local Storage
  updatedOnLoad = true;
  updateSavedColumns();

}

// Update Item - delete if blank  or update array
const updateItem= (id, column)=>{
  const selectedArray = listArrays[column]
  const selectedColumnEl = listColumns[column].children;
  if (!dragging){
    if(!selectedColumnEl[id].textContent){
      delete selectedArray[id];
    }
    else{
      selectedArray[id] = selectedColumnEl[id].textContent;
    }
    updateDOM();
  }
}
// Add to column list, rest  textbox
const addToColumn = (column) =>{
  const itemText = addItems[column].textContent;
  const selectedArray = listArrays[column];
  selectedArray.push(itemText);
  addItems[column].textContent = '';
  updateDOM();
  
  
}

// Show add item box
const showInputBox = (column) =>{
  addBtns[column].style.visibility = 'hidden'
  saveItemBtns[column].style.display = 'flex'
  addItemContainers[column].style.display = 'flex'
}
// Hide input box
const hideInputBox = (column) =>{
  addBtns[column].style.visibility = 'visible'
  saveItemBtns[column].style.display = 'none'
  addItemContainers[column].style.display = 'none'
  addToColumn(column);

}
// Change arrays when drag and drop is used
const rebuildArrays = () =>{

  backlogListArray = Array.from(backlogList.children).map(i => i.textContent);
  progressListArray = Array.from(progressList.children).map(i => i.textContent);
  completeListArray = Array.from(completeList.children).map(i => i.textContent);
  onHoldListArray = Array.from(onHoldList.children).map(i => i.textContent);
  updateDOM();
}
// When the item starts dragging
const drag = (e) =>{
  draggedItem = e.target;
  dragging = true;

}

// Column allows for item to drop
const allowDrop = (e) =>{
  e.preventDefault();

}
// Dropping item in column
const drop=(e) =>{
  e.preventDefault();
  // Remove Background Color
  listColumns.forEach((column)=>{
    column.classList.remove('over')
  });
   //Add item to column
  const parent = listColumns[currentColumn];
  parent.appendChild(draggedItem)
  // Draggong done
  dragging = false;
  rebuildArrays();
}

// when the item enters the column
const dragEnter = (column) =>{
  listColumns[column].classList.add('over')
  currentColumn = column;
}

// On page load
updateDOM();

