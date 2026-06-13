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

function aplicarTransicao(destino) {
    const overlay = document.createElement('div');
    overlay.id = 'page-transition-overlay';
    overlay.style.cssText = 'position:fixed; inset:0; background:#0f172a; opacity:0; z-index:9999; pointer-events:none; transition:opacity 0.35s ease;';
    document.body.appendChild(overlay);

    requestAnimationFrame(function () {
        overlay.style.opacity = '1';
    });

    setTimeout(function () {
        window.location.href = destino;
    }, 350);
}

function getModeFromUrl() {
    const params = new URLSearchParams(window.location.search);
    const mode = params.get('mode');
    return mode === 'register' ? 'register' : 'login';
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

    try {
        const cadastro = JSON.parse(localStorage.getItem('mundoLinguasCadastro') || '{}');
        const dadosValidos = cadastro.email && cadastro.senha && cadastro.email.toLowerCase() === email.toLowerCase() && cadastro.senha === senha;

        if (!dadosValidos) {
            if (erro) erro.textContent = 'E-mail ou senha não conferem com o cadastro.';
            return;
        }
    } catch (error) {
        if (erro) erro.textContent = 'Nenhum cadastro encontrado para esse e-mail.';
        return;
    }

    if (sucesso) sucesso.textContent = 'Login realizado com sucesso! Redirecionando...';

    setTimeout(function () {
        aplicarTransicao('../dashboard/dashboard.html');
    }, 400);
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

    localStorage.setItem('mundoLinguasCadastro', JSON.stringify({
        nome: nome,
        email: email,
        senha: senha
    }));

    if (sucesso) sucesso.textContent = 'Cadastro realizado com sucesso! Redirecionando para a configuração...';

    setTimeout(function () {
        aplicarTransicao('../Onboard/config.html');
    }, 400);
}

window.addEventListener('DOMContentLoaded', function () {
    const loginBox = document.getElementById('loginBox');
    const registerBox = document.getElementById('registerBox');
    const mode = getModeFromUrl();

    if (loginBox && registerBox) {
        if (mode === 'register') {
            loginBox.classList.remove('active');
            registerBox.classList.add('active');
        } else {
            loginBox.classList.add('active');
            registerBox.classList.remove('active');
        }
    }

    document.body.style.opacity = '0';
    document.body.style.transition = 'opacity 0.35s ease';

    requestAnimationFrame(function () {
        document.body.style.opacity = '1';
    });
});
