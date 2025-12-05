document.addEventListener('DOMContentLoaded', () => {
  
    const passwordInput = document.getElementById('password');
    const feedbackElement = document.getElementById('password-feedback');
    const emailInput = document.getElementById('email');
    const emailFeedback = document.getElementById('email-feedback');
    const submitButton = document.getElementById('submitButton');
    const loginForm = document.getElementById('loginForm');


    const strongPasswordRegex = new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})');


    if (!loginForm) {
        console.warn('loginForm não encontrado. Validação desativada.');
        return;
    }

  
    if (submitButton) submitButton.disabled = true;

    function validatePassword() {
   
        if (!passwordInput || !feedbackElement || !submitButton) return false;

        const password = passwordInput.value || '';
        let feedback = '';
        let isValid = true;

        const specialCharRegex = new RegExp('(?=.*[!@#$%^&*])');
        if (!specialCharRegex.test(password)) {
            feedback += 'A senha deve conter pelo menos 1 caractere especial (!, @, #, $, etc.).\n';
            isValid = false;
        }

        if (password.length < 8) {
            feedback += 'A senha deve ter no mínimo 8 caracteres.\n';
            isValid = false;
        }

        if (!strongPasswordRegex.test(password) && isValid) {
            feedback += 'A senha deve conter maiúscula, minúscula e número.\n';
            isValid = false;
        }

        feedbackElement.textContent = feedback.trim();

        
        let emailIsValid = true;
        if (emailInput && emailFeedback) {
            const email = (emailInput.value || '').trim();
            if (!email.endsWith('@gmail.com')) {
                emailFeedback.textContent = 'O e-mail deve ser um endereço @gmail.com.';
                emailIsValid = false;
            } else {
                emailFeedback.textContent = '';
            }
        }

        const formIsValid = isValid && emailIsValid;
        submitButton.disabled = !formIsValid;
        return formIsValid;
    }


    if (passwordInput) {
  
        validatePassword();
        passwordInput.addEventListener('input', validatePassword);
    }
    if (emailInput) {
   
        emailInput.addEventListener('input', validatePassword);

        validatePassword();
    }


    loginForm.addEventListener('submit', (event) => {
        const isValid = validatePassword();
        if (!isValid) {
            event.preventDefault();
            alert('Por favor, corrija a senha para atender a todos os requisitos.');
            return;
        }

        event.preventDefault();
        console.log('Senha validada com sucesso no Front-end. Redirecionando...');
        window.location.href = './index.html';
    });

});