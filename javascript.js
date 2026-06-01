const botao = document.getElementById('Enviar');
const texto = document.getElementById('textoSecreto');

botao.addEventListener('click', function() {
    // Altera o estilo para exibir o texto
    texto.style.display = 'block';
});