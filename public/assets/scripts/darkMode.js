const lightMode = document.querySelector('.mode');
const logo = document.getElementById('logo');

function applyTheme(theme){
    if(theme === 'light'){
        document.body.classList.add('light');
        lightMode.textContent = '☀️';
        logo.src = '/assets/images/logo.png'
    }else{
        document.body.classList.remove('light');
        lightMode.textContent = '🌑';
        logo.src = '/assets/images/logo_png.png';
    }
}

const savedTheme = localStorage.getItem('theme') || `dark`;
applyTheme(savedTheme);


lightMode.addEventListener('click', () => {
    const isLight = document.body.classList.contains('light');
    const newTheme = isLight ? 'dark' : 'light';

    localStorage.setItem('theme', newTheme);
    applyTheme(newTheme);
});