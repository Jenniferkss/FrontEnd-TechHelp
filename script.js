const API = 'http://10.88.199.175:3000/chamados';

const lista = document.getElementById('lista');
const detalhes = document.getElementById('detalhes');
const inputBuscar = document.getElementById('inputBuscar');
const btnBuscar = document.getElementById('btnBuscar');
const btnReset = document.getElementById('btnReset');

let usuarios = [];

async function carregarChamados() {
  try {
    const res = await fetch(API);
    const data = await res.json();
    mostrarLista(data);
  } catch (erro) {
    console.error('Erro ao carregar chamados:', erro);
    lista.innerHTML = '<p>Erro ao carregar chamados. Tente novamente.</p>';
  }
}

carregarChamados();

function mostrarLista(array) {
  console.log(array.chamados);

  lista.innerHTML = '';
  array.chamados.map((c) => {
    const div = document.createElement('div');
    div.className = 'Chamado';

    // Criando uma estrutura HTML mais detalhada
    div.innerHTML = `
      <strong>Descrição:</strong> ${c.descricao} <br>
      <strong>ID:</strong> ${c.id} <br>
      <strong>Prioridade:</strong> ${c.prioridade} <br>
      <strong>Responsável:</strong> ${c.responsavelId} <br>
      <strong>Status:</strong> ${c.status} <br>
      <strong>Criado em:</strong> ${new Date(c.criadoEm).toLocaleDateString()} <br>
    `;

    // Ao clicar, mostra os detalhes do chamado
    div.onclick = () => mostrarDetalhes(c);
    lista.appendChild(div);
  });
}

function mostrarDetalhes(c) {
  detalhes.innerHTML = `
    <h2>Detalhes do Chamado</h2>
    <p><strong>Descrição:</strong> ${c.descricao}</p>
    <p><strong>ID:</strong> ${c.id}</p>
    <p><strong>Criado em:</strong> ${new Date(c.criadoEm).toLocaleDateString()}</p>
    <p><strong>Criado por Id:</strong> ${c.criadoPorId}</p>
    <p><strong>Prioridade:</strong> ${c.prioridade}</p>
    <p><strong>Id do Responsável:</strong> ${c.responsavelId}</p>
    <p><strong>Status:</strong> ${c.status}</p>
    <button id="voltar">Voltar</button>
  `;
  
  lista.style.display = 'none';
  inputBuscar.style.display = 'none';
  btnBuscar.style.display = 'none';
  btnReset.style.display = 'none';

  const btnVoltar = document.getElementById('voltar');
  if (btnVoltar) btnVoltar.onclick = voltar;
}

function voltar() {
  detalhes.innerHTML = '';
  lista.style.display = 'block';
  inputBuscar.style.display = 'inline';
  btnBuscar.style.display = 'inline';
  btnReset.style.display = 'inline';
}
