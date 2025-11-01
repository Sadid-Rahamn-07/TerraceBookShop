const { createApp } = Vue;

createApp({
    data() {
        return {
            current_view: 'dashboard',
            users: [],
            new_user: {
                id: null,
                username: '',
                email: '',
                phone_number: '',
                address: '',
                profile_image: '',
                password: ''
            },
            editing_user: null,
            show_user_form_modal: false
        };
    },
    //For showing all the users
    mounted(){
        fetch('admin/show_users')
            .then((res) => {
                if (!res.ok) throw new Error("Users not found");
                return res.json();
            })
            .then((users) => {
                this.users = users;
            })
            .catch((err) => {
                console.error("Can't load users data", err);
                alert("Unable to load users data");
            });
    },

    methods: {
        // this part for user managemnet
        open_user_form_modal(user) {
            this.editing_user = user;
            this.reset_new_user_form();
            this.show_user_form_modal = true;
        },
        add_user_modal(){
            this.editing_user = null;
            this.reset_new_user_form();
            this.show_user_form_modal = true;
        },
        close_user_form_modal() {
            this.show_user_form_modal = false;
            this.editing_user = null;
            this.reset_new_user_form();
        },

        save_user() {
            if (this.editing_user){
                const formData = {
                    id: this.new_user.id,
                    username: this.new_user.username,
                    email: this.new_user.email,
                    phone_number: this.new_user.phone_number,
                    address: this.new_user.address
                };

                fetch('admin/update_user', {
                    method: 'POST',
                    credentials: 'include',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(formData)
                })
                .then((res) => {
                    if (!res.ok) throw new Error('Failed to update user');
                    return res.json();
                })
                .then((updatedUser) => {
                    const i = this.users.findIndex(u => u.id === updatedUser.id);
                    if (i !== -1) this.users[i] = updatedUser;
                    alert('User updated successfully!');
                    this.close_user_form_modal();
                })
                .catch(err => {
                    console.error('Error updating user:', err);
                    alert('Failed to update user');
                });
            }
            else{
                const user = {
                    username: this.new_user.username,
                    email:    this.new_user.email,
                    password: this.new_user.password
                };

                fetch('/admin/add_user', {
                    method: 'POST',
                    credentials:'include',
                    headers: {'Content-Type':'application/json'},
                    body: JSON.stringify(user)
                })
                    .then(res => {
                        if (!res.ok) throw new Error('add failed');
                        return res.json();
                    })
                    .then(newUser => {
                        this.users.push(newUser);
                        alert('User added successfully!');
                        this.close_user_form_modal();
                    })
                    .catch(err => {
                        console.error('Error adding user:', err);
                        alert('Failed to add user');
                    });
            }
        },

        // edit user information and save it
        edit_user(user) {
            this.editing_user = user;
            // show the current data of user
            this.new_user = JSON.parse(JSON.stringify(user));
            this.show_user_form_modal = true;
        },

        // remove user
        remove_user(userId) {
            const index = this.users.findIndex((user) => user.id === userId);

            if(index){
                fetch('admin/delete_user', {
                    method: 'POST',
                    credentials: 'include',
                    headers: {'Content-Type': 'application/json'},
                    body: JSON.stringify({ userId })
                })
                    .then((res) => {
                        if (!res.ok) throw new Error("Can't delete user");
                        return res.json();
                    })
                    .then((users) => {
                        this.users = users;
                        alert('Deleted a user');
                    })
                    .catch((err) => {
                        console.error("Can't delete user", err);
                        alert("Unable to delete user");
                    });
            }
        },

        reset_avatar() {
            if (!this.editing_user) return;

            fetch('admin/reset_avatar', {
                method: 'POST',
                credentials: 'include',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id: this.editing_user.id })
            })
                .then(res => {
                    if (!res.ok) throw new Error("Failed to reset avatar");
                    return res.json();
                })
                .then((users) => {
                    this.new_user.profile_image = users.profile_image;
                    const index = this.users.findIndex(u => u.id === users.id);
                    if (index !== -1) {
                        this.users[index] = users;
                    }
                    alert('User profile photo is reset');
                })
                .catch(err => {
                    console.error("Error resetting avatar:", err);
                    alert("Failed to reset profile image");
                });
        },

        reset_new_user_form() {
            this.new_user = {
                id: null,
                username: '',
                email: '',
                phone_number: '',
                address: '',
                profile_image: '',
                password: ''
            };
        },
        // this function is just to show topic of the each page in heading
        capitalize(value) {
            if (!value) return '';
            const strvalue = value.toString();
            return strvalue.charAt(0).toUpperCase() + strvalue.slice(1);
        }

    }
}).mount('#app');