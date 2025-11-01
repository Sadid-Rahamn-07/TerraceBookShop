function load_books(data) {
    const displayContainer = document.getElementById('posted_books_displayer');
    console.log(displayContainer);
    displayContainer.innerHTML = ''; // Clear previous content

    if (data.length === 0) {
        displayContainer.innerHTML = '<p>No books posted yet.</p>';
        return;
    }

    data.forEach((book) => {
        const imageURL = './uploads/' + book.imageFilename;
        const bookTitle = book.title || 'No Title Available';
        const bookAuthors = book.author || 'No Author Available';
        const ISBN = book.isbn || 'No ISBN Available';
        const price = book.price || 'No Price Available';
        const book_condition = book.book_condition || 'No Condition Available';
        const description = book.description || 'No Description Available';

        const bookElement = document.createElement('div');
        bookElement.className = 'book-item';
        bookElement.innerHTML = `
            <div id="book_wrapper" style="text-align: left;display:block">
                <div width="100px" height="300px" style="float:left; margin-right:10px;">
                    <img height="100px" width="100px" style="float:left;" src="${imageURL}" alt="Book Image">
                </div>
                <div id="book_content" style="text-align: left;">
                    <h2>${bookTitle}</h1>
                    <h4>${bookAuthors}</h3>
                    <p><strong>ISBN:</strong> ${ISBN}</p>
                    <p><strong>Condition:</strong> ${book_condition}</p>
                    <p><strong>Price:</strong> $${price}</p>
                </div>
            </div>
            <div id="desc" style="text-align:justify;margin-top : 60px"  class="description-container">
                                <p style="text-align:justify;display:inline-block"><strong>Description:</strong></p>
            ${description}
            </div>
            <br>
            <hr>
            <br>
        `;
        displayContainer.appendChild(bookElement);
    });

}

function fetch_books_data() {
    fetch('./posted_books')
        .then((response) => response.json())
        .then((data) => {
            load_books(data); // Call the function to display books
        })
        .catch((error) => {
            // eslint-disable-next-line no-console
            console.error('Error loading posted books:', error);
        });
}

function search_books(event) {
    event.preventDefault();// Prevent page reload on submit
    const searchInput = document.getElementById('search_box');
    const searchValue = searchInput.value.trim();
    fetch(`/posted_books/search?q=${encodeURIComponent(searchValue)}`) // Sends a GET request to './posted_books/search'
        .then((response) => response.json()) // Converts the response to a JSON object
        .then((data) => { // Once the JSON data is parsed, use it
            // You can now work with the `data` (e.g., populate a list, display content, etc.)
            if (data.length === 0) {
                // eslint-disable-next-line no-console
                console.log('No books found');
                alert('Click "Posted Products" tab to see all products');
                document.getElementById('posted_books_displayer').innerHTML = '<p>No results found.</p>';
            } else {
                load_books(data); // Call your function to display all matching books
            }
        });
}
// eslint-disable-next-line no-unused-vars
function autocomplete_search(fullText) {
    const searchInput = document.getElementById('search_box');
    const displayer = document.getElementById('autocomplete-display');

    const bookTitle = fullText.split('-')[0].trim();

    searchInput.value = bookTitle;
    document.querySelector('#search_btn').click();
    displayer.innerHTML = '';
}

function autocomplete() {
    const searchInput = document.getElementById('search_box');
    const searchValue = searchInput.value.trim();
    const displayer = document.getElementById('autocomplete-display');

    displayer.innerHTML = ''; // Clear previous suggestions

    fetch(`/posted_books/autocomplete?q=${encodeURIComponent(searchValue)}`)
        .then((response) => response.json())
        .then((data) => {
            data.forEach((book) => {
                const bookTitle = book.title || 'No Title Available';
                const bookAuthors = book.author || 'No Author Available';
                const suggestionText = `${bookTitle}-${bookAuthors}`;
                const item = document.createElement('div');
                item.innerHTML = `
                <a onclick="autocomplete_search()" style="text-decoration: none; cursor: pointer;">
                    <p style="margin:10px;font-weight:bold;padding: 3px">
                        ${suggestionText}
                    </p>
                </a>
                `;
                item.onclick = function () {
                    autocomplete_search(suggestionText);
                };
                displayer.appendChild(item);
            });
        });
}


// Call autocomplete on input event
document.getElementById('search_box').addEventListener("input", function (event) {
    autocomplete();
});
// Call search_books on form submit
document.querySelector('#search_btn').addEventListener("click", function (event) {
    search_books(event);
});

document.addEventListener('DOMContentLoaded', () => {
    const postedDiv = document.querySelector('#posted_btn');

    if (!postedDiv) {
        alert('#posted element not found');
        return; // Stop here if no #posted element
    }

    postedDiv.addEventListener('click', () => {
        // Set flag and reload page
        sessionStorage.setItem('clickMySale', 'true');
        window.location.reload();
    });

    // After reload, check flag and simulate click
    if (sessionStorage.getItem('clickMySale') === 'true') {
        sessionStorage.removeItem('clickMySale');
        const mySaleBtn = document.querySelector('#mysale_btn');
        if (mySaleBtn) {
            mySaleBtn.click();
        } else {
            console.warn('#mysale_btn not found after reload');
        }
    }
});


fetch_books_data();
