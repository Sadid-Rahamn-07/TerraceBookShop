document.addEventListener('DOMContentLoaded', () => {
  const sidebar_menu = document.querySelectorAll('.sidenav a');
  const main_area = document.querySelectorAll('.content');
  const select_image = document.getElementById('image');
  const image_preview_popup = document.getElementById('imagePreviewPopup');
  const preview_image = document.getElementById('previewImage');
  const select_current_image = document.getElementById('selectImageButton');
  const discard_image = document.getElementById('unselectImageButton');
  const select_date = document.getElementById('date');
  const select_month = document.getElementById('month');
  const select_year = document.getElementById('year');

  // show specific section
  function show_specific_section(section_name) {
    main_area.forEach((section) => {
      // holding section style into a local variable
      const sectionStyle = section.style;
      if (sectionStyle) {
        sectionStyle.display = 'none';
      }
    });

    const target_section = document.getElementById(section_name);
    if (target_section) {
      target_section.style.display = 'block';
    }

    if (section_name === 'myPurchase') {
      const tab_mypurchase_area = document.querySelector('#myPurchase .tab button:first-child');
      if (tab_mypurchase_area) {
        //   selects the first button of myPurchase and makes it active
        tab_mypurchase_area.click();
      }

    } else if (section_name === 'notification') {

      const tab_mypurchase_area = document.querySelector('#notification .tab button:first-child');
      if (tab_mypurchase_area) {
        //   selects the first button of notification  as active
        tab_mypurchase_area.click();
      }
    }
  }
  // event is attached to elements with class name tablinks and id of the container
  function tab_navigation(container_id, event) {
    const container_tab = document.getElementById(container_id);
    if (!container_tab) return;

    // hides all the content from the class tabcontent for the previous option
    const content_of_tabs = container_tab.getElementsByClassName("tabcontent");
    for (let i = 0; i < content_of_tabs.length; i++) {
      content_of_tabs[i].style.display = "none";
    }

    // gets all the buttons / options with classname tablinks
    const link_of_tabs = container_tab.getElementsByClassName("tablinks");

    //   changes all the status of all the buttons by changing the classname
    for (let i = 0; i < link_of_tabs.length; i++) {
      link_of_tabs[i].className = link_of_tabs[i].className.replace(" active", "");
    }

    // active the classes those were blocked
    const { dataset } = event.currentTarget;
    const targetTab = document.getElementById(dataset.tab);
    if (targetTab) {
      targetTab.style.display = "block";
      event.currentTarget.classList.add("active");
    }

  }


  function highlight_sidebar_menu(clickedLink) {
    sidebar_menu.forEach((link) => {
      link.classList.remove('active');
    });
    clickedLink.classList.add('active');
  }

  // Event listeners for side navigation tab
  sidebar_menu.forEach((link) => {
    link.addEventListener('click', (event) => {
      // This will let the wishlist nav bar go to the wishlist.html
      if (event.currentTarget.dataset.target === 'Wishlist') {
        return;
      }
      // This will let the mypurchase nav bar go to the mypurchase.html
      if (event.currentTarget.dataset.target === 'myPurchase') {
        return;
      }
      event.preventDefault();
      show_specific_section(event.currentTarget.dataset.target);
      highlight_sidebar_menu(event.currentTarget);

    });
  });

  // Event listeners for purchase tab
  const purchase_tab = document.querySelectorAll('#myPurchase .tablinks');
  purchase_tab.forEach((tab) => {
    tab.addEventListener('click', (event) => {
      tab_navigation('myPurchase', event);
    });
  });

  // Event listeners for notification tab
  const notification_tab = document.querySelectorAll('#notification .tablinks');
  notification_tab.forEach((tab) => {
    tab.addEventListener('click', (event) => {
      tab_navigation('notification', event);
    });
  });


  // Ensure the imageInput element exists before attaching the listener
  if (select_image) {
    select_image.addEventListener('change', function () {
      const file = this.files[0];
      if (file) {
        // selected_photo = file;

        //   using JS filehandling library
        const read_selected_file = new FileReader();
        // loading the files from desktop
        read_selected_file.onload = function (e) {
          // getting the location of the image
          preview_image.src = e.target.result;
          // displaying the image
          image_preview_popup.style.display = 'flex';
        };
        read_selected_file.readAsDataURL(file);
      } else {
        image_preview_popup.style.display = 'none';
      }
    });
  }

  // Event listener for select image
  if (select_current_image) {
    select_current_image.addEventListener('click', function () {
      image_preview_popup.style.display = 'none';
    });
  }

  // Event listener for unselect
  if (discard_image) {
    discard_image.addEventListener('click', function () {
      if (select_image) {
        select_image.value = '';
      }
      image_preview_popup.style.display = 'none';
    });
  }


  // generate month
  const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  select_month.innerHTML = '<option value=" ">Month</option>';
  months.forEach((month, index) => {
    select_month.add(new Option(month, index + 1));
  });
  // generate year
  const current_year = new Date().getFullYear();
  let year = current_year;
  select_year.innerHTML = '<option value=" ">Year</option>';
  for (current_year; year >= current_year - 80; year--) {
    select_year.add(new Option(year, year));
  }
  // update date value based on year
  function update_day() {
    const user_selected_month = parseInt(select_month.value, 10);
    const user_selected_year = parseInt(select_year.value, 10);
    let max_days_in_month = 31;

    if ((user_selected_year) && user_selected_month >= 1) {
      max_days_in_month = new Date(user_selected_year, user_selected_month, 0).getDate();
    }
    // generate date based on month and year
    select_date.innerHTML = '<option value =" ">Date</option>';
    let date = 1;
    for (date; date <= max_days_in_month; date++) {
      select_date.add(new Option(date, date));
    }
  }

  update_day();
  select_month.addEventListener('change', update_day);
  select_year.addEventListener('change', update_day);

  show_specific_section('myAccount');
});

function logout() {
  fetch('/users/logout', {
    method: 'POST',
    credentials: 'include'
  })
    .then(function (res) {
      if (res.status === 200) {
        window.location.href = '/';
      } else {

        // eslint-disable-next-line no-alert

        alert('Logout failed');
      }
    });
}


const logoutButton = document.querySelector('.logout_button');
if (logoutButton) {
  logoutButton.addEventListener('click', function (event) {
    event.preventDefault();
    logout();
  });
}

document.addEventListener('DOMContentLoaded', async function get_information() {
  try {
    const res = await fetch('/users/userinformation', { credentials: 'include' });
    console.log("Response status:", res.status);
    console.log("Response headers:", res.headers);
    const data = await res.json();
    document.getElementById('name').value = data.username;

    document.getElementById('address').value = data.address;
    document.getElementById('email').value = data.email;
    document.getElementById('phone').value = data.phone_number;
    if (data.gender) {
      const genderInput = document.querySelector(`input[name="gender"][value="${data.gender}"]`);
      if (genderInput) {
        genderInput.checked = true;
      }
    }
    if (data.dateofBirth) {
      const [year, month, day] = data.dateofBirth.split('-');
      document.getElementById('year').value = parseInt(year);
      document.getElementById('month').value = parseInt(month);
      document.getElementById('date').value = parseInt(day);
    }
    if (data.profile_image) {
      document.getElementById('currentProfileImage').src = data.profile_image;
    }
  } catch (err) {
    alert(err);
  }
});

document.addEventListener('DOMContentLoaded', () => {
  const save_button = document.getElementById('update');

  if (save_button) {
    save_button.addEventListener('click', async function update(event) {
      event.preventDefault();

      const name = document.getElementById('name').value;
      const address = document.getElementById('address').value;
      const email = document.getElementById('email').value;
      const phone = document.getElementById('phone').value;
      const gender = document.querySelector('input[name="gender"]:checked').value;
      const date = document.getElementById('date').value;
      const month = document.getElementById('month').value;
      const year = document.getElementById('year').value;
      const dateofbirth = `${year}-${String(month).padStart(2, '0')}-${String(date).padStart(2, '0')}`;
      const imageFile = document.getElementById('image').files[0];
      const formData = new FormData();
      formData.append('name', name);
      formData.append('address', address);
      formData.append('email', email);
      formData.append('phone', phone);
      formData.append('gender', gender);
      formData.append('dateofbirth', dateofbirth);
      if (imageFile) {
        formData.append('profile_photo', imageFile);
      }

      try {
        const response = await fetch('/users/informationUpdate', {
          method: 'PUT',
          body: formData,
          credentials: 'include'
          // Dont set Content-Type manually fetch handles it
        });

        if (response.ok) {
          alert('Information updated successfully');
          window.location.reload();

        } else {
          const errText = await response.text();
          alert('Something went wrong: ' + errText);
        }

      } catch (err) {
        // console.log(err);
        alert(err);
      }
    });
  }
});
// click mySale tab from purchase.html
window.addEventListener('DOMContentLoaded', () => {
  if (window.location.hash === '#clickButton') {
    // Simulate a click after page is ready
    const button = document.getElementById('mysale_btn');
    if (button) {
      button.click();
    }
  }
  history.replaceState(null, null, window.location.pathname);
});


// This will handle posted and post a new book section
const {
  createApp
  // eslint-disable-next-line no-undef
} = Vue;

createApp({
  data() {
    return {
      sale_tab: 'posted',
      showBookForm: false,
      bookDetails: {
        title: '',
        author: '',
        isbn: '',
        price: null,
        condition: '',
        description: '',
        image: '',
        selectedFile: null
      }
    };
  },
  methods: {
    setActiveTab(tab_name) {
      this.sale_tab = tab_name;
    },
    onFileChange(event) {
      // eslint-disable-next-line prefer-destructuring
      this.selectedFile = event.target.files[0];
    },
    async submitBook() {
      try {
        const formData = new FormData();
        // Append other book details (title, price, etc.)
        // eslint-disable-next-line guard-for-in
        for (const key in this.bookDetails) {
          formData.append(key, this.bookDetails[key]);
        }
        // Append the image file
        formData.append('image', this.selectedFile);

        const response = await fetch('/post_book', {
          method: 'POST',
          credentials: 'include',
          body: formData// Note: no 'Content-Type' header here
        });

        this.bookDetails = {
          title: '',
          author: '',
          isbn: '',
          price: '',
          condition: '',
          description: '',
          image: ''
        };
        this.selectedFile = null; // Reset the selected file
        this.$refs.fileInput.value = ''; // This resets the file input so no file is selected visually
        if (!response.ok) throw new Error('Server error');
        const msg = await response.text();
        // eslint-disable-next-line no-alert
        alert(msg); // better notification can be used here
      } catch (err) {
        // eslint-disable-next-line no-console
        console.error(err);
        // alert(err);
        // eslint-disable-next-line no-alert
        alert('Failed to submit book.');
      }
    },
    async fetchPostedBooks() {
      try {
        const response = await fetch('/posted_books', {
          method: 'GET',
          credentials: 'include'
        });
        if (!response.ok) throw new Error('Server error');

      } catch (err) {
        // eslint-disable-next-line no-console
        console.error(err);
        // eslint-disable-next-line no-alert
        alert('Failed to fetch posted books + ' + err);
      }
    },
    setTab(tabName) {
      // If clicking the same tab again, and it's 'posted', re-fetch
      if (this.sale_tab === tabName && tabName === 'posted') {
        this.fetchPostedBooks();
      }
      this.sale_tab = tabName;
    }
  },
  watch: {
    sale_tab(newTab) {
      if (newTab === 'posted') {
        this.fetchPostedBooks(); // Fetch posted books when the tab is switched
      }
    }
  },
  mounted() {
    // Fetch posted books on initial load if the default tab is 'posted'
    if (this.sale_tab === 'posted') {
      this.fetchPostedBooks();
    }
  }
}).mount('#my_sale');

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

).mount('#app');