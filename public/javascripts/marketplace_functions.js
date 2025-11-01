function load_books(data) {
    const displayer = document.getElementById('display-container');
    displayer.innerHTML = '';

    data.forEach((book) => {
        const div = document.createElement('div');
        const imageURL = './uploads/' + book.imageFilename;
        const bookTitle = book.title || 'No Title Available';
        const bookAuthors = book.author || 'No Author Available';
        const ISBN = book.isbn || 'No ISBN Available';
        const price = book.price || 'No Price Available';
        const book_condition = book.book_condition || 'No Condition Available';
        const description = book.description || 'No Description Available';

        div.className = "card";
        div.dataset.bookId = book.book_id;

        div.innerHTML = `
            <div id="book_wrapper" style="margin:10px;; text-align: left;display:block">
                <img style="float:left;" src="${imageURL}" alt="Book Image">
                <div id="book_content" style="display:inline-block; width: 60%; margin-left: 10px; text-align: left;">
                    <h2>${bookTitle}</h1>
                    <h4>${bookAuthors}</h3>
                    <p><strong>ISBN:</strong> ${ISBN}</p>
                    <p><strong>Condition:</strong> ${book_condition}</p>
                    <p><strong>Price:</strong> $${price}</p>
                    <p style="text-align:justify;display:inline-block"><strong>Description:</strong></p>
                    <div id="desc" style="text-align:justify" class="description-container">
                        ${description}
                    </div>
                </div>
                <div style="display:inline-block; width: 100%;">
                    <button style="float:right;margin:10px;margin-bottom:20px" class="btn">Add to Cart</button>
                </div>
            </div>
            `;

        div.addEventListener('click', () => {
            const id = div.dataset.bookId;
            window.location.href = `book.html?book_id=${id}`;
        });

        document.getElementById("display-container").scrollIntoView({ behavior: "smooth" });
        displayer.appendChild(div);

    });
}

function books_gallery() {
    fetch('./marketplace')
        .then((response) => response.json())
        .then((data) => {
            load_books(data); // Call the function to display books
        })
        // eslint-disable-next-line no-console
        .catch((err) => console.error('Error fetching books:', err));
}

function search_books(event) {
    event.preventDefault();// Prevent page reload on submit
    const searchInput = document.getElementById('search-box');
    const searchValue = searchInput.value.trim();
    fetch(`/marketplace/search?q=${encodeURIComponent(searchValue)}`) // Sends a GET request to './marketplace'
        .then((response) => response.json()) // Converts the response to a JSON object
        .then((data) => { // Once the JSON data is parsed, use it
            // You can now work with the `data` (e.g., populate a list, display content, etc.)
            if (data.length === 0) {
                // eslint-disable-next-line no-console
                console.log('No books found');
                document.getElementById('display-container').innerHTML = '<p>No results found.</p>';
            } else {
                load_books(data); // Call your function to display all matching books
            }
        });
}

function autocomplete() {
    const searchInput = document.getElementById('search-box');
    const searchValue = searchInput.value.trim();
    const displayer = document.getElementById('autocomplete-display');

    displayer.innerHTML = ''; // Clear previous suggestions

    fetch(`/marketplace/autocomplete?q=${encodeURIComponent(searchValue)}`)
        .then((response) => response.json())
        .then((data) => {
            data.forEach((book) => {
                const bookTitle = book.title || 'No Title Available';
                const bookAuthors = book.author || 'No Author Available';

                const item = document.createElement('div');
                item.innerHTML = `
                <a href="#display-container" onclick="autocomplete_search()" id="book_suggestion" style="text-decoration: none; cursor: pointer;">
                    <p style="margin:10px;font-weight:bold;padding: 3px">
                        ${bookTitle}-${bookAuthors}
                    </p>
                </a>
                `;
                displayer.appendChild(item);
            });
        });
}

// eslint-disable-next-line no-unused-vars
function autocomplete_search() {
    const searchInput = document.getElementById('search-box');
    const displayer = document.getElementById('autocomplete-display');

    const suggestion = document.getElementById('book_suggestion');
    const fullText = suggestion.innerText.trim();
    const bookTitle = fullText.split('-')[0]; // "Book Title"

    searchInput.value = bookTitle;
    document.querySelector('.fa-search').click();
    displayer.innerHTML = '';
    searchInput.innerText = ''; // Clear the input field after selection
    document.getElementById("display-container").scrollIntoView({ behavior: "smooth" });
    document.getElementById('popup-backdrop').click();
}

// Call autocomplete on input event
document.getElementById('search-box').addEventListener("input", function (event) {
    autocomplete();
});
// Call search_books on form submit
document.querySelector('#search-bar').addEventListener("submit", function (event) {
    search_books(event);
});

books_gallery();
