const API = 'http://10.88.200.168:3000/chamados'; // URL base da API

// Pega os elementos do DOM
const lista = document.getElementById('lista');
const detalhes = document.getElementById('detalhes');
const inputId = document.getElementById('inputId');
const inputNome = document.getElementById('inputNome');
const inputEmail = document.getElementById('inputEmail');
const btnBuscar = document.getElementById('btnBuscar');
const btnReset = document.getElementById('btnReset');

// Armazena os chamados (dados) carregados. Agora, o array é atualizado a cada busca.
let chamados = [];

// Função assíncrona para carregar/buscar chamados, agora aceitando uma URL
async function buscarChamados(url) {
    lista.innerHTML = '<p>Carregando...</p>'; // Feedback visual
    try {
        const res = await fetch(url);
        // Verifica se a resposta foi bem-sucedida (status 200-299)
        if (!res.ok) {
            throw new Error(`Erro na rede: ${res.status}`);
        }
        const data = await res.json();
        chamados = data; // Atualiza a variável global com os resultados
        mostrarLista(chamados); // Mostra a lista
    } catch (erro) {
        console.error('Erro ao buscar chamados:', erro);
        lista.innerHTML = '<p>Erro ao buscar chamados. Verifique a conexão ou a API.</p>';
    }
}

// Função de busca que constrói a URL e chama a API
btnBuscar.onclick = () => {
    // 1. Coleta os valores dos filtros
    const idFiltro = inputId.value;
    const nomeFiltro = inputNome.value;
    const emailFiltro = inputEmail.value;

    // 2. Constrói os Query Parameters para a URL
    const params = new URLSearchParams();
    if (idFiltro) params.append('id', idFiltro);
    if (nomeFiltro) params.append('nome', nomeFiltro);
    if (emailFiltro) params.append('email', emailFiltro);
    
    // 3. Monta a URL completa para a requisição
    const urlBusca = `${API}?${params.toString()}`;
    
    // 4. Dispara a nova requisição para a API com os filtros
    buscarChamados(urlBusca);
};

// A busca inicial carrega todos os chamados sem filtros
buscarChamados(API);


// --- FUNÇÕES DE APRESENTAÇÃO E NAVEGAÇÃO PERMANECEM IGUAIS ---

// Função para mostrar a lista de chamados (renomeada de mostrarLista)
function mostrarLista(array) {
    lista.innerHTML = '';
    if (array.length === 0) {
        lista.innerHTML = '<p>Nenhum chamado encontrado com estes filtros.</p>';
        return;
    }
    array.forEach((u) => {
        const div = document.createElement('div');
        // Usando o nome/título para o item da lista
        div.textContent = u.name || u.titulo || `ID: ${u.id}`; // Adapte o 'name' para o campo correto (ex: u.titulo)
        div.className = 'chamado'; 
        div.onclick = () => mostrarDetalhes(u); 
        lista.appendChild(div);
    });
}

// Função de reset da busca - agora limpa os campos e faz uma nova requisição sem filtros
btnReset.onclick = () => {
    inputId.value = '';
    inputNome.value = '';
    inputEmail.value = '';
    // Chama a API base novamente para recarregar tudo
    buscarChamados(API); 
};

// Função para mostrar detalhes do chamado (renomeada de mostrarDetalhes)
function mostrarDetalhes(u) {
    // Note que os campos de detalhe (email, phone, address.city) sugerem que a API retorna dados de usuário.
    // Se a API for realmente de 'chamados', você deve adaptar esses campos (ex: u.descricao, u.status).
    detalhes.innerHTML = `
        <h2>${u.name || u.titulo || 'Detalhes do Chamado'}</h2>
        <p>Email: ${u.email}</p>
        <p>Telefone: ${u.phone}</p>
        <p>Cidade: ${u.address.city}</p> 
        <button id="voltar">Voltar</button>
    `;
    // Esconder/Mostrar elementos para navegação
    lista.style.display = 'none'; 
    document.getElementById('filtros').style.display = 'none'; // Esconde a div inteira de filtros
    document.getElementById('voltar').onclick = voltar; 
}

// Função para voltar à lista
function voltar() {
    detalhes.innerHTML = '';
    lista.style.display = 'block';
    document.getElementById('filtros').style.display = 'block'; // Mostra a div inteira de filtros
    mostrarLista(chamados); // Mostra a última lista de chamados carregada/filtrada
}