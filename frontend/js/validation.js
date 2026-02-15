document.getElementById("dataForm").addEventListener("submit", async function (e) {
 {
    e.preventDefault();

    let isValid = true;

    const nameInput = document.getElementById("name");
    const emailInput = document.getElementById("email");
    const phoneInput = document.getElementById("phone");
    const passwordInput = document.getElementById("password");

    const nameError = document.getElementById("nameError");
    const emailError = document.getElementById("emailError");
    const phoneError = document.getElementById("phoneError");
    const passwordError = document.getElementById("passwordError");
    const successMessage = document.getElementById("successMessage");

    // Reset
    nameError.textContent = "";
    emailError.textContent = "";
    phoneError.textContent = "";
    passwordError.textContent = "";
    successMessage.textContent = "";

    document.querySelectorAll("input").forEach(input => {
        input.classList.remove("error-border");
    });

    // ===============================
    // SMART NAME VALIDATION
    // ===============================
    let nameValue = nameInput.value.trim();

    // Auto capitalize first letter
    nameValue = nameValue.replace(/\b\w/g, char => char.toUpperCase());
    nameInput.value = nameValue;

    const namePattern = /^[A-Za-z]+(?: [A-Za-z]+)*$/;

    if (!namePattern.test(nameValue)) {
        nameError.textContent = "Name should contain only letters and single spaces";
        nameInput.classList.add("error-border");
        isValid = false;
    }

    // ===============================
    // SMART EMAIL VALIDATION
    // ===============================
    const emailValue = emailInput.value.trim();

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailPattern.test(emailValue) || emailValue.includes("..")) {
        emailError.textContent = "Enter a valid professional email address";
        emailInput.classList.add("error-border");
        isValid = false;
    }

    // ===============================
    // SMART PHONE VALIDATION
    // ===============================
    const phoneValue = phoneInput.value.trim();

    const phonePattern = /^[6-9]\d{9}$/;

    if (!phonePattern.test(phoneValue)) {
        phoneError.textContent =
            "Phone must be 10 digits and start with 6, 7, 8, or 9";
        phoneInput.classList.add("error-border");
        isValid = false;
    }

    // ===============================
    // SMART PASSWORD VALIDATION
    // ===============================
    const passwordValue = passwordInput.value.trim();

    const passwordPattern =
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/;

    if (!passwordPattern.test(passwordValue)) {
        passwordError.textContent =
            "Password must contain 8+ chars, uppercase, lowercase, number & special character";
        passwordInput.classList.add("error-border");
        isValid = false;
    }

    // ===============================
    // FINAL RESULT
    // ===============================
    if (isValid) {
    try {
        const response = await fetch("http://localhost:5000/api/validation", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                name: nameValue,
                email: emailValue,
                phone: phoneValue,
                password: passwordValue
            })
        });

        const data = await response.json();

        if (response.ok) {
            successMessage.textContent = "Smart Validation Successful ✔ Data Saved!";
            successMessage.style.color = "#16a34a";
            document.getElementById("dataForm").reset();
        } else {
            successMessage.textContent = data.message || "Server Error";
            successMessage.style.color = "red";
        }

    } catch (error) {
        successMessage.textContent = "Backend not running!";
        successMessage.style.color = "red";
    }
}

});
