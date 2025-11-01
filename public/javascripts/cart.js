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


function checkout_popup(vueinst) {
  const popup = document.getElementById('pop-up');
  const cancelBtn = popup.querySelector('button:last-of-type');
  const checkout_button = document.querySelectorAll('.checkout-button');
  const confirmButton = popup.querySelector('#confirm_button');

  checkout_button.forEach(button => {
    button.addEventListener('click', () => {
      popup.style.display = 'flex';
    });
  });

  cancelBtn.addEventListener('click', (e) => {
    e.preventDefault();
    popup.style.display = 'none';
  });

  confirmButton.addEventListener('click', async (e) => {
    e.preventDefault();
    const checkboxes = document.querySelectorAll('.cart-checkbox');
    var selected_book = [];

    checkboxes.forEach((checkbox) => {
      if (checkbox.checked) {
        const item_div = checkbox.closest('.items');
        selected_book.push(item_div.dataset.bookID);
      }
    });

    console.log(selected_book);

    if (selected_book.length === 0) {
      alert('No book is selected');
      return;
    }

    try {
      const response = await fetch('/users/purchase', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({ bookIDs: selected_book })
      });

      if (response.ok) {
        checkboxes.forEach((checkbox) => {
          if (checkbox.checked) {
            const itemDiv = checkbox.closest('.items');
            itemDiv.remove();
            vueinst.calculate_price();
          }
        });
        alert('Purchase successful!');
        popup.style.display = 'none';
      }

      else if (!response.ok) {
        alert('Failed to purchase selected items.');
      }
    }
    catch (err) {
      console.log(err);
      console.error('Error processing purchase:', err);
      alert('An error occurred during purchase.');
    }
  });
}

function checkbox(vueinst) {
  const select_allcheckbox = document.getElementById('select-all');
  const indiviudal_checkbox = document.querySelectorAll('.cart-checkbox');

  const update = () => vueinst.calculate_price();

  //The event listener change will recalculates the total price every time tick or untick an item checkbox
  select_allcheckbox.addEventListener('change', function () {
    const isChecked = select_allcheckbox.checked;
    indiviudal_checkbox.forEach((checkbox) => {
      checkbox.checked = isChecked;
    });
    update();
  });

  indiviudal_checkbox.forEach((checkbox) => {
    checkbox.addEventListener('change', update);
  });
}

document.addEventListener('DOMContentLoaded', async () => {
  const itemsContainer = document.getElementById('items_list');

  try {
    const res = await fetch('/cart/items', {
      credentials: 'include'
    });

    const items = await res.json();
    itemsContainer.innerHTML = '';

    items.forEach(item => {
      const div = document.createElement('div');
      div.dataset.bookID = item.book_id;
      div.dataset.sellerID = item.user_id;
      div.className = 'items';

      div.innerHTML += `
          <div class="checkbox">
            <input type="checkbox" class="cart-checkbox">
          </div>
          <div class="item-image">
            <img src="/uploads/${item.imageFilename}" alt="Book Cover" class="item-image" />
            <h3>Title: ${item.title}</h3>
          </div>
          <div class="item-details">
            <p><strong>Author:</strong> ${item.author}</p>
            <p><strong>Condition:</strong> ${item.book_condition}</p>
            <p><strong>Price:</strong><span class="item-price"> $${item.price}</span></p>
            <p><strong>Description:</strong> ${item.description}</p>
          </div>
          <div class="button-class">
            <button class="delete" type="button">Delete</button>
          </div>
      `;

      itemsContainer.appendChild(div);

      const deleteBtn = div.querySelector('.delete');
      deleteBtn.addEventListener('click', async () => {
        const bookID = div.dataset.bookID;

        try {
          const response = await fetch('/users/delete_cart', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            credentials: 'include',
            body: JSON.stringify({ book_id: bookID })
          });

          if (response.ok) {
            div.remove();
            vueinst.calculate_price(); // update the price
          } else {
            alert('Failed to delete item from cart.');
          }
        } catch (error) {
          console.error('Error deleting item:', error);
          alert(error);
        }
      });


    });








    const vueinst = Vue.createApp({
      data() {
        return {
          totalprice: '$0.00'
        };
      },
      methods: {
        async calculate_price() {
          let total = 0;
          const checkboxes = document.querySelectorAll('.cart-checkbox');
          checkboxes.forEach((checkbox) => {
            if (checkbox.checked) {
              const itemDiv = checkbox.closest('.items');
              const priceText = itemDiv.querySelector('.item-price').textContent.trim();
              const price = parseFloat(priceText.replace(/[^0-9.]/g, ''));
              total += price;
            }
          });
          this.totalprice = `$${total.toFixed(2)}`;
        }
      }
    }).mount('#vue_display_price');
    checkbox(vueinst);
    checkout_popup(vueinst);

  } catch (err) {
    console.error('Error loading cart items:', err);
    itemsContainer.innerHTML = '<p style="color:red;">Failed to load cart items.</p>';
  }
});