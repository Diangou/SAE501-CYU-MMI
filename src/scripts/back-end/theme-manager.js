document.addEventListener('DOMContentLoaded', function() {
    // Couleurs disponibles de Tailwind (version simplifiée)
    const tailwindColors = {
        'slate': { main: '#64748b', light: '#f1f5f9', bg: '#e2e8f0' },
        'gray': { main: '#6b7280', light: '#f3f4f6', bg: '#e5e7eb' },
        'zinc': { main: '#71717a', light: '#f4f4f5', bg: '#e4e4e7' },
        'neutral': { main: '#737373', light: '#f5f5f5', bg: '#e5e5e5' },
        'stone': { main: '#78716c', light: '#f5f5f4', bg: '#e7e5e4' },
        'red': { main: '#ef4444', light: '#fee2e2', bg: '#fecaca' },
        'orange': { main: '#f97316', light: '#ffedd5', bg: '#fed7aa' },
        'amber': { main: '#f59e0b', light: '#fef3c7', bg: '#fde68a' },
        'yellow': { main: '#eab308', light: '#fef9c3', bg: '#fef08a' },
        'lime': { main: '#84cc16', light: '#ecfccb', bg: '#d9f99d' },
        'green': { main: '#22c55e', light: '#dcfce7', bg: '#bbf7d0' },
        'emerald': { main: '#10b981', light: '#d1fae5', bg: '#a7f3d0' },
        'teal': { main: '#14b8a6', light: '#ccfbf1', bg: '#99f6e4' },
        'cyan': { main: '#06b6d4', light: '#cffafe', bg: '#a5f3fc' },
        'sky': { main: '#0ea5e9', light: '#e0f2fe', bg: '#bae6fd' },
        'blue': { main: '#3b82f6', light: '#dbeafe', bg: '#bfdbfe' },
        'indigo': { main: '#6366f1', light: '#e0e7ff', bg: '#c7d2fe' },
        'violet': { main: '#8b5cf6', light: '#ede9fe', bg: '#ddd6fe' },
        'purple': { main: '#a855f7', light: '#f3e8ff', bg: '#e9d5ff' },
        'fuchsia': { main: '#d946ef', light: '#fae8ff', bg: '#f5d0fe' },
        'pink': { main: '#ec4899', light: '#fce7f3', bg: '#fbcfe8' },
        'rose': { main: '#f43f5e', light: '#ffe4e6', bg: '#fecdd3' }
    };

    
    const savedTheme = localStorage.getItem('adminTheme') || 'blue';
    
    // Fonction pour appliquer le thème
    function applyTheme(colorName) {
        const color = tailwindColors[colorName];
        if (!color) return;
        
        
        localStorage.setItem('adminTheme', colorName);
        
        // Appliquer le thème aux éléments existants
        const root = document.documentElement;
        root.style.setProperty('--theme-main', color.main);
        root.style.setProperty('--theme-light', color.light);
        root.style.setProperty('--theme-bg', color.bg);
        
        const metaTheme = document.querySelector('meta[name="theme-color"]');
        if (metaTheme) {
            metaTheme.setAttribute('content', color.bg);
        }
        
        // Changer la classe de data-theme sur le body pour le styling global
        document.body.setAttribute('data-theme', colorName);
        
        updateGradientBackground(color.bg);
    }
    
    // Fonction pour mettre à jour le gradient de fond
    function updateGradientBackground(bgColor) {
        const gradientEl = document.querySelector('.bg-gradient-to-b');
        if (!gradientEl) return;
        
        gradientEl.classList.remove('from-blue-200');
        gradientEl.style.background = `linear-gradient(to bottom, ${bgColor}, #f5f5f5)`;
    }
    
    // Créer le sélecteur de thème
    function createThemeSelector() {
        if (document.getElementById('theme-selector')) return;
        
        const navContainer = document.querySelector('nav[role="navigation"]');
        if (!navContainer) return;
        
        const themeSelector = document.createElement('div');
        themeSelector.id = 'theme-selector';
        themeSelector.className = 'px-4 py-3';
        
        
        const title = document.createElement('h2');
        title.className = 'text-sm font-medium mb-2';
        title.textContent = 'Thème de couleur';
        themeSelector.appendChild(title);
        
        const colorContainer = document.createElement('div');
        colorContainer.className = 'grid grid-cols-5 gap-2';
        
        // Ajouter les boutons de couleur
        Object.keys(tailwindColors).forEach(colorName => {
            const colorButton = document.createElement('button');
            colorButton.type = 'button';
            colorButton.className = 'theme-color-button w-6 h-6 rounded-full';
            colorButton.style.backgroundColor = tailwindColors[colorName].main;
            colorButton.setAttribute('data-color', colorName);
            colorButton.setAttribute('title', colorName);
            
            if (colorName === savedTheme) {
                colorButton.classList.add('active-theme');
            }
            
            colorButton.addEventListener('click', function() {
                document.querySelectorAll('.theme-color-button').forEach(btn => {
                    btn.classList.remove('active-theme');
                });
                
                this.classList.add('active-theme');

                applyTheme(this.getAttribute('data-color'));
            });
            
            colorContainer.appendChild(colorButton);
        });
        
        themeSelector.appendChild(colorContainer);
        
        const navList = navContainer.querySelector('ul');
        navContainer.insertBefore(themeSelector, navList.nextSibling);
    }
    
    // Initialisation
    createThemeSelector();
    applyTheme(savedTheme);
}); 