// Definindo a URL da API para consultar os chamados
const API = "http://192.168.1.25:3000/chamados";

// Pegando os elementos do DOM (Document Object Model) para manipulação futura
const lista = document.getElementById("lista"); // Elemento onde a lista de chamados será exibida
const detalhes = document.getElementById("detalhes"); // Elemento onde os detalhes do chamado serão exibidos
const inputId = document.getElementById("inputId"); // Input para filtrar pelo ID do chamado
const selectStatus = document.getElementById("selectStatus"); // Select para filtrar por status
const selectPrioridade = document.getElementById("selectPrioridade"); // Select para filtrar por prioridade
const btnBuscar = document.getElementById("btnBuscar"); // Botão para buscar chamados com base nos filtros
const btnReset = document.getElementById("btnReset"); // Botão para resetar os filtros

// Função para controlar a visibilidade dos controles de filtro
function controlarVisibilidadeControles(mostrar) {
  const display = mostrar ? "inline" : "none"; // Define se os controles serão visíveis ou não
  inputId.style.display = display;
  selectStatus.style.display = display;
  selectPrioridade.style.display = display;
  btnBuscar.style.display = display;
  btnReset.style.display = display;
}

// Função para normalizar a string para filtro (remover acentuação e espaços)
const normalizarStringFiltro = (texto) => {
  if (!texto) return ""; // Se o texto não for fornecido, retorna uma string vazia
  let normalizado = texto.toLowerCase(); // Converte para minúsculo
  normalizado = normalizado.normalize("NFD").replace(/[\u0300-\u036f]/g, ""); // Remove acentos
  normalizado = normalizado.replace(/[\s_]/g, ""); // Remove espaços e underscores
  return normalizado;
};

// Pegando o elemento de título da lista de chamados
const tituloChamados = document.getElementById("titulo-chamados");

// Função para carregar todos os chamados a partir da API
async function carregarChamados() {
  try {
    const res = await fetch(API); // Fazendo requisição para a API
    if (!res.ok) {
      // Se não for bem-sucedida, lança um erro
      throw new Error(`Erro de rede: ${res.status}`);
    }
    const data = await res.json(); // Parseando a resposta como JSON
    return data.chamados || []; // Retorna a lista de chamados ou um array vazio
  } catch (erro) {
    console.error("Erro ao carregar chamados:", erro); // Se ocorrer erro, loga no console
    lista.innerHTML = "<p>Erro ao carregar chamados. Tente novamente.</p>"; // Exibe uma mensagem de erro
    return [];
  }
}

// Função para buscar um chamado específico pelo ID
async function buscarPorId(id) {
  try {
    console.log(`Buscando pelo ID: ${id}`); // Log para depuração

const status = normalizarStringFiltro(selectStatus.value);// Normaliza o status selecionado
const prioridade = normalizarStringFiltro(selectPrioridade.value); // Normaliza a prioridade selecionada

let query = '';
if (status || prioridade) {
    query = '?';
    if (status) query += `status=${status}`;
    if (prioridade) query += `${status ? '&' : ''}prioridade=${prioridade}`;
} // Construindo a query string com os filtros

const res = await fetch(`${API}/${id}${query}`); // Fazendo requisição para a API com o ID e filtros

    if (res.status === 404) {
      // Se não encontrar o chamado, exibe uma mensagem de erro
      lista.innerHTML = "<p>Chamado não encontrado!</p>";
      return [];
    }

    if (!res.ok) {
      // Se a resposta não for bem-sucedida, lança um erro
      throw new Error(`Erro de rede: ${res.status}`);
    }

    const data = await res.json(); // Parseando a resposta como JSON

    if (data && data.chamado) {
  return [data.chamado]; 
    } else {
      lista.innerHTML =
        "<p>Chamado não encontrado ou resposta inesperada da API!</p>";
      return [];
    }
  } catch (erro) {
    console.error("Erro ao buscar chamado por ID:", erro); // Log do erro no console
    lista.innerHTML = "<p>Erro ao buscar chamado por ID.</p>"; // Exibe mensagem de erro
    return [];
  }
}

// Função para filtrar os chamados com base no status e prioridade
function filtrarChamados(chamados) {
  const filtroStatus = normalizarStringFiltro(selectStatus.value); // Normaliza o status
  const filtroPrioridade = normalizarStringFiltro(selectPrioridade.value); // Normaliza a prioridade

  return chamados.filter((c) => {
    // Filtra a lista de chamados
    const chamadoStatus = normalizarStringFiltro(c.status);
    if (filtroStatus && chamadoStatus !== filtroStatus) return false; // Filtra pelo status

    const chamadoPrioridade = normalizarStringFiltro(c.prioridade);
    if (filtroPrioridade && chamadoPrioridade !== filtroPrioridade)
      return false; // Filtra pela prioridade

    return true;
  });
}

// Função para exibir a lista de chamados na tela
function mostrarLista(chamados) {
  lista.innerHTML = ""; // Limpa a lista atual

  if (!chamados || chamados.length === 0) {
    // Se não houver chamados ou estiver vazio
    lista.innerHTML = "<p>Nenhum chamado encontrado.</p>";
    return;
  }

  // Cria um contêiner para os chamados
  const container = document.createElement("div");
  container.className = "lista-chamados"; // Adiciona uma classe para estilização no CSS

  chamados.forEach((c) => {
    // Cria um item para cada chamado
    const div = document.createElement("div");
    div.className = "chamado"; // Classe para cada chamado
    div.innerHTML = ` 
            <strong>Número:</strong> ${c.id} <br>
            <strong>Prioridade:</strong> ${c.prioridade} <br>
            <strong>Status:</strong> ${c.status} <br>
            <strong>Descrição:</strong> ${c.descricao} <br>
        `;
    div.onclick = () => mostrarDetalhes(c); // Ao clicar, mostra os detalhes do chamado
    container.appendChild(div); // Adiciona o item do chamado ao contêiner
  });

  lista.appendChild(container); // Adiciona o contêiner à lista
}

// Função para exibir os detalhes de um chamado
function mostrarDetalhes(c) {
  detalhes.innerHTML = ` 
        <h2>Detalhes do Chamado</h2>
        <p><strong>Descrição:</strong> ${c.descricao}</p>
        <p><strong>ID:</strong> ${c.id}</p>
        <p><strong>Criado em:</strong> ${new Date(
          c.criadoEm
        ).toLocaleDateString()}</p>
        <p><strong>Criado por Id:</strong> ${c.criadoPorId}</p>
        <p><strong>Prioridade:</strong> ${c.prioridade}</p>
        <p><strong>Id do Responsável:</strong> ${c.responsavelId || "N/A"}</p>
        <p><strong>Status:</strong> ${c.status}</p>
        <button id="voltar">Voltar</button>
    `;

  // Adiciona a funcionalidade de "Voltar"
  const btnVoltar = document.getElementById("voltar");
  if (btnVoltar) {
    btnVoltar.onclick = () => {
      console.log("Botão Voltar clicado");
      voltar();
    };
  }

  lista.style.display = "none"; // Esconde a lista de chamados
  controlarVisibilidadeControles(false); // Esconde os controles de filtro
  tituloChamados.style.display = "none"; // Esconde o título da lista
  detalhes.parentElement.style.display = "flex"; // Exibe a seção de detalhes

  const btnCriarChamado = document.getElementById("btnCriarChamado");
  if (btnCriarChamado) {
    btnCriarChamado.style.display = "none"; // Esconde o botão de criar chamado
  }
}

// Função para voltar para a lista de chamados
async function voltar() {
  console.log("Voltando à lista");
  detalhes.innerHTML = ""; // Limpa os detalhes

  lista.style.display = "block"; // Exibe novamente a lista de chamados
  controlarVisibilidadeControles(true); // Exibe os controles de filtro

  tituloChamados.style.display = "block"; // Exibe o título da lista
  detalhes.parentElement.style.display = "none"; // Esconde a seção de detalhes

  const btnCriarChamado = document.getElementById("btnCriarChamado");
  if (btnCriarChamado) {
    btnCriarChamado.style.display = "block"; // Exibe o botão de criar chamado
  }

  if (inputId.value.trim()) {
    // Se houver um ID fornecido, aplica a busca por ID
    console.log(`Reaplicando busca pelo ID: ${inputId.value.trim()}`);
    const chamados = await buscarPorId(inputId.value.trim());
    mostrarLista(chamados);
  } else {
    // Caso contrário, reaplica os filtros
    console.log("Reaplicando filtros");
    const chamados = await carregarChamados();
    const filtrados = filtrarChamados(chamados);
    mostrarLista(filtrados);
  }
}
btnBuscar.onclick = async () => {
  console.log("Botão Buscar clicado");

  if (inputId.value.trim()) {
    const chamados = await buscarPorId(inputId.value.trim());
    mostrarLista(chamados);
  } else {
    const chamados = await carregarChamados();
    const filtrados = filtrarChamados(chamados);
    mostrarLista(filtrados);
  }
};
btnReset.onclick = async () => {
  console.log("Botão Reset clicado");
  inputId.value = "";
  selectStatus.value = "";
  selectPrioridade.value = "";
  const chamados = await carregarChamados();
  mostrarLista(chamados);
};

(async () => {
  console.log("Carregando todos os chamados");
  const chamados = await carregarChamados();
  mostrarLista(chamados);
})();
