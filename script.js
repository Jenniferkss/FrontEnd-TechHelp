const API = 'http://10.88.199.168:3000/chamados';

const lista = document.getElementById('lista');
const detalhes = document.getElementById('detalhes');
const inputId = document.getElementById('inputId');
const selectStatus = document.getElementById('selectStatus');
const selectPrioridade = document.getElementById('selectPrioridade');
const btnBuscar = document.getElementById('btnBuscar');
const btnReset = document.getElementById('btnReset');

function controlarVisibilidadeControles(mostrar) {
    const display = mostrar ? 'inline' : 'none';
    inputId.style.display = display;
    selectStatus.style.display = display;
    selectPrioridade.style.display = display;
    btnBuscar.style.display = display;
    btnReset.style.display = display;
}

const normalizarStringFiltro = (texto) => {
    if (!texto) return '';
    let normalizado = texto.toLowerCase(); 
    normalizado = normalizado.normalize("NFD").replace(/[\u0300-\u036f]/g, ""); 
    normalizado = normalizado.replace(/[\s_]/g, ""); 
    return normalizado;
};

const tituloChamados = document.getElementById('titulo-chamados')

async function carregarChamados() {
    try {
        const res = await fetch(API);
        if (!res.ok) {
            throw new Error(`Erro de rede: ${res.status}`);
        }
        const data = await res.json();
        return data.chamados || [];
    } catch (erro) {
        console.error('Erro ao carregar chamados:', erro);
        lista.innerHTML = '<p>Erro ao carregar chamados. Tente novamente.</p>';
        return [];
    }
}

async function buscarPorId(id) {
    try {
        console.log(`Buscando pelo ID: ${id}`);
        const res = await fetch(`${API}/${id}`);
        
        if (res.status === 404) {
            lista.innerHTML = '<p>Chamado não encontrado!</p>';
            return [];
        }
        
        if (!res.ok) {
             throw new Error(`Erro de rede: ${res.status}`);
        }
        
        const data = await res.json();
        
        if (data && data.chamado) {
            return [data.chamado]; 
        } else {
             lista.innerHTML = '<p>Chamado não encontrado ou resposta inesperada da API!</p>';
             return [];
        }
    } catch (erro) {
        console.error('Erro ao buscar chamado por ID:', erro);
        lista.innerHTML = '<p>Erro ao buscar chamado por ID.</p>';
        return [];
    }
}

function filtrarChamados(chamados) {
    const filtroStatus = normalizarStringFiltro(selectStatus.value);
    const filtroPrioridade = normalizarStringFiltro(selectPrioridade.value);
    
    return chamados.filter(c => {
        const chamadoStatus = normalizarStringFiltro(c.status);
        if (filtroStatus && chamadoStatus !== filtroStatus) return false;
        
        const chamadoPrioridade = normalizarStringFiltro(c.prioridade);
        if (filtroPrioridade && chamadoPrioridade !== filtroPrioridade) return false;

        return true;
    });
}

function mostrarLista(chamados) {
    lista.innerHTML = '';
    if (!chamados || chamados.length === 0) {
        lista.innerHTML = '<p>Nenhum chamado encontrado.</p>';
        return;
    }

    chamados.forEach(c => {
        const div = document.createElement('div');
        div.className = 'Chamado';
        div.innerHTML = `
            <strong>Descrição:</strong> ${c.descricao} <br>
            <strong>ID:</strong> ${c.id} <br>
            <strong>Prioridade:</strong> ${c.prioridade} <br>
            <strong>Responsável:</strong> ${c.responsavelId || 'N/A'} <br>
            <strong>Status:</strong> ${c.status} <br>
            <strong>Criado em:</strong> ${new Date(c.criadoEm).toLocaleDateString()} <br>
        `;
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
        <p><strong>Id do Responsável:</strong> ${c.responsavelId || 'N/A'}</p>
        <p><strong>Status:</strong> ${c.status}</p>
        <button id="voltar">Voltar</button>
    `;

    const btnVoltar = document.getElementById('voltar');
    if (btnVoltar) {
        btnVoltar.onclick = () => {
            console.log('Botão Voltar clicado');
            voltar();
        };
    }

    lista.style.display = 'none';
    controlarVisibilidadeControles(false);
    tituloChamados.style.display = 'none';
    detalhes.parentElement.style.display = 'flex'
}

async function voltar() {
    console.log('Voltando à lista');
    detalhes.innerHTML = '';
    lista.style.display = 'block';
    controlarVisibilidadeControles(true);

    tituloChamados.style.display = 'block';
    detalhes.parentElement.style.display = 'none';

    if (inputId.value.trim()) {
        console.log(`Reaplicando busca pelo ID: ${inputId.value.trim()}`);
        const chamados = await buscarPorId(inputId.value.trim());
        mostrarLista(chamados);
    } else {
        console.log('Reaplicando filtros');
        const chamados = await carregarChamados();
        const filtrados = filtrarChamados(chamados);
        mostrarLista(filtrados);
    }
}

btnBuscar.onclick = async () => {
    console.log('Botão Buscar clicado');
    
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
    console.log('Botão Reset clicado');
    inputId.value = '';
    selectStatus.value = '';
    selectPrioridade.value = '';
    const chamados = await carregarChamados();
    mostrarLista(chamados);
};

(async () => {
    console.log('Carregando todos os chamados');
    const chamados = await carregarChamados();
    mostrarLista(chamados);
})();