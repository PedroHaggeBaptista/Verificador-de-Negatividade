require("dotenv").config();

var frase1 =
  "Os avanços significativos da IA provenientes da IBM Research estão impulsionando o IBM Watson, entregando inovações excepcionais em linguagem, automação e confiança para empresas em todos os setores.";
var positivas = [
  "avanços",
  "significativos",
  "impulsionando",
  "entregando",
  "inovações",
  "excepcionais",
  "confiança",
];
var frase2 =
  "A aposta ousada não deu certo. O Wall Street Journal informou há quase um ano que a Watson Health gerou cerca de US$ 1 bilhão em receita anual e nenhum lucro, e que a IBM estava pensando em vender o negócio.";
var negativas = [
    "não", "deu", "certo", "nenhum", "vender", "lucro"
];

//["não", "deu", "certo", "nenhum"];

//Retirar .;!?, e deixar tudo em minúsculo
var frase1 = frase1.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, "").toLowerCase();
var frase2 = frase2.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, "").toLowerCase();

let frase1Array = frase1.split(" ");
let frase2Array = frase2.split(" ");

//Juntar os dois arrays
let uniqueFrase = frase1Array.concat(frase2Array);

//Unique do array conjunto
uniqueFrase = uniqueFrase.filter((item, i, ar) => ar.indexOf(item) === i);

console.log(uniqueFrase);

//Verificar a ocorrência de cada palavra do array uniqueFrase nos arrays frase1Array e frase2Array, positivas e negativas
let ocorrenciaFrase1 = [];
let ocorrenciaFrase2 = [];
let ocorrenciaFrasePositivas = [];
let ocorrenciaFraseNegativas = [];

for (let i = 0; i < uniqueFrase.length; i++) {
  ocorrenciaFrase1.push(
    frase1Array.filter((item) => item === uniqueFrase[i]).length
  );
  ocorrenciaFrase2.push(
    frase2Array.filter((item) => item === uniqueFrase[i]).length
  );
  ocorrenciaFrasePositivas.push(
    positivas.filter((item) => item === uniqueFrase[i]).length
  );
  ocorrenciaFraseNegativas.push(
    negativas.filter((item) => item === uniqueFrase[i]).length
  );
}

function calculateSimilaridade(arrayOcorrenciaFrase, arrayOcorrenciaNegativas) {
  let similaridade = 0;
  let numerador = 0;
  let denominador = 0;

  for (let i = 0; i < uniqueFrase.length; i++) {
    numerador += arrayOcorrenciaFrase[i] * arrayOcorrenciaNegativas[i];
    denominador += Math.pow(arrayOcorrenciaFrase[i], 2);
    denominador += Math.pow(arrayOcorrenciaNegativas[i], 2);
  }

  denominador = Math.sqrt(denominador);

  similaridade = numerador / denominador;

  return similaridade;
}

let similaridadeNegativa1 = calculateSimilaridade(
  ocorrenciaFrase1,
  ocorrenciaFraseNegativas
);
console.log("Similaridade Negativas x Frase1: ", similaridadeNegativa1);

let similaridadeNegativa2 = calculateSimilaridade(
  ocorrenciaFrase2,
  ocorrenciaFraseNegativas
);

console.log("Similaridade Negativas x Frase2: ", similaridadeNegativa2);

verifyAlert(similaridadeNegativa1, similaridadeNegativa2);

async function verifyAlert(similaridade1, similaridade2) {
  if (similaridade1 >= 0.7 || similaridade2 >= 0.7) {
    let payload = "";

    if (similaridade1 >= 0.7) {
      payload = JSON.stringify({
        content: "",
        embeds: [
          {
            title: "Alerta de Negatividade",
            description: `Encontramos uma frase que contém negatividade sobre sua solução, e ela é: ${frase1}`,
            color: 16711680,
          },
        ],
      });
    } else {
      payload = JSON.stringify({
        content: "",
        embeds: [
          {
            title: "Alerta de Negatividade",
            description: `Encontramos uma frase que contém negatividade sobre sua solução, e ela é: ${frase2}`,
            color: 16711680,
          },
        ],
      });
    }

    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: payload,
    };

    try {
      const response = await fetch(
        process.env.URL_WEBHOOK,
        options
      );

      console.log(response);
    } catch (err) {
      console.log(err);
    }
  }
}
