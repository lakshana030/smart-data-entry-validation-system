// ===============================
// FRONTEND STATE
// ===============================
let users = [];

let formData = {
    name: "",
    email: "",
    phone: "",
    password: ""
};

// ===============================
// FORM SUBMIT
// ===============================
document.getElementById("dataForm").addEventListener("submit", async function (e) {
    e.preventDefault();

    let isValid = true;

    const loader = document.getElementById("loader");

    const nameInput = document.getElementById("name");
    const emailInput = document.getElementById("email");
    const phoneInput = document.getElementById("phone");
    const passwordInput = document.getElementById("password");

    const nameError = document.getElementById("nameError");
    const emailError = document.getElementById("emailError");
    const phoneError = document.getElementById("phoneError");
    const passwordError = document.getElementById("passwordError");

    const successMessage = document.getElementById("successMessage");

    // Reset errors
    nameError.textContent = "";
    emailError.textContent = "";
    phoneError.textContent = "";
    passwordError.textContent = "";
    successMessage.textContent = "";

    document.querySelectorAll("input").forEach(input => {
        input.classList.remove("error-border");
    });

    let nameValue = nameInput.value.trim();
    nameValue = nameValue.replace(/\b\w/g, char => char.toUpperCase());
    nameInput.value = nameValue;

    const namePattern = /^[A-Za-z]+(?: [A-Za-z]+)*$/;
    if (!namePattern.test(nameValue)) {
        nameError.textContent = "Name should contain only letters and spaces";
        nameInput.classList.add("error-border");
        isValid = false;
    }

    const emailValue = emailInput.value.trim();
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(emailValue)) {
        emailError.textContent = "Enter valid email";
        emailInput.classList.add("error-border");
        isValid = false;
    }

    const phoneValue = phoneInput.value.trim();
    const phonePattern = /^[6-9]\d{9}$/;
    if (!phonePattern.test(phoneValue)) {
        phoneError.textContent = "Phone must be 10 digits starting 6-9";
        phoneInput.classList.add("error-border");
        isValid = false;
    }

    const passwordValue = passwordInput.value.trim();
    const passwordPattern =
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/;

    if (!passwordPattern.test(passwordValue)) {
        passwordError.textContent = "Weak password";
        passwordInput.classList.add("error-border");
        isValid = false;
    }

    if (isValid) {

        formData = {
            name: nameValue,
            email: emailValue,
            phone: phoneValue,
            password: passwordValue
        };

        try {

            // SHOW LOADER
            loader.style.display = "block";

            const response = await fetch("/api/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData)
            });

            const data = await response.json();

            // HIDE LOADER
            loader.style.display = "none";

            if (response.ok) {
                // Save the JWT token to local storage so the user can interact instantly
                if (data.token) {
                    localStorage.setItem("token", data.token);
                }

                successMessage.textContent = "User Registered Successfully ✔";
                successMessage.style.color = "green";

                document.getElementById("dataForm").reset();

                loadUsers();

            } else {

                successMessage.textContent = data.message;
                successMessage.style.color = "red";

            }

        } catch (error) {

            loader.style.display = "none";

            console.error(error);

            successMessage.textContent = "Server error. Backend not running.";
            successMessage.style.color = "red";

        }
    }
});
// ===============================
// LOAD USERS (WITH TOKEN)
// ===============================
loadUsers();

async function loadUsers() {
    try {
        const response = await fetch("/api/users");

        if (!response.ok) {
            throw new Error("Failed to fetch users");
        }

        users = await response.json();
        displayUsers();

    } catch (error) {
        console.error("Error loading users:", error);

        document.getElementById("usersList").innerHTML =
            "<p style='color:red'>Failed to load users</p>";
    }
}
// ===============================
// DISPLAY USERS
// ===============================
function displayUsers() {

    const container = document.getElementById("usersList");

    let html = "";

    users.forEach(user => {

        html += `
            <div class="user-item">
                <p>${user.name} - ${user.email} - ${user.phone}</p>
                <button onclick="updateUser(${user.id})">Update</button>
                <button onclick="deleteUser(${user.id})">Delete</button>
            </div>
        `;

    });

    container.innerHTML = html;
}
// ===============================
// SEARCH USERS
// ===============================

const searchInput = document.getElementById("searchUser");

searchInput.addEventListener("input", function () {

    const value = this.value.toLowerCase();

    const userItems = document.querySelectorAll(".user-item");

    userItems.forEach(user => {

        const text = user.textContent.toLowerCase();

        if (text.includes(value)) {
            user.style.display = "block";
        } else {
            user.style.display = "none";
        }

    });

});

// ===============================
// DELETE USER
// ===============================
async function deleteUser(id) {
    try {
        const token = localStorage.getItem("token");

        await fetch(`/api/users/${id}`, {
            method: "DELETE",
            headers: {
                "Authorization": "Bearer " + token
            }
        });

        loadUsers();

    } catch (error) {
        console.log(error);
    }
}

// ===============================
// UPDATE USER
// ===============================
async function updateUser(id) {

    const newName = prompt("Enter new name:");
    const newEmail = prompt("Enter new email:");
    const newPhone = prompt("Enter new phone:");

    try {
        const token = localStorage.getItem("token");

        await fetch(`/api/users/${id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + token
            },
            body: JSON.stringify({
                name: newName,
                email: newEmail,
                phone: newPhone
            })
        });

        loadUsers();

    } catch (error) {
        console.log(error);
    }
}
