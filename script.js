// Diagrama PONTO: estado selecionado, descrição detalhada e rotação por teclado.
const detail = document.querySelector('#ponto-detail');
const detailKicker = detail?.querySelector('[data-detail-kicker]');
const detailTitle = detail?.querySelector('[data-detail-title]');
const detailCopy = detail?.querySelector('[data-detail-copy]');
const closeButton = detail?.querySelector('.detail-close');
const nodes = [...document.querySelectorAll('[data-ponto-node]')];
const section = document.querySelector('#rota');

const descriptions = {
  wms: {
    kicker: 'Entrada 01 · WMS',
    title: 'Estoque e fluxo',
    copy: 'O WMS concentra movimentação, saldo e ciclo de mercadoria. Ele mostra o que entra, o que sai e o que precisa ser priorizado no chão de operação.'
  },
  qms: {
    kicker: 'Entrada 02 · QMS',
    title: 'Qualidade e desvios',
    copy: 'O QMS registra inspeções e não conformidades. É uma camada que sinaliza erros, padrões e risco antes que eles se transformem em perda operacional.'
  },
  operacao: {
    kicker: 'Entrada 03 · Operação',
    title: 'Rotina e contexto',
    copy: 'A operação traz o conhecimento de quem executa o processo no dia a dia. Isso inclui urgências, prioridades, exceções e o contexto que os sistemas nem sempre capturam.'
  },
  integracao: {
    kicker: 'Núcleo · Integração',
    title: 'Análise em tempo real',
    copy: 'Aqui os sinais de cada fonte se conectam. A camada central organiza a informação, identifica padrões e entrega contexto para decisões mais rápidas e precisas.'
  },
  decisoes: {
    kicker: 'Saída 01 · Decisões',
    title: 'Decisões precisas',
    copy: 'Com dados integrados e entendidos, a organização pode agir com mais clareza, reduzir incerteza e priorizar o que realmente importa agora.'
  },
  automacao: {
    kicker: 'Saída 02 · Automação',
    title: 'Automação',
    copy: 'Fluxos repetitivos e regras claras podem ser automatizados para reduzir esforço manual, acelerar respostas e liberar tempo para melhoria contínua.'
  }
};

function setActiveNode(activeNode) {
  if (!detail || !detailKicker || !detailTitle || !detailCopy) return;

  nodes.forEach((node) => {
    const selected = node === activeNode;
    node.classList.toggle('is-selected', selected);
    node.setAttribute('aria-expanded', String(selected));
  });

  const content = descriptions[activeNode.dataset.pontoNode];
  if (!content) return;

  detailKicker.textContent = content.kicker;
  detailTitle.textContent = content.title;
  detailCopy.textContent = content.copy;
  detail.hidden = false;
}

function clearSelection() {
  nodes.forEach((node) => {
    node.classList.remove('is-selected');
    node.setAttribute('aria-expanded', 'false');
  });
  if (detail) detail.hidden = true;
}

nodes.forEach((node, index) => {
  node.addEventListener('click', () => setActiveNode(node));

  node.addEventListener('keydown', (event) => {
    const directionalKeys = ['ArrowRight', 'ArrowDown', 'ArrowLeft', 'ArrowUp'];
    if (!directionalKeys.includes(event.key)) return;

    event.preventDefault();
    const direction = event.key === 'ArrowRight' || event.key === 'ArrowDown' ? 1 : -1;
    const nextIndex = (index + direction + nodes.length) % nodes.length;
    nodes[nextIndex].focus();
  });
});

closeButton?.addEventListener('click', clearSelection);

if ('IntersectionObserver' in window && section) {
  const observer = new IntersectionObserver(([entry], currentObserver) => {
    if (!entry.isIntersecting) return;
    section.classList.add('is-visible');
    currentObserver.disconnect();
  }, { threshold: 0.18 });

  observer.observe(section);
}

// Ativa o bloco central por padrão para deixar o diagrama mais inteligível na primeira carga.
const defaultNode = document.querySelector('[data-ponto-node="integracao"]');
if (defaultNode) setActiveNode(defaultNode);
