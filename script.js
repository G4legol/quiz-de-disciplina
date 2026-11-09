// Perguntas organizadas em um array de objetos, como apresentado no slide.
const perguntas = [
  {
    pergunta: 'Qual é a função principal do HTML em uma página web?',
    opcoes: ['Definir a estrutura e o conteúdo', 'Criar animações complexas', 'Armazenar dados no servidor', 'Controlar a conexão com a internet'],
    resposta: 0,
    explicacao: 'HTML é a linguagem de marcação usada para organizar títulos, parágrafos, imagens, links e outros conteúdos.'
  },
  {
    pergunta: 'Qual propriedade CSS altera a cor do texto?',
    opcoes: ['background', 'font-style', 'color', 'text-align'],
    resposta: 2,
    explicacao: 'A propriedade color define a cor do conteúdo textual. background ou background-color alteram o fundo.'
  },
  {
    pergunta: 'Qual tag HTML é usada para criar um link?',
    opcoes: ['<link>', '<a>', '<href>', '<url>'],
    resposta: 1,
    explicacao: 'A tag <a> cria um hiperlink. O endereço de destino é informado no atributo href.'
  },
  {
    pergunta: 'Qual palavra-chave declara uma variável que pode receber outro valor?',
    opcoes: ['const', 'fixed', 'static', 'let'],
    resposta: 3,
    explicacao: 'let declara uma variável cujo valor pode ser reatribuído. const é usada quando não haverá reatribuição.'
  },
  {
    pergunta: 'Qual método adiciona um elemento ao final de um array?',
    opcoes: ['push()', 'pop()', 'shift()', 'join()'],
    resposta: 0,
    explicacao: 'push() inclui um ou mais itens no final do array e retorna o novo tamanho.'
  },
  {
    pergunta: 'O que significa DOM no desenvolvimento web?',
    opcoes: ['Data Object Mode', 'Document Online Method', 'Document Object Model', 'Digital Order Map'],
    resposta: 2,
    explicacao: 'DOM significa Document Object Model. Ele representa a página como uma estrutura que o JavaScript pode acessar e modificar.'
  },
  {
    pergunta: 'Qual evento JavaScript é normalmente usado para detectar um clique?',
    opcoes: ['onload', 'click', 'onchange', 'submit'],
    resposta: 1,
    explicacao: 'O evento click acontece quando o usuário clica em um elemento. Ele pode ser registrado com addEventListener.'
  },
  {
    pergunta: 'Qual opção ajuda a adaptar o layout para telas menores?',
    opcoes: ['Uma variável global', 'Um array de objetos', 'Um alerta JavaScript', 'Uma media query CSS'],
    resposta: 3,
    explicacao: 'Media queries permitem aplicar regras CSS conforme características da tela, como a largura do dispositivo.'
  }
];

const questionCounter = document.querySelector('#questionCounter');
const progressBar = document.querySelector('#progressBar');
const progressTrack = document.querySelector('.progress-track');
const questionKicker = document.querySelector('#questionKicker');
const questionText = document.querySelector('#questionText');
const optionsContainer = document.querySelector('#options');
const feedback = document.querySelector('#feedback');
const nextButton = document.querySelector('#nextButton');
const questionArea = document.querySelector('#questionArea');
const resultArea = document.querySelector('#resultArea');

let indiceAtual = 0;
let pontuacao = 0;
let respondida = false;

function carregarPergunta() {
  const atual = perguntas[indiceAtual];
  respondida = false;
  questionCounter.textContent = `${String(indiceAtual + 1).padStart(2, '0')} / ${String(perguntas.length).padStart(2, '0')}`;
  questionKicker.textContent = `PERGUNTA ${String(indiceAtual + 1).padStart(2, '0')}`;
  questionText.textContent = atual.pergunta;
  progressBar.style.width = `${(indiceAtual / perguntas.length) * 100}%`;
  progressTrack.setAttribute('aria-valuenow', String(indiceAtual));
  optionsContainer.replaceChildren();
  feedback.hidden = true;
  feedback.className = 'feedback';
  nextButton.disabled = true;
  nextButton.innerHTML = indiceAtual === perguntas.length - 1
    ? 'Ver resultado <span>→</span>'
    : 'Próxima pergunta <span>→</span>';

  atual.opcoes.forEach((opcao, indice) => {
    const botao = document.createElement('button');
    botao.type = 'button';
    botao.className = 'option';
    const letra = document.createElement('span');
    letra.className = 'option-letter';
    letra.textContent = String.fromCharCode(65 + indice);
    const texto = document.createElement('span');
    texto.textContent = opcao;
    botao.append(letra, texto);
    botao.addEventListener('click', () => selecionarResposta(indice));
    optionsContainer.append(botao);
  });
}

function selecionarResposta(indiceEscolhido) {
  if (respondida) return;
  respondida = true;
  const atual = perguntas[indiceAtual];
  const botoes = [...optionsContainer.querySelectorAll('.option')];
  const acertou = indiceEscolhido === atual.resposta;
  if (acertou) pontuacao += 1;

  botoes.forEach((botao, indice) => {
    botao.disabled = true;
    if (indice === atual.resposta) botao.classList.add('correct');
    if (indice === indiceEscolhido && !acertou) botao.classList.add('wrong');
  });

  feedback.hidden = false;
  feedback.classList.add(acertou ? 'correct' : 'wrong');
  const titulo = document.createElement('strong');
  titulo.textContent = acertou ? '✓ Resposta correta!' : '✕ Não foi dessa vez.';
  const explicacao = document.createElement('span');
  explicacao.textContent = atual.explicacao;
  feedback.replaceChildren(titulo, explicacao);
  nextButton.disabled = false;
  progressBar.style.width = `${((indiceAtual + 1) / perguntas.length) * 100}%`;
  progressTrack.setAttribute('aria-valuenow', String(indiceAtual + 1));
}

function mostrarResultado() {
  questionArea.hidden = true;
  resultArea.hidden = false;
  questionCounter.textContent = 'CONCLUÍDO';
  progressBar.style.width = '100%';
  progressTrack.setAttribute('aria-valuenow', String(perguntas.length));
  document.querySelector('#finalScore').textContent = `${pontuacao}/${perguntas.length}`;

  let titulo = 'Continue praticando!';
  let mensagem = 'Cada tentativa é uma oportunidade de aprender. Revise as explicações e tente novamente.';
  if (pontuacao === perguntas.length) {
    titulo = 'Perfeito! Você arrasou!';
    mensagem = 'Você acertou todas as perguntas. Seu conhecimento sobre desenvolvimento web está em dia!';
  } else if (pontuacao >= perguntas.length * 0.7) {
    titulo = 'Mandou muito bem!';
    mensagem = 'Você tem uma boa base. Continue praticando para dominar ainda mais os fundamentos.';
  } else if (pontuacao >= perguntas.length * 0.4) {
    titulo = 'Bom começo!';
    mensagem = 'Você já conhece alguns conceitos. Leia as explicações e fortaleça os pontos que faltaram.';
  }
  document.querySelector('#resultTitle').textContent = titulo;
  document.querySelector('#resultCopy').textContent = mensagem;
}

nextButton.addEventListener('click', () => {
  if (!respondida) return;
  if (indiceAtual === perguntas.length - 1) {
    mostrarResultado();
    return;
  }
  indiceAtual += 1;
  carregarPergunta();
});

document.querySelector('#restartButton').addEventListener('click', () => {
  indiceAtual = 0;
  pontuacao = 0;
  resultArea.hidden = true;
  questionArea.hidden = false;
  carregarPergunta();
});

carregarPergunta();
