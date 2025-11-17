// Selecionando o botão de alternância
const toggleButton = document.getElementById('toggle-mode');

// Verificando o estado inicial do modo
const darkMode = localStorage.getItem('dark-mode') === 'true';

// Aplicando o modo escuro se necessário
if (darkMode) {
  document.body.classList.add('dark-mode');
}

// Função para alternar o modo claro e escuro
toggleButton.addEventListener('click', () => {
  document.body.classList.toggle('dark-mode');

  // Salvando a preferência do usuário no localStorage
  const isDarkMode = document.body.classList.contains('dark-mode');
  localStorage.setItem('dark-mode', isDarkMode);
});
