const btn = document.getElementById('themeBtn');
const img = document.getElementById('themeImg');

btn.addEventListener('click', () => {
  if (btn.textContent === 'Dark Theme') {
    btn.textContent = 'Light Theme';
    img.src = '../assets/img/Escola-Dia.png';
  } else {
    btn.textContent = 'Dark Theme';
    img.src = '../assets/img/Escola-Noite.png';
  }
});