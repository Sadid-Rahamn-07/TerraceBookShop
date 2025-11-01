function setupToggleButtons() {
    const container = document.querySelector('.usercontainer');
    const registration = document.querySelector('.registration');
    const login = document.querySelector('.login_link');
    // const forgot_password = document.getElementById('forgot_password_link');
    // const modal = document.getElementById('forgot_modal');
    // const close = modal.querySelector('.close_button');

    registration.addEventListener('click', () => {
        container.classList.add('active');
    });

    login.addEventListener('click', () => {
        container.classList.remove('active');
    });

    // forgot_password.addEventListener('click', (event) => {
    //     event.preventDefault();
    //     modal.style.display = 'flex';
    // });

    // close.addEventListener('click', () => {
    //     modal.style.display = 'none';
    // });

    // window.addEventListener('click', (event) => {
    //     if (event.target === modal) {
    //         modal.style.display = 'none';
    //     }
    // });

    }


function LoginCheck() {
    var xhttp = new XMLHttpRequest();


    xhttp.onreadystatechange = function () {

        if (this.readyState === 4) {

            if (this.status === 200) {
                // Successfully logged in and go to the main page
                window.location.href = 'index.html';
            } else if (this.status === 401) {
                // Wrong password
                alert('Incorrect password');
            } else if (this.status === 404) {
                // User not found
                alert('User not found');
            }
            else {
                // Other server errors
                alert("Server error: " + this.status);
            }
        }
    };

    var loginForm = document.getElementById("loginForm");
    var username = loginForm.querySelector('input[placeholder="Username"]').value;
    var password = loginForm.querySelector('input[placeholder="Password"]').value;

    xhttp.open("POST", "/users/login", true);
    xhttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    xhttp.send("username=" + encodeURIComponent(username) + "&password=" + encodeURIComponent(password));
}

function registeration() {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState === 4) {
            if (this.status === 201) {
                alert('Registration successful');
                window.location.href = 'index.html';
            }
            else if (this.status === 400) {
                alert('fill all required fields');
            }
            else if (this.status === 500) {
                alert('Internal server error');
            }
            else if (this.status === 409) {
                // User not found
                alert('User already exist');
            }
            else {
                alert('Other error' + this);
            }
        }
    };
    var registerForm = document.getElementById("registerForm");
    var username = registerForm.querySelector('input[placeholder="Username"]').value;
    var email = registerForm.querySelector('input[placeholder="Email"]').value;
    var password = registerForm.querySelector('input[placeholder="Password"]').value;
    xhttp.open("POST", "/users/reg", true);
    xhttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    xhttp.send("username=" + encodeURIComponent(username) + "&email=" + encodeURIComponent(email) + "&password=" + encodeURIComponent(password));
}

window.addEventListener('load', function () {
    setupToggleButtons();
    document.getElementById("loginForm").addEventListener("submit", function (event) {
        event.preventDefault();
        LoginCheck();
    });
    document.getElementById("registerForm").addEventListener("submit", function (event) {
        event.preventDefault();
        registeration();
    });
});