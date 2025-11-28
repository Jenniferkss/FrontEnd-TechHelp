// Toggle de tema e troca de imagem
document.addEventListener('DOMContentLoaded', () => {
  const themeBtn = document.getElementById('themeBtn');
  const themeImg = document.getElementById('themeImg');
  const body = document.body;

  const dayImg = 'assets/img/Escola-Dia.png';
  const nightImg = 'assets/img/Escola-Noite.png';

  // aplica tema salvo ou preferência do sistema
  const saved = localStorage.getItem('theme');
  if (saved === 'escuro' || (!saved && window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
    body.classList.remove('claro');
    body.classList.add('escuro');
  } else {
    body.classList.remove('escuro');
    body.classList.add('claro');
  }

  const applyUI = () => {
    const isDark = body.classList.contains('escuro');
    if (themeBtn) themeBtn.textContent = isDark ? 'Ativar tema claro' : 'Ativar tema escuro';
    if (themeImg) {
      // verifica se arquivo existe simplificando: tenta usar a versão noturna se disponível
      themeImg.src = isDark ? nightImg : dayImg;
      themeImg.alt = isDark ? 'Imagem da escola à noite.' : 'Imagem da escola durante o dia.';
    }
  };

  applyUI();

  if (themeBtn) {
    themeBtn.addEventListener('click', () => {
      const isDark = body.classList.contains('escuro');
      if (isDark) {
        body.classList.remove('escuro');
        body.classList.add('claro');
        localStorage.setItem('theme', 'claro');
      } else {
        body.classList.remove('claro');
        body.classList.add('escuro');
        localStorage.setItem('theme', 'escuro');
      }
      applyUI();
    });
  }
});