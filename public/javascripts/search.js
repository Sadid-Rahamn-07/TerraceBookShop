function truncate(str, maxLen) {
    return (str.length > maxLen) ? str.slice(0, maxLen) + '…' : str;
}


function Autocomplete() {
    const searchInput = document.getElementById('search-box');
    const searchValue = searchInput.value.trim();
    var displayer = document.getElementById('autocomplete-display');

    if (!searchValue) {
        displayer.innerHTML = '';
        return;
    }

    var xhttp = new XMLHttpRequest();

    xhttp.onreadystatechange = function () {
        if (this.readyState === 4 && this.status === 200) {
            const books = JSON.parse(this.responseText);
            displayer.innerHTML = '';

            books.forEach((book) => {
                var bookTitle = (book.volumeInfo.title) ? book.volumeInfo.title : 'No Title Available';
                var bookAuthors = (book.volumeInfo.authors) ? book.volumeInfo.authors : 'No Author Available';

                bookTitle = truncate(bookTitle, bookTitle.length);
                bookAuthors = truncate(bookAuthors, bookAuthors.length);

                var item = document.createElement('div');
                item.innerHTML = `
                    <a href="#display-container" onclick="autocomplete_search()" id="book_suggestion" style="text-decoration: none; cursor: pointer;"><p style="margin:10px;font-weight:bold;padding: 3px">${bookTitle}-${bookAuthors}</p></a>
                `;
                displayer.appendChild(item);
            });
        }
    };


    xhttp.open('GET', 'search/autocomplete?value=' + encodeURIComponent(searchValue), true);
    xhttp.send();

}

// eslint-disable-next-line no-unused-vars
function autocomplete_search() {
    const searchInput = document.getElementById('search-box');
    const x = document.getElementById('book_suggestion');
    const y = document.getElementById('autocomplete-display');
    searchInput.value = x.innerText.trim();
    document.querySelector('.fa-search').click();
    y.innerHTML = '';
}

document.querySelector('#search-bar').addEventListener("submit", function (event) {
    event.preventDefault();
    Search();
});

document.querySelector('#search-box').addEventListener("input", function (event) {
    event.preventDefault();
    Autocomplete();
});

