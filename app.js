// Book class: represent a Book
class Book {
	constructor(title, author, isbn) {
		this.title = title;
		this.author = author;
		this.isbn = isbn;
	}
}
// UI Class: handle UI tasks
class UI {
	static displayBooks() {
		const books = Store.getBooks();

		// so we going to loop thru the books
		books.forEach(function(book) {
			UI.addBookToList(book);
		});
	}

	// we want to add books to list
	static addBookToList(book) {
		//grabing on to that element from HTML
		const list = document.querySelector('#book-list');
		//create a table row element, insert tr tag into there
		const row = document.createElement('tr');

		row.innerHTML = `
        <td>${book.title}</td>
        <td>${book.author}</td>
        <td>${book.isbn}</td>
        <td><a href="#" class="btn btn-danger btn-sm delete">X</a></td>
        `;

		//so now we need to append to 'row' to the 'list'
		list.appendChild(row);
	}
	//this code for the delete situation
	//'el' stands for element
	//twice 'parentElement' case the first one is for <td> of the delete btn
	//and the second one goes for the all 'tr'
	static deleteBook(el) {
		if (el.classList.contains('delete')) {
			el.parentElement.parentElement.remove();
		}
	}

	//ALERT
	//this is a Bootstrap like alert if some of the field not filled in
	static showAlert(message, className) {
		const div = document.createElement('div');
		div.className = `alert alert-${className}`;
		div.appendChild(document.createTextNode(message));
		const container = document.querySelector('.container');
		const form = document.querySelector('#book-form');
		container.insertBefore(div, form);
		//this is a method we created but we need to call it somewhere
		//and its going to be in 'Validate'

		//vanishing in 3 sec
		//if not this method is will continue to add this alrert on the screen
		setTimeout(() => document.querySelector('.alert').remove(), 3000);
	}

	//for clear fields
	static clearFields() {
		document.querySelector('#title').value = '';
		document.querySelector('#author').value = '';
		document.querySelector('#isbn').value = '';
	}
}

// Store Class: Handle storage
//you can't store object in local storage - it has to be a string;
//so before adding to local - need to stringify
class Store {
	static getBooks() {
		let books;
		if (localStorage.getItem('books') === null) {
			books = [];
		} else {
			//it will store as a string
			//therefore use JSON.parse to make it as js array
			books = JSON.parse(localStorage.getItem('books'));
		}
		return books;
	}

	static addBook(book) {
		const books = Store.getBooks();
		books.push(book);
		localStorage.setItem('books', JSON.stringify(books));
	}

	static removeBook(isbn) {
		const books = Store.getBooks();
		books.forEach((book, index) => {
			if (book.isbn === isbn) {
				books.splice(index, 1);
			}
		});
		//now we need to recet the local storage after removal
		localStorage.setItem('books', JSON.stringify(books));
	}
}

// Event: Display Books
document.addEventListener('DOMContentLoaded', UI.displayBooks);

// Event: Add a Book
document.querySelector('#book-form').addEventListener('submit', (e) => {
	// prevent actual submit
	e.preventDefault();
	//get form value
	const title = document.querySelector('#title').value;
	const author = document.querySelector('#author').value;
	const isbn = document.querySelector('#isbn').value;

	//validate, creating alert
	//will learn the way how to do nice inside alert with Bootstrap
	if (title === '' || author === '' || isbn === '') {
		UI.showAlert('Please fill in all fields', 'info');
	} else {
		//istatiate book
		const book = new Book(title, author, isbn);

		//add Book UI
		UI.addBookToList(book);

		//add book to store
		Store.addBook(book);

		//show success message
		UI.showAlert('Book Added', 'success');

		//clear fields in the search bar
		UI.clearFields();
	}
});

// Event: Remove a Book
document.querySelector('#book-list').addEventListener('click', (e) => {
	//remove book from UI
	UI.deleteBook(e.target);

	//remove book from the Store
	Store.removeBook(e.target.parentElement.previousElementSibling.textContent);

	//show success message
	UI.showAlert('Book Removed', 'success');
});
