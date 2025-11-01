/* eslint-disable linebreak-style */
function toggleMenu() {
  const nav = document.getElementById("navLinks");
  const menu_ico = document.querySelector(".menu-icon");
  nav.classList.toggle("show");
  menu_ico.innerText = nav.classList.contains("show") ? "✖" : "☰";
}
// changing navbar active status
document.addEventListener('DOMContentLoaded', () => {
  const links = document.querySelectorAll('.nav-item');

  links.forEach((link) => {
    link.addEventListener('click', () => {
      links.forEach((l) => l.classList.remove('active'));
      link.classList.add('active');
    });
  });
});
function showPopup() {
  document.getElementById('popup-backdrop').style.display = 'block';
  document.getElementById('autocomplete-display').style.display = 'block';
  document.body.style.overflow = 'hidden'; // prevent background scrolling
}

function hidePopup() {
  document.getElementById('popup-backdrop').style.display = 'none';
  document.getElementById('autocomplete-display').style.display = 'none';
  document.body.style.overflow = ''; // restore scrolling
}

window.addEventListener('scroll', function () {
  const navbar = document.getElementById('navi');
  const logo = document.getElementById('brand_logo');
  if (window.scrollY > 50) {
    navbar.classList.add('scrolled');
    logo.style.display = 'none';
  } else {
    navbar.classList.remove('scrolled');
    logo.style.display = 'block';
  }
});


const { createApp } = Vue;
createApp({
  data() {
    return {
      reviews: [],
      limit: 5,
      show_more: false
    };
  },

  mounted() {
    const params = new URLSearchParams(window.location.search);
    const bookID = params.get("book_id");
    console.log(bookID);
    fetch(`/public_reviews?book_id=${bookID}`)
      .then((res) => {
        if (!res.ok) throw new Error("No reviews");
        return res.json();
      })
      .then((reviews) => {
        console.log(reviews);
        this.reviews = reviews;
      })
      .catch(error => {
        console.error("Error loading reviews:", error);
        alert("Unable to load reviews");
      });
  },

  computed: {
    visibleReviews() {
      return this.reviews.slice(0, this.limit);
    }
  },

  methods: {
    showMore() {
      if (this.limit + 5 < this.reviews.length) {
        this.limit += 5;
      } else {
        this.limit = this.reviews.length;
      }
    },
    showLess() {
      if (this.limit - 5 >= 5) {
        this.limit -= 5;
      } else {
        this.limit = 5;
      }
    },
  }
}).mount('#page');

const vueinst = Vue.createApp({
  data() {
    return {
      username: null,
      linkUrl: '/user.html',
      image_path: "/images/user_profile_photos/Default.jpg",
    };
  },
  methods: {
    async fetchUsername() {
      try {
        const res = await fetch('/get/username', { credentials: 'include' }); //send cookies
        const session = await res.json();
        this.username = session.username;

        if (this.username) {
          this.linkUrl = '/account.html';
        } else {
          this.linkUrl = '/user.html';
        }
      } catch (err) {
        console.log('Failed to fetch username. Error:', err);
        this.username = null;
        this.linkUrl = '/user.html';
      }
    },

    async fetchUsername() {
      try {
        const res = await fetch('/get/username', { credentials: 'include' }); //send cookies
        const session = await res.json();
        this.username = session.username;

        if (this.username) {
          this.linkUrl = '/account.html';
        } else {
          this.linkUrl = '/user.html';
        }
      } catch (err) {
        console.log('Failed to fetch username. Error:', err);
        this.username = null;
        this.linkUrl = '/user.html';
      }
    },

    async fetchProfilePhoto() {
      try {
        const res = await fetch("/users/profileImage", { credentials: 'include' });
        this.image_path = (await res.json()).profile_image;

      }
      catch (err) {
        console.log('Failed go fetch profile_photo. Error:', err);
      }

    }

  },
  mounted() {
    this.fetchProfilePhoto();
    this.fetchUsername();
    setInterval(this.fetchUsername, 5000); // refresh the page every 5 seconds
  }
}

).mount('.header');

function truncate(str, maxLen) {
  return (str.length > maxLen) ? str.slice(0, maxLen) + '…' : str;
}

document.addEventListener('DOMContentLoaded', () => {
  const params = new URLSearchParams(window.location.search);
  const bookId = params.get("book_id");

  if (!bookId) {
    alert("No book ID provided in URL.");
    return;
  }

  fetch(`users/local_books?book_id=${bookId}`)
    .then(res => {
      if (!res.ok) throw new Error("Book not found");
      return res.json();
    })
    .then(book => {
      document.getElementById('book_image').src = 'uploads/' + book.imageFilename || 'images/logo.jpg';
      document.getElementById('book_title').querySelector('h1').textContent = book.title;
      document.getElementById('book_author').querySelector('p').textContent = book.author;
      document.getElementById('posted_date').querySelector('span').textContent = book.created_at.split('T')[0];
      document.getElementById('book_condition').querySelector('span').textContent = book.book_condition;

      document.querySelectorAll('.seller_name span').forEach((tag) => {
        tag.textContent = book.seller_name || 'Unknown';
      });

      document.getElementById('book_description').querySelector('p').textContent = truncate(book.description, 300);
      document.getElementById('book_price').querySelector('h1').textContent = book.price + ' AUD';
    })
    .catch(error => {
      console.error("Error loading book:", error);
      alert("Unable to load book data.");
    });

});

document.addEventListener('DOMContentLoaded', () => {
  document.getElementById("cart_add").addEventListener("click", async function () {
    const params = new URLSearchParams(window.location.search);
    const bookId = params.get("book_id");
    try {
      const response = await fetch("/cart/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        credentials: 'include',
        body: JSON.stringify({ book_id: bookId })
      });

      if (response.redirected) {
        // Server responded with redirect, navigate to that URL
        window.location.href = response.url;
        return;
      }

      if (response.ok) {
        alert("Book added to cart!");
      } else {
        alert("Failed to add to cart");
      }
    } catch (error) {
      console.error("Error adding to cart:", error);
      alert("An error occurred. Please try again.");
    }
  });
});
