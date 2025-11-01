const {
    createApp
} = Vue;

createApp({
    data(){
        return { wishlist_tab: 'current' };
    },
    methods: {
        reloadPage(tabName){
            this.wishlist_tab = tabName;
            //This is temporary for reloading the page when changing between current wishlist and adding new book to wishlist
            if(this.wishlist_tab === 'current'){
                window.location.reload();
            }
        }
    }
}).mount('#Wishlist');

function truncate(str, maxLen) {
    return (str.length > maxLen) ? str.slice(0, maxLen) + '…' : str;
}

function External_Search() {
    const searchInput = document.getElementById('wishlist_search');
    const searchValue = searchInput.value.trim();

    var xhttp = new XMLHttpRequest();

    xhttp.onreadystatechange = function () {
        if (this.readyState === 4 && this.status === 200) {
            const books = JSON.parse(this.responseText);
            // const books = data.items;
            const displayer = document.getElementById('search_display_container');
            displayer.innerHTML = '';

            books.forEach((book) => {
                var div = document.createElement('div');

                var ImageURL = (book.volumeInfo.imageLinks && book.volumeInfo.imageLinks.thumbnail)
                    ? book.volumeInfo.imageLinks.thumbnail : 'images/logo.png';
                var bookTitle = (book.volumeInfo.title) ? book.volumeInfo.title : 'No Title Available';
                var bookAuthors = (book.volumeInfo.authors) ? book.volumeInfo.authors : 'No Author Available';

                bookTitle = truncate(bookTitle, bookTitle.length);
                bookAuthors = truncate(bookAuthors, bookAuthors.length);

                div.className = "card";
                div.id = 'book_card';
                div.innerHTML = `
                        <div id="book_wrapper" style="text-align: left;display:block">
                            <div width="100px" height="auto" style="float:left; margin-right:10px;">
                                <img height="150px" width="100px" style="float:left;" src="${ImageURL}" alt="Book Image">
                            </div>
                            <div id="book_content" style="text-align: left;">
                                <h2>${bookTitle}</h1>
                                <h3>${bookAuthors}</h3>
                            </div>
                            <div class="bottom-right_autocomplete" style="float:right;">
                                <button class="btn" onclick="window.open('${book.volumeInfo.infoLink}', '_blank')">View Book</button>
                                <button class="btn" id='add_to_wishlist_button'>Add to Wishlist</button>
                            </div>
                        </div>
                        <br>
                        <br>
                        <br>
                        <br>
                        <br>
                        <br>
                        <br>
                        <hr>
                        <br>
                    `;

                displayer.appendChild(div);
                document.getElementById("search_display_container").scrollIntoView({ behavior: "smooth" });

                div.querySelector('#add_to_wishlist_button').addEventListener('click', () => {
                    Wishlist_Add(div, book.id);
                });
            });
        }
    };

    xhttp.open('GET', '/search?title=' + encodeURIComponent(searchValue), true);
    xhttp.send();
}


function Wishlist_Add(htmlDiv, book_id){
    const bookTitle = htmlDiv.querySelector('#book_content h2').textContent;
    const authorName = htmlDiv.querySelector('#book_content h3').textContent;

    const imageURL = htmlDiv.querySelector('img').src;

    var xhttp = new XMLHttpRequest();

    xhttp.onreadystatechange = function (){
        if(this.status === 400){
            alert('Already in the wishlist');
        }
        if(this.status === 200 && this.readyState === 4){
            alert('Added to the wishlist');
        }
    }

    xhttp.open('POST', '/users/wishlist_add', true);
    xhttp.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    xhttp.send("booktitle=" + encodeURIComponent(bookTitle) + "&authorname=" + encodeURIComponent(authorName) + "&image="+ encodeURIComponent(imageURL) + "&bookid=" + encodeURIComponent(book_id));
}

function Wishlist_Delete(htmlDiv, book){
    var xhttp = new XMLHttpRequest();

    xhttp.onreadystatechange = function (){
        if(this.readyState === 4 && this.status === 200){
            htmlDiv.innerHTML = ``;
            document.getElementById("shown_display_container").scrollIntoView({ behavior: "smooth" });
            alert('Deleted the wishlist book');
            Wishlist_Show();
        }

        if(this.status === 400){
            return;
        }

    }
    xhttp.open('POST', '/users/wishlist_delete', true);
    xhttp.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    xhttp.send("bookid=" + encodeURIComponent(book.external_book_id));
}

function Wishlist_Show(){
    var xhttp = new XMLHttpRequest();

    var displayer = document.getElementById('shown_display_container');

    xhttp.onreadystatechange = function () {
        if (this.readyState === 4 && this.status === 200) {
            console.log(this.responseText);

            const books = JSON.parse(this.responseText);


            if(books.length === 0){
                var div = document.createElement('div');
                div.className = "card";
                div.id = 'book_card';
                div.innerHTML = `
                        <h3 style="text-align : center ;">Empty Wishlist</h3>
                    `;
                displayer.appendChild(div);
                return;
            }


            books.forEach((book) => {
                var div = document.createElement('div');
                var bookName = (book.book_title) ? book.book_title : 'No Title Available';
                var authorName = (book.author_name) ? book.author_name : 'No Author Available';
                var ImageURL = (book.thumbnail_url) ? book.thumbnail_url : 'images/logo.png';

                bookName = truncate(bookName, bookName.length);
                authorName = truncate(authorName, authorName.length);

                div.className = "book-item";

                div.innerHTML = `
                        <div id="book_wrapper" style="text-align: left;display:block">
                            <div width="100px" height="auto" style="float:left; margin-right:10px;">
                                <img height="150px" width="100px" style="float:left;" src="${ImageURL}" alt="Book Image">
                            </div>
                            <div id="book_content" style="text-align: left;">
                                <h2>${bookName}</h1>
                                <h4>${authorName}</h3>
                            </div>
                            <div class="bottom-right_autocomplete" style="float:right;">
                                <button class="btn" id='delete_from_wishlist_button'>Delete Book</button>
                            </div>
                        </div>
                        <br>
                        <br>
                        <br>
                        <br>
                        <br>
                        <br>
                        <br>
                        <hr>
                        <br>
                    `;

                displayer.appendChild(div);
                document.getElementById("shown_display_container").scrollIntoView({ behavior: "smooth" });

                div.querySelector('#delete_from_wishlist_button').addEventListener('click', () => {
                    Wishlist_Delete(div, book);
                    window.location.reload();
                });
            });
        }
    };
    xhttp.open('GET','/users/wishlist_show', true);
    xhttp.send();
}

document.addEventListener('DOMContentLoaded', () => {
    Wishlist_Show();
});

document.querySelector('#wishlist_search + button').addEventListener('click', () => {
    External_Search();
});
