const lightMode = document.querySelector('.mode');
const logo = document.getElementById('logo');
lightMode.addEventListener('click', () => {
    document.body.classList.toggle('light');

    if (document.body.classList.contains('light')) {
        lightMode.textContent = '☀️';
        logo.src = '../assets/Images/logo.png'
    } else {
        lightMode.textContent = '🌑';
        logo.src = '../assets/Images/logo_png.png'
    }
});