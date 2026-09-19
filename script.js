// Interações do diagrama PONTO: seleção acessível, animação de entrada e navegação por teclado.
const details = {
  wms: { kicker: 'Entrada 01 · WMS', title: 'Estoque e fluxo', copy: 'O WMS reúne a posição dos itens, movimentações e status do estoque. É a visão estruturada do que está acontecendo dentro do armazém.' },
  qms: { kicker: 'Entrada 02 · QMS', title: 'Qualidade e desvios', copy: 'O QMS registra inspeções, não conformidades e padrões de qualidade. Esses sinais ajudam a encontrar causas antes que virem retrabalho.' },
  operacao: { kicker: 'Entrada 03 · Operação', title: 'Rotina e contexto', copy: 'A operação traz o contexto que os sistemas nem sempre capturam: prioridades, exceções e o conhecimento de quem executa o processo.' },
  integracao: { kicker: 'Inteligência · PONTO', title: 'Análise em tempo real', copy: 'A camada central conecta as fontes, organiza os sinais e revela o que merece atenção agora. É o ponto de inteligência da arquitetura.' },
  decisoes: { kicker: 'Saída 01 · Decisões', title: 'Decisões precisas', copy: 'Informação contextualizada chega às pessoas certas para reduzir incerteza, priorizar ações e responder com mais segurança.' },
  automacao: { kicker: 'Saída 02 · Automação', title: 'Menos esforço manual', copy: 'Regras e fluxos podem assumir tarefas repetitivas, liberando tempo para análise, melhoria contínua e trabalho que exige julgamento.' }
};

const diagram = document.querySelector('[data-ponto-diagram]');
const detail = document.querySelector('#ponto-detail');
const closeButton = detail?.querySelector('.detail-close');
const detailKicker = detail?.querySelector('[data-detail-kicker]');
const detailTitle = detail?.querySelector('[data-detail-title]');
const detailCopy = detail?.querySelector('[data-detail-copy]');
const nodes = [...document.querySelectorAll('[data-ponto-node]')];

function selectNode(node) {
  const content = details[node.dataset.pontoNode];
  if (!content || !detail) return;
  nodes.forEach((item) => {
    const selected = item === node;
    item.classList.toggle('is-selected', selected);
    item.setAttribute('aria-expanded', String(selected));
  });
  detailKicker.textContent = content.kicker;
  detailTitle.textContent = content.title;
  detailCopy.textContent = content.copy;
  detail.hidden = false;
}

function closeDetails() {
  nodes.forEach((node) => { node.classList.remove('is-selected'); node.setAttribute('aria-expanded', 'false'); });
  if (detail) detail.hidden = true;
}

nodes.forEach((node, index) => {
  node.addEventListener('click', () => selectNode(node));
  node.addEventListener('keydown', (event) => {
    if (!['ArrowRight', 'ArrowDown', 'ArrowLeft', 'ArrowUp'].includes(event.key)) return;
    event.preventDefault();
    const direction = event.key === 'ArrowRight' || event.key === 'ArrowDown' ? 1 : -1;
    nodes[(index + direction + nodes.length) % nodes.length].focus();
  });
});
closeButton?.addEventListener('click', closeDetails);

// A seção só entra em cena quando fica próxima da viewport.
const revealTarget = document.querySelector('#rota');
if ('IntersectionObserver' in window && revealTarget) {
  revealTarget.classList.add('is-reveal-pending');
  const observer = new IntersectionObserver(([entry], currentObserver) => {
    if (!entry.isIntersecting) return;
    revealTarget.classList.add('is-revealed');
    currentObserver.disconnect();
  }, { threshold: 0.15 });
  observer.observe(revealTarget);
}
