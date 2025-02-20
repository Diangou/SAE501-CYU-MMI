import validator from "validator";

document.addEventListener("DOMContentLoaded", function () {
    const forms = document.querySelectorAll("form[data-admin-form]");
    forms.forEach(form => {
        form.addEventListener("submit", function (e) {
            e.preventDefault();
            
            let isValid = true;
            const errors = [];
            
            
            const title = form.querySelector("input[name='title']");
            if (title && validator.isEmpty(title.value.trim())) {
                errors.push("Le titre est requis");
                isValid = false;
            }

            const content = form.querySelector("textarea[name='content']");
            if (content && content.hasAttribute("maxlength")) {
                const maxLength = parseInt(content.getAttribute("maxlength"));
                if (content.value.length > maxLength) {
                    errors.push(`Le contenu ne peut pas dépasser ${maxLength} caractères`);
                    isValid = false;
                }
            }

            const email = form.querySelector("input[name='email']");
            if (email && !validator.isEmpty(email.value)) {
                if (!validator.isEmail(email.value)) {
                    errors.push("L'adresse email n'est pas valide");
                    isValid = false;
                }
            }

            const color = form.querySelector("input[name='color']");
            if (color && !validator.isEmpty(color.value)) {
                if (!validator.isHexColor(color.value)) {
                    errors.push("La couleur doit être au format hexadécimal (ex: #ff0000)");
                    isValid = false;
                }
            }

            const bio = form.querySelector("textarea[name='bio']");
            if (bio && !validator.isEmpty(bio.value)) {
                if (bio.value.length > 300) {
                    errors.push("La bio ne peut pas dépasser 300 caractères");
                    isValid = false;
                }
            }

            const errorContainer = form.querySelector("[data-error-container]");
            if (errorContainer) {
                errorContainer.innerHTML = "";
                if (!isValid) {
                    errors.forEach(error => {
                        const errorElement = document.createElement("p");
                        errorElement.className = "rounded-lg p-3 bg-red-100 text-red-800 border-solid border-x border-y border-red-700 mb-3";
                        errorElement.textContent = error;
                        errorContainer.appendChild(errorElement);
                    });
                }
            }
            if (isValid) {
                form.submit();
            }
        });
    });
}); 
