const form = document.getElementById("dataForm");

const nameInput = document.getElementById("name");
const emailInput = document.getElementById("email");
const phoneInput = document.getElementById("phone");
const ageInput = document.getElementById("age");

const nameError = document.getElementById("nameError");
const emailError = document.getElementById("emailError");
const phoneError = document.getElementById("phoneError");
const ageError = document.getElementById("ageError");

const successMessage = document.getElementById("successMessage");


// =======================
// Validation Functions
// =======================

function validateName() {
    const nameRegex = /^[A-Za-z\s]{3,}$/;

    if (!nameRegex.test(nameInput.value.trim())) {
        nameError.textContent = "Name must contain only letters (min 3 characters)";
        return false;
    }

    nameError.textContent = "";
    return true;
}

function validateEmail() {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(emailInput.value.trim())) {
        emailError.textContent = "Enter a valid email address";
        return false;
    }

    emailError.textContent = "";
    return true;
}

function validatePhone() {
    const phoneRegex = /^[0-9]{10}$/;

    if (!phoneRegex.test(phoneInput.value.trim())) {
        phoneError.textContent = "Phone number must be 10 digits";
        return false;
    }

    phoneError.textContent = "";
    return true;
}

function validateAge() {
    const age = parseInt(ageInput.value);

    if (isNaN(age) || age < 18 || age > 100) {
        ageError.textContent = "Age must be between 18 and 100";
        return false;
    }

    ageError.textContent = "";
    return true;
}


// =======================
// Real-time Validation
// =======================

nameInput.addEventListener("input", validateName);
emailInput.addEventListener("input", validateEmail);
phoneInput.addEventListener("input", validatePhone);
ageInput.addEventListener("input", validateAge);


// =======================
// Form Submit
// =======================

form.addEventListener("submit", function (e) {
    e.preventDefault();

    const isNameValid = validateName();
    const isEmailValid = validateEmail();
    const isPhoneValid = validatePhone();
    const isAgeValid = validateAge();

    if (isNameValid && isEmailValid && isPhoneValid && isAgeValid) {

        successMessage.textContent = "✅ Data validated successfully!";
        successMessage.style.color = "#00ffcc";

        form.reset();
    } else {
        successMessage.textContent = "";
    }
});
