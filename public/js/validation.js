import axios from 'axios';
import validator from "validator";

document.addEventListener("DOMContentLoaded", function () {
    const form = document.querySelector("form[data-async-form]");
    if (!form) return; // Guard clause if form doesn't exist
    
    const firstName = form.querySelector("input[name='firstName']");
    const lastName = form.querySelector("input[name='lastName']");
    const email = form.querySelector("input[name='email']");
    const message = form.querySelector("textarea[name='message']");
    const statusRadios = form.querySelectorAll("input[name='je_suis']");
    const feedback = document.createElement("p"); // Élément pour les messages utilisateur
    feedback.className = "text-center font-bold mt-4"; // Ajout d'un style
    form.appendChild(feedback); // Ajout du feedback après le formulaire

    form.addEventListener("submit", function (e) {
        e.preventDefault(); // Empêche le rechargement de la page

        let isValid = true;

        // Validation du prénom
        if (validator.isEmpty(firstName.value)) {
            firstName.nextElementSibling.style.display = "block";
            isValid = false;
        } else {
            firstName.nextElementSibling.style.display = "none";
        }

        // Validation du nom
        if (validator.isEmpty(lastName.value)) {
            lastName.nextElementSibling.style.display = "block";
            isValid = false;
        } else {
            lastName.nextElementSibling.style.display = "none";
        }

        // Validation de l'email
        if (!validator.isEmail(email.value)) {
            email.nextElementSibling.style.display = "block";
            isValid = false;
        } else {
            email.nextElementSibling.style.display = "none";
        }

        // Validation du message
        if (validator.isEmpty(message.value)) {
            message.nextElementSibling.style.display = "block";
            isValid = false;
        } else {
            message.nextElementSibling.style.display = "none";
        }

        // Validation du statut
        const statusChecked = Array.from(statusRadios).some(radio => radio.checked);
        const statusError = document.querySelector("p[data-error-message='je_suis']");
        if (!statusChecked) {
            statusError.style.display = "block";
            isValid = false;
        } else {
            statusError.style.display = "none";
        }

        // Envoi asynchrone si tout est valide
        if (isValid) {
            const formData = {
                firstName: firstName.value,
                lastName: lastName.value,
                email: email.value,
                content: message.value,
                je_suis: document.querySelector("input[name='je_suis']:checked").value,
            };

            // Désactive le bouton d'envoi temporairement
            const submitButton = form.querySelector("button[type='submit']");
            submitButton.disabled = true;
            submitButton.textContent = "Envoi en cours...";

            axios.post('api/messages', formData)
                .then(response => {
                    // Afficher un message de succès
                    feedback.textContent = "Votre message a été envoyé avec succès !";
                    feedback.style.color = "green";

                    // Réinitialise le formulaire
                    form.reset();
                })
                .catch(error => {
                    // Afficher un message d'erreur
                    feedback.textContent = "Une erreur est survenue lors de l'envoi. Veuillez réessayer.";
                    feedback.style.color = "red";
                    console.error("Erreur lors de la soumission :", error);
                })
                .finally(() => {
                    // Réactive le bouton
                    submitButton.disabled = false;
                    submitButton.textContent = "ENVOYEZ";
                });
        }
    });
})