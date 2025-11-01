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

const vueinst = Vue.createApp({
  data() {
    return {
      username: null,
      linkUrl: '/user.html',
      image_path: "/images/user_profile_photos/Default.jpg"
    };
  },
  methods: {
    async fetchUsername() {
      try {
        const res = await fetch('/get/username', { credentials: 'include' }); // send cookies
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

      } catch (err) {
        console.log('Failed go fetch profile_photo. Error:', err);
      }

    }
    // eslint-disable-next-line linebreak-style
  },
  mounted() {
    this.fetchProfilePhoto();
    this.fetchUsername();
    setInterval(this.fetchUsername, 5000); // refresh the page every 5 seconds
  }
  // eslint-disable-next-line linebreak-style
}).mount('#app');
