const alturaInput = document.getElementById("altura");
const pesoInput = document.getElementById("peso");
const resultado = document.getElementById("resultado");
const mensagem = document.getElementById("mensagem");

// Formatar altura automaticamente: 175 -> 1,75
alturaInput.addEventListener("input", () => {
  let valor = alturaInput.value.replace(/\D/g, ""); // só números
  if (valor.length > 1) {
    valor = valor[0] + "," + valor.slice(1, 3); // coloca vírgula depois da 1ª casa
  }
  alturaInput.value = valor;
});

function calcularIMC() {
  resultado.textContent = "";
  mensagem.textContent = "";

  // Converte vírgula para ponto antes do cálculo
  let altura = alturaInput.value.replace(",", ".");
  altura = parseFloat(altura);
  const peso = parseFloat(pesoInput.value);

  if (isNaN(altura) || isNaN(peso)) {
    mensagem.textContent = "Preencha todos os campos corretamente.";
    return;
  }
  if (altura <= 0 || altura > 3) {
    mensagem.textContent = "Altura inválida. Use valores entre 1,00m e 3,00m.";
    return;
  }
  if (peso <= 0 || peso > 400) {
    mensagem.textContent = "Peso inválido. Use valores entre 1kg e 400kg.";
    return;
  }

  const imc = (peso / (altura * altura)).toFixed(2);
  let situacao = "";
  let grau = "";

  if (imc < 16) {
    situacao = "Magreza grave"; grau = "0";
  } else if (imc < 17) {
    situacao = "Magreza moderada"; grau = "0";
  } else if (imc < 18.5) {
    situacao = "Magreza leve"; grau = "0";
  } else if (imc < 25) {
    situacao = "Saudável"; grau = "0";
  } else if (imc < 30) {
    situacao = "Sobrepeso"; grau = "I";
  } else if (imc < 35) {
    situacao = "Obesidade Grau I"; grau = "I";
  } else if (imc < 40) {
    situacao = "Obesidade Grau II (severa)"; grau = "II";
  } else {
    situacao = "Obesidade Grau III (mórbida)"; grau = "III";
  }

  resultado.innerHTML = `
    <p>IMC: <strong>${imc}</strong></p>
    <p>Situação: <strong>${situacao}</strong></p>
    <p>Grau de Obesidade: <strong>${grau}</strong></p>
  `;
}

function limparCampos() {
  alturaInput.value = "";
  pesoInput.value = "";
  resultado.textContent = "";
  mensagem.textContent = "";
}
