const bar = document.querySelector('input');
const itemContainer = document.querySelector(".item-container");
const addBtn = document.querySelector('.add-btn');
const clearBtn = document.querySelector('.clear-btn');
const groceryCard = document.querySelector('.grocery-card');
const info = document.querySelector(".info");

//Global Variables
let editFlag = false;
let editElement ;
let editButton ;
let editID='';


function loadItems() {
    let items = getLocalStorage();
    items.forEach(item=>{
        createItems(item.value, item.id)
    })
}


function createItems(value,id) {
    const element = document.createElement('div')
    element.innerHTML = `<p>${value}</p>
    <div class="btn-container">
    <button class="edit-btn"><i class="lni lni-pencil"></i></button>
    <button class="delete-btn"><i class="lni lni-archive"></i</button>
    </div>`
    const attr = document.createAttribute("data-id")
    attr.value = id
    element.setAttributeNode(attr)
    element.classList.add('item')
    itemContainer.prepend(element);
    const editBtn= document.querySelector('.edit-btn')
    const deleteBtn= document.querySelector('.delete-btn')
    editBtn.addEventListener("click",editItem)
    deleteBtn.addEventListener("click",deleteItem)
}


function addItems(e) {
    e.preventDefault()
    let input = bar.value;
    const items = getLocalStorage()
    const id = `no. ${items.length + 1}`
    if (!editFlag && input) {
        createItems(input,id)
        displayColor("success")
        startInfo()
        addToLocalstorage(input,id)
        bar.value = ""
    }else if (editFlag && input) {
        editElement.textContent = input
        editLocalStorage(editID,input)
        displayColor("success")
        setToDefault()
    }else{
        displayColor("danger")
    }
}


function displayColor(state) {
    groceryCard.classList.add(state)

    setTimeout(()=>{
        groceryCard.classList.add("noBorder")
        groceryCard.classList.remove(state)
    }, 1000)
}

function setToDefault() {
    input = ""
    addBtn.textContent = "Add Item";
    editElement.style.color = "#edeffd"
    editButton.style.color = "#edeffd"
    bar.value = ""
}

function editItem(e) {
    editElement = e.currentTarget.parentElement.previousElementSibling;
    editID= e.currentTarget.parentElement.parentElement.dataset.id
    editButton = e.target;
    bar.value = editElement.textContent;
    editElement.style.color = "#924d5e"
    editButton.style.color = "#41f1b6"
    editFlag=true;
    addBtn.textContent = "Edit";
}

function deleteItem(e) {
    const item = e.currentTarget.parentElement.parentElement
    const itemID = e.currentTarget.parentElement.parentElement.dataset.id
    displayColor("danger")
    removefromLocalStorage(itemID)
    item.remove()
    startInfo()
}


function clearItems() {
    const items = document.querySelectorAll('.item')
    items.forEach(item =>{
        itemContainer.removeChild(item)
    })
    startInfo()
    displayColor("danger")
    localStorage.removeItem("grocery")
}

function startInfo() {
    if (itemContainer.children.length == 0) {
        info.style.display = "block"
        clearBtn.classList.add("none");
    }else{
        info.style.display = "none"
        clearBtn.classList.remove("none")
    }
}

//*******Local Storage*****//

function addToLocalstorage(value,id) {
    const items = getLocalStorage();
    const item = {
        id : id,
        value : value
    }
    items.push(item)
    localStorage.setItem("grocery",JSON.stringify(items))
}

function removefromLocalStorage(id) {
    let items = getLocalStorage()
    items = items.filter(item =>{
        if (item.id !== id) {
            return item
        }
    })
    localStorage.setItem("grocery",JSON.stringify(items))
}

function getLocalStorage() {
    return localStorage.getItem("grocery")? JSON.parse(localStorage.getItem("grocery")) : []
}


function editLocalStorage(id,value) {
    let items = getLocalStorage()
    items = items.map(item =>{
        if (item.id == id) {
            item.value=value
        }
        return item
    })
    localStorage.setItem("grocery", JSON.stringify(items))
} 


//*******Add Event LIsteners***//
addBtn.addEventListener('click', addItems)
window.addEventListener('DOMContentLoaded', loadItems);
window.addEventListener('DOMContentLoaded', startInfo);
clearBtn.addEventListener("click", clearItems)