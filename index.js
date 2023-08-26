require("dotenv").config();


//Definindo as frases e as palavras atreladas a negatividade
var frase1 =
  "Os avanços significativos da IA provenientes da IBM Research estão impulsionando o IBM Watson, entregando inovações excepcionais em linguagem, automação e confiança para empresas em todos os setores.";
var frase2 =
  "A aposta ousada não deu certo. O Wall Street Journal informou há quase um ano que a Watson Health gerou cerca de US$ 1 bilhão em receita anual e nenhum lucro, e que a IBM estava pensando em vender o negócio.";
var negativas = [
    "não", "deu", "certo", "nenhum", "vender", "lucro"
];

//Retirar .;!?, e deixar tudo em minúsculo
var frase1 = frase1.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, "").toLowerCase();
var frase2 = frase2.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, "").toLowerCase();

//Transformar as frases em arrays
let frase1Array = frase1.split(" ");
let frase2Array = frase2.split(" ");

//Juntar os dois arrays
let uniqueFrase = frase1Array.concat(frase2Array);

//Unique do array conjunto
uniqueFrase = uniqueFrase.filter((item, i, ar) => ar.indexOf(item) === i);

//Verificar a ocorrência de cada palavra do array uniqueFrase nos arrays frase1Array e frase2Array, positivas e negativas
let ocorrenciaFrase1 = [];
let ocorrenciaFrase2 = [];
let ocorrenciaFrasePositivas = [];
let ocorrenciaFraseNegativas = [];


//Verificar a ocorrência de cada palavra do array uniqueFrase nos arrays frase1Array e frase2Array, positivas e negativas
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

//Função para calcular a similaridade
function calculateSimilaridade(arrayOcorrenciaFrase, arrayOcorrenciaNegativas) {
  let similaridade = 0;
  let numerador = 0;
  let denominador = 0;

  //Cálculo da similaridade
  for (let i = 0; i < uniqueFrase.length; i++) {
    numerador += arrayOcorrenciaFrase[i] * arrayOcorrenciaNegativas[i];
    denominador += Math.pow(arrayOcorrenciaFrase[i], 2);
    denominador += Math.pow(arrayOcorrenciaNegativas[i], 2);
  }

  //Raiz quadrada do denominador
  denominador = Math.sqrt(denominador);

  similaridade = numerador / denominador;

  return similaridade;
}


//Chamando a função para calcular a similaridade da frase1 com as palavras negativas
let similaridadeNegativa1 = calculateSimilaridade(
  ocorrenciaFrase1,
  ocorrenciaFraseNegativas
);
console.log("Similaridade Negativas x Frase1: ", similaridadeNegativa1);


//Chamando a função para calcular a similaridade da frase2 com as palavras negativas
let similaridadeNegativa2 = calculateSimilaridade(
  ocorrenciaFrase2,
  ocorrenciaFraseNegativas
);

console.log("Similaridade Negativas x Frase2: ", similaridadeNegativa2);


//Chamando a função para verificar se a similaridade é maior ou igual a 0.7
verifyAlert(similaridadeNegativa1, similaridadeNegativa2);


//Função para enviar o alerta
async function verifyAlert(similaridade1, similaridade2) {
  //Verificando se a similaridade é maior ou igual a 0.7
  if (similaridade1 >= 0.7 || similaridade2 >= 0.7) {
    let payload = "";

    //Verificando se a similaridade é maior ou igual a 0.7
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
    } else if (similaridade2 >= 0.7) {
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
    } else if (similaridade1 >= 0.7 && similaridade2 >= 0.7) {
      payload = JSON.stringify({
        content: "",
        embeds: [
          {
            title: "Alerta de Negatividade",
            description: `Encontramos duas frases que contém negatividade sobre sua solução, e elas são: ${frase1} e ${frase2}`,
            color: 16711680,
          },
        ],
      });
    }

    //Gerando as opções da requisição que irá disparar o alerta
    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: payload,
    };

    //Enviando o alerta
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
