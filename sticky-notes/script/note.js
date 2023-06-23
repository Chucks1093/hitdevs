const months = [
	"January",
	"February",
	"March",
	"April",
	"May",
	"June",
	"July",
	"August",
	"September",
	"October",
	"November",
	"December",
];

const themes = ["first", "second", "third", "fourth", "fifth"];

//*********FORM ELEMENT*********//
const modalCover = document.querySelector("#note__query");
const form = modalCover.firstElementChild;
const title = form.querySelector("#title");
const content = form.querySelector("#content");
const themeContainer = form.querySelector("#theme-container");
const formBtn = form.querySelector(".submit__btn");
const deleteBtn = form.querySelector(".delete__btn");
const themeLabel = form.querySelector("#theme__label");

//*********OTHER ELEMENTS*********//
const noNote = document.querySelector(".no__notes");
const searchBox = document.querySelector(".search__box input");
const addBtn = document.querySelector("#add__btn");
const notes = document.querySelector("#notes");
const themeElement = themeContainer.querySelectorAll(".theme");

//*********TARGET ELEMENT VALUES*********//
let themeValue = themes[0];
let isEditing = false;
let editingElement = Element;

//*********FUNCTIONS*********//
function resetToDefault() {
	title.value = "";
	content.value = "";
	isEditing = false;
	editingElement = Element;
}

function setModalElement() {
	themeLabel.style.display = isEditing ? "none" : "block";
	themeContainer.style.display = isEditing ? "none" : "flex";
	deleteBtn.style.display = isEditing ? "block" : "none";
	formBtn.textContent = isEditing ? "Edit" : "Add";

}

function toggleModalVisibility() {
	const animationName = modalCover.style.animationName;
	modalCover.style.animation = `${
		animationName == "openModal" ? "closeModal" : "openModal"
	} .4s ease forwards`;
}

function makeFavourite(e) {
	const star = e.currentTarget;
	editingElement = star.parentElement.parentElement;
	const origin = window.location.origin;
	const favourite = `${origin}/images/filled-star.svg`;
	const notFavourite = `${origin}/images/unfilled-star.svg`;
	star.src = star.src == notFavourite ? favourite : notFavourite;
	editLocalStorage(undefined, editingElement.dataset.id)
}

function openEditingModal(e) {
	isEditing = true;
	let notes = getLocalStorage();
	editingElement = e.currentTarget.parentElement.parentElement;
	const note = notes.filter(
		(note) => note.date.id == editingElement.dataset.id
	);
	setModalElement();
	title.value = note[0].value.title;
	content.value = note[0].value.content;
	toggleModalVisibility();
}

themeElement.forEach((ele) => {
	ele.addEventListener("click", (e) => {
		const selectedColorSwatch = e.currentTarget;
		themeElement.forEach((ele, i) => {
			if (ele !== selectedColorSwatch) {
				ele.classList.remove("active");
			}
			if (ele == selectedColorSwatch) {
				selectedColorSwatch.classList.add("active");
				themeValue = themes[i];
			}
		});
	});
});

function createNoteElement(note, date) {
	const newNote = document.createElement("article");
	newNote.classList.add(note.theme);
	newNote.dataset.id = note.id;
	const src = note.isFavorite ? "filled-star" : "unfilled-star";
	const format = `<h4><img id="star" src="/images/${src}.svg" alt="star" class="star">${note.title}</h4><div class="info"><span>${date.month} ${date.day}, ${date.year}</span><img id="pen" class="pen" src="/images/pen.svg" alt=""></div>`;
	newNote.innerHTML = format;
	newNote.dataset.id = date.id;
	notes.append(newNote);
	const starBtn = newNote.querySelector("#star");
	const penBtn = newNote.querySelector("#pen");
	starBtn.addEventListener("click", makeFavourite);
	penBtn.addEventListener("click", openEditingModal);
}

function addNoteElement(note) {
	const date = new Date();
	const dateCreated = {
		id: date.getTime().toString(), //unique id
		day: date.getDate(),
		month: months[date.getMonth()],
		year: date.getFullYear(),
	};
	noNote.style.display = "none";
	createNoteElement(note, dateCreated);
	addToLocalStorage(note, dateCreated);
	toggleModalVisibility();
	setModalElement();
	resetToDefault();
}

function editNote(note) {
	toggleModalVisibility();
	const starImg = editingElement.querySelector("#star");
	const noteTitle = editingElement.querySelector("h4");
	const id = editingElement.dataset.id;
	noteTitle.innerHTML = `${note.title}<img id="star" src="${starImg.src}" alt="star" class="star">`;
	editingElement
		.querySelector("#star")
		.addEventListener("click", makeFavourite);
	editLocalStorage(note, id);
	resetToDefault();
};

function setStoredNotes() {
    const notes = getLocalStorage();
	notes.forEach(note => {
		createNoteElement(note.value, note.date);
	});
	noNote.style.display = notes.length == 0 ? "block" : "none";
}

function deleteNote() {
	noNote.style.display = getLocalStorage().length == 1? "block" : "none";
	editingElement.remove();
	removeFromLocalStorage(editingElement.dataset.id);
	toggleModalVisibility();
	setTimeout(() => {
		resetToDefault();
		setModalElement();
	}, 500);

}


function getFilteredNotes(text) {
	let filteredNotes = getLocalStorage();
	filteredNotes = filteredNotes.filter(note => containsSubstring(note.value.title, text));
	notes.innerHTML = null;
	filteredNotes.forEach(note => {
		createNoteElement(note.value, note.date)
	})
}

function containsSubstring(mainString, substring) {
	const pattern = new RegExp(substring, "i");
	return pattern.test(mainString);
}

//*********ADDEVENTLISTENERS*********//

form.addEventListener("submit", (e) => {
	e.preventDefault();
	const note = {
		title: title.value,
		content: content.value,
		isFavorite: false,
		theme: themeValue,
	};
	if (isEditing) {
		editNote(note);
	} else {
		addNoteElement(note);
	}
});

addBtn.addEventListener("click", () => {
	setModalElement();
	toggleModalVisibility();
});

modalCover.addEventListener("click", (e) => {
	if (!e.target.closest("form")) {
		toggleModalVisibility();
		setTimeout(() => {
			resetToDefault();
			setModalElement();
		}, 500);
	}
});

searchBox.addEventListener("input", ()=> getFilteredNotes(searchBox.value));
deleteBtn.addEventListener("click", deleteNote);
window.addEventListener("DOMContentLoaded", setStoredNotes);

//*********LOCALSTORAGE*********//
const getLocalStorage = () =>
	localStorage.getItem("notes")
		? JSON.parse(localStorage.getItem("notes"))
		: [];

const addToLocalStorage = (value, date) => {
	let note = { value, date };
	let notes = getLocalStorage();
	notes.push(note);
	localStorage.setItem("notes", JSON.stringify(notes));
};

const editLocalStorage = (value, id) => {
	let notes = getLocalStorage();
	notes = notes.map((note) => {
		if (value == undefined && note.date.id === id) {
			note.value.isFavorite = !note.value.isFavorite
		} else if (value !== undefined && note.date.id === id) {
			note.value.title = value.title;
			note.value.content = value.content;
		}
		return note;
	});
	localStorage.setItem("notes", JSON.stringify(notes));
};

const removeFromLocalStorage = (id) => {
	let notes = getLocalStorage();
	notes = notes.filter((note) => note.date.id !== id);
	localStorage.setItem("notes", JSON.stringify(notes));
};
