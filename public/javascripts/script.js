const container = document.querySelector('.usercontainer');
const registration = document.querySelector('.registration');
const login = document.querySelector('.login_link');
const forgot_password = document.getElementById('forgot_password_link');
const modal = document.getElementById('forgot_modal');
const close = modal.querySelector('.close_button');

registration.addEventListener('click', () => {
    container.classList.add('active');
});

login.addEventListener('click', () => {
    container.classList.remove('active');
});
forgot_password.addEventListener('click', (event) => {
    event.preventDefault();
    modal.style.display = 'flex';
});

close.addEventListener('click', () => {
    modal.style.display = 'none';
});

window.addEventListener('click', (event) => {
    if (event.target === modal) {
        modal.style.display = 'none';
    }
});

