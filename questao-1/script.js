const form = document.getElementById("calcForm");
const num1 = document.getElementById("num1");
const num2 = document.getElementById("num2");
const operador = document.getElementById("operador");
const resultado = document.getElementById("resultado");
const mensagem = document.getElementById("mensagem");

form.addEventListener("submit", function(e) {
  e.preventDefault();
  mensagem.textContent = "";
  resultado.textContent = "";

  const n1 = parseFloat(num1.value);
  const n2 = parseFloat(num2.value);
  const op = operador.value;

  // validações
  if (isNaN(n1) || isNaN(n2)) {
    mensagem.textContent = "Por favor, insira números válidos.";
    return;
  }

  if (n1 < 0 || n2 < 0) {
    mensagem.textContent = "Não é permitido número negativo.";
    return;
  }

  if (!op) {
    mensagem.textContent = "Selecione um operador.";
    return;
  }

  if (op === "/" && n2 === 0) {
    mensagem.textContent = "Divisão por zero não é permitida!";
    return;
  }

  let res;
  switch(op) {
    case "+": res = n1 + n2; break;
    case "-": res = n1 - n2; break;
    case "*": res = n1 * n2; break;
    case "/": res = n1 / n2; break;
  }

  resultado.textContent = "Resultado: " + res;
});
