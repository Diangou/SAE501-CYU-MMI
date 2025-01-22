import validator from "validator";

const submitForm = (e) => {
    e.preventDefault();

    const formData = new FormData(e.target);
    const formValues = Object.fromEntries(formData);

    console.log(formValues);

    if (validator.isEmpty(formValues.lastName.trim())) { 
        document.querySelector("[data-error-message='lastName']").classList.remove("hidden");
        // Display error message
        return;
    }
};

document.querySelectorAll("[data-async-form]").forEach((item) => {
    item.addEventListener("submit", submitForm);
});
