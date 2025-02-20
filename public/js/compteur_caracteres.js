function initCharacterCounter() {
    const textareas = document.querySelectorAll("textarea[maxlength]");
    
    textareas.forEach(textarea => {
        const maxLength = parseInt(textarea.getAttribute("maxlength"));
        const counterId = textarea.getAttribute("aria-describedby");
        const counter = document.getElementById(counterId);
        
        if (counter) {
            // Mise à jour initiale
            updateCounter(textarea, counter, maxLength);
            
            // Mise à jour en temps réel
            textarea.addEventListener("input", () => {
                updateCounter(textarea, counter, maxLength);
            });
        }
    });
}

function updateCounter(textarea, counter, maxLength) {
    const remainingChars = maxLength - textarea.value.length;
    counter.textContent = `${remainingChars} caractères restants`;
    
    // Ajouter un retour visuel quand on approche de la limite
    if (remainingChars <= 20) {
        counter.classList.add("text-orange-500");
    } else {
        counter.classList.remove("text-orange-500");
    }
}

document.addEventListener("DOMContentLoaded", initCharacterCounter);

export { initCharacterCounter }; 
