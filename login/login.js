function clearLoginMessages() {
    [
        'erroLogin',
        'sucessoLogin',
        'erroRegister',
        'sucessoRegister'
    ].forEach(function (id) {
        const element = document.getElementById(id);
        if (element) {
            element.textContent = '';
        }
    });
}

function mostrarRegister() {
    const loginBox = document.getElementById('loginBox');
    const registerBox = document.getElementById('registerBox');

    if (!loginBox || !registerBox) {
        return;
    }

    loginBox.classList.remove('active');
    registerBox.classList.add('active');
    clearLoginMessages();
}

function mostrarLogin() {
    const loginBox = document.getElementById('loginBox');
    const registerBox = document.getElementById('registerBox');

    if (!loginBox || !registerBox) {
        return;
    }

    registerBox.classList.remove('active');
    loginBox.classList.add('active');
    clearLoginMessages();
}

function validarGmail(email) {
    if (!email) {
        return false;
    }

    const emailNormalizado = email.trim().toLowerCase();
    return /^[a-z0-9._%+-]+@gmail\.com$/.test(emailNormalizado);
}

function fazerLogin() {
    const email = document.getElementById('loginEmail').value.trim();
    const senha = document.getElementById('loginSenha').value.trim();
    const erro = document.getElementById('erroLogin');
    const sucesso = document.getElementById('sucessoLogin');

    clearLoginMessages();

    if (!email || !senha) {
        if (erro) erro.textContent = 'Por favor, preencha email e senha.';
        return;
    }

    if (!validarGmail(email)) {
        if (erro) erro.textContent = 'Use um email válido do Gmail (terminando em @gmail.com).';
        return;
    }

    if (senha.length < 4) {
        if (erro) erro.textContent = 'Senha muito curta. Use pelo menos 4 caracteres.';
        return;
    }

    if (sucesso) sucesso.textContent = 'Login realizado com sucesso! Redirecionando...';

    setTimeout(function () {
        window.location.href = '../index.html';
    }, 1000);
}

function fazerRegister() {
    const nome = document.getElementById('registerNome').value.trim();
    const email = document.getElementById('registerEmail').value.trim();
    const senha = document.getElementById('registerSenha').value.trim();
    const confirmar = document.getElementById('registerConfirmarSenha').value.trim();
    const erro = document.getElementById('erroRegister');
    const sucesso = document.getElementById('sucessoRegister');

    clearLoginMessages();

    if (!nome || !email || !senha || !confirmar) {
        if (erro) erro.textContent = 'Preencha todos os campos para criar a conta.';
        return;
    }
    if (!validarGmail(email)) {
        if (erro) erro.textContent = 'Use um email válido do Gmail (terminando em @gmail.com).';
        return;
    }
    if (senha !== confirmar) {
        if (erro) erro.textContent = 'As senhas não coincidem.';
        return;
    }

    if (senha.length < 4) {
        if (erro) erro.textContent = 'Senha muito curta. Use pelo menos 4 caracteres.';
        return;
    }

    if (sucesso) sucesso.textContent = 'Cadastro realizado com sucesso! Agora faça login.';
    mostrarLogin();
}

window.addEventListener('DOMContentLoaded', function () {
    const loginBox = document.getElementById('loginBox');
    const registerBox = document.getElementById('registerBox');

    if (loginBox && registerBox) {
        loginBox.classList.add('active');
        registerBox.classList.remove('active');
    }
});
