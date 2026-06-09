document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById("contact-form");
    const avisoErro = document.getElementById("avisoErro");
    const textoSecreto = document.getElementById("textoSecreto");
    const botaoLogin = document.getElementById("Login");
    const botaoRegister = document.getElementById("register");

    if (textoSecreto) {
        textoSecreto.style.display = "none";
    }

    if (botaoLogin) {
        botaoLogin.addEventListener("click", function () {
            window.location.href = "login/login.html";
        });
    }

    if (botaoRegister) {
        botaoRegister.addEventListener("click", function () {
            window.location.href = "login/login.html";
        });
    }

    const botaoEnviar = document.getElementById("Enviar");

    if (!form && !botaoEnviar) {
        return;
    }

    function validarFormulario(event) {
        if (event) {
            event.preventDefault();
        }

        const nome = document.getElementById("nome").value.trim();
        const email = document.getElementById("email").value.trim();
        const telefone = document.getElementById("telefone").value.trim();
        const estado = document.getElementById("estado").value.trim();
        const cidade = document.getElementById("cidade").value.trim();
        const termos = document.getElementById("termos").checked;

        avisoErro.innerHTML = "";
        textoSecreto.style.display = "none";

        let camposFaltando = [];

        if (nome === "") {
            camposFaltando.push("Nome");
        }
        if (email === "") {
            camposFaltando.push("Email");
        }
        if (telefone === "") {
            camposFaltando.push("Telefone");
        }
        if (estado === "") {
            camposFaltando.push("Estado");
        }
        if (cidade === "") {
            camposFaltando.push("Cidade");
        }
        if (!termos) {
            camposFaltando.push("Aceitar os termos");
        }

        if (camposFaltando.length > 0) {
            avisoErro.innerHTML = "Falta preencher: " + camposFaltando.join(", ");
            return;
        }

        textoSecreto.style.display = "block";
        avisoErro.innerHTML = "";

        // Aqui você pode adicionar o envio real para sua API ou serviço
        // Exemplo: fetch('/enviar', { method: 'POST', body: new FormData(form) })
    }

    if (form) {
        form.addEventListener("submit", validarFormulario);
    }
    if (botaoEnviar) {
        botaoEnviar.addEventListener("click", validarFormulario);
    }
});

