document.addEventListener('DOMContentLoaded', () => {
    // URL da sua API de produção
    const API_BASE_URL = 'https://sistema-de-livros.onrender.com'; // Altere se o nome do seu serviço for diferente

    // --- Seletores de Elementos (cache para performance) ---
    const elementos = {
        navegacao: document.getElementById('navegacao-principal'),
        secoes: document.querySelectorAll('.secao-conteudo'),
        
        // Autores
        tabelaAutores: document.getElementById('tabela-autores').querySelector('tbody'),
        spinnerAutor: document.getElementById('spinner-carregamento-autor'),
        btnAdicionarAutor: document.getElementById('btn-adicionar-autor'),
        btnAtualizarAutores: document.getElementById('btn-atualizar-autores'),
        pesquisaAutorInput: document.getElementById('pesquisa-autor-input'),
        modalAutor: document.getElementById('modal-autor'),
        formAutor: document.getElementById('formulario-autor'),
        tituloModalAutor: document.getElementById('titulo-modal-autor'),
        idAutor: document.getElementById('id-autor'),
        nomeAutor: document.getElementById('nome-autor'),
        nacionalidadeAutor: document.getElementById('nacionalidade-autor'),
        dataNascimentoAutor: document.getElementById('data-nascimento-autor'),
        
        // Livros
        tabelaLivros: document.getElementById('tabela-livros').querySelector('tbody'),
        spinnerLivro: document.getElementById('spinner-carregamento-livro'),
        btnAdicionarLivro: document.getElementById('btn-adicionar-livro'),
        btnAtualizarLivros: document.getElementById('btn-atualizar-livros'),
        pesquisaLivroInput: document.getElementById('pesquisa-livro-input'),
        modalLivro: document.getElementById('modal-livro'),
        formLivro: document.getElementById('formulario-livro'),
        tituloModalLivro: document.getElementById('titulo-modal-livro'),
        idLivro: document.getElementById('id-livro'),
        tituloLivro: document.getElementById('titulo-livro'),
        autorLivroSelect: document.getElementById('autor-livro'),
        dataPublicacaoLivro: document.getElementById('data-publicacao-livro'),
        editoraLivro: document.getElementById('editora-livro'),
        resumoLivro: document.getElementById('resumo-livro'),

        // Resumo
        modalResumo: document.getElementById('modal-resumo'),
        tituloModalResumo: document.getElementById('titulo-modal-resumo'),
        conteudoModalResumo: document.getElementById('conteudo-modal-resumo'),
        
        // Outros
        notificacao: document.getElementById('notificacao'),
        fecharModais: document.querySelectorAll('.fechar-modal'),
        btnMenuMobile: document.getElementById('btnMenuMobile'),
        barraLateral: document.querySelector('.barra-lateral')
    };

    let todosAutores = [];
    let todosLivros = [];

    // --- Funções de Requisição à API (Fetch) ---

    const fetchData = async (endpoint, options = {}) => {
        const response = await fetch(`${API_BASE_URL}/${endpoint}`, options);
        if (!response.ok) {
            const errorData = await response.json().catch(() => ({ message: `Erro HTTP: ${response.status}` }));
            throw new Error(errorData.message || 'Ocorreu um erro na requisição.');
        }
        // Para DELETE, a resposta pode não ter corpo ou ser um JSON, então não tentamos fazer o parse.
        if (options.method === 'DELETE' || response.status === 204) {
            return;
        }
        return response.json();
    };

    const carregarAutores = async () => {
        elementos.spinnerAutor.classList.remove('escondido');
        try {
            todosAutores = await fetchData('autores');
            renderizarTabelaAutores(todosAutores);
        } catch (err) {
            mostrarNotificacao(err.message, 'error');
        } finally {
            elementos.spinnerAutor.classList.add('escondido');
        }
    };

    const carregarLivros = async () => {
        elementos.spinnerLivro.classList.remove('escondido');
        try {
            todosLivros = await fetchData('livros');
            editarLivros(todosLivros);
        } catch (err) {
            mostrarNotificacao(err.message, 'error');
        } finally {
            elementos.spinnerLivro.classList.add('escondido');
        }
    };

    const carregarAutoresParaSelect = async () => {
        try {
            const autores = await fetchData('autores');
            elementos.autorLivroSelect.innerHTML = '<option value="">Selecione um autor...</option>';
            autores.forEach(autor => {
                const option = document.createElement('option');
                option.value = autor.id;
                option.textContent = autor.nome;
                elementos.autorLivroSelect.appendChild(option);
            });
        } catch (err) {
            mostrarNotificacao('Erro ao carregar lista de autores para o formulário.', 'error');
        }
    };

    // --- Funções de Renderização na Tela ---

    const renderizarTabelaAutores = (autores) => {
        elementos.tabelaAutores.innerHTML = autores.map(autor => `
            <tr>
                <td data-label="ID">${autor.id}</td>
                <td data-label="Nome">${autor.nome}</td>
                <td data-label="Nacionalidade">${autor.nacionalidade || 'N/A'}</td>
                <td data-label="Data Nasc.">${autor.dataNascimento ? new Date(autor.dataNascimento + 'T00:00:00').toLocaleDateString('pt-BR') : 'N/A'}</td>
                <td data-label="Ações">
                    <button onclick="window.editarAutor(${autor.id})" class="btn btn-warning">Editar</button>
                    <button onclick="window.deletarAutor(${autor.id})" class="btn btn-danger">Excluir</button>
                </td>
            </tr>
        `).join('');
    };

    const renderizarTabelaLivros = (livros) => {
        elementos.tabelaLivros.innerHTML = livros.map(livro => `
            <tr>
                <td data-label="ID">${livro.id}</td>
                <td data-label="Título">${livro.titulo}</td>
                <td data-label="Autor">${livro.autor ? livro.autor.nome : 'N/A'}</td>
                <td data-label="Publicação">${livro.dataPublicacao ? new Date(livro.dataPublicacao + 'T00:00:00').toLocaleDateString('pt-BR') : 'N/A'}</td>
                <td data-label="Editora">${livro.editora || 'N/A'}</td>
                <td data-label="Resumo"><span class="resumo-clicavel" onclick="window.mostrarResumo('${livro.titulo.replace(/'/g, "\\'")}', '${livro.resumo ? livro.resumo.replace(/'/g, "\\'").replace(/"/g, '\\"').replace(/\n/g, '\\n') : 'Sem resumo.'}')">Ver</span></td>
                <td data-label="Ações">
                    <button onclick="window.aeditarLivro(${livro.id})" class="btn btn-warning">Editar</button>
                    <button onclick="window.deletarLivro(${livro.id})" class="btn btn-danger">Excluir</button>
                </td>
            </tr>
        `).join('');
    };
    
    // --- Lógica dos Modais ---

    const abrirModal = (modal, titulo = '') => {
        if (titulo) {
            const tituloEl = modal.querySelector('h2');
            if (tituloEl) tituloEl.textContent = titulo;
        }
        modal.style.display = 'flex';
    };

    const fecharModal = (modal) => {
        modal.style.display = 'none';
        elementos.formAutor.reset();
        elementos.formLivro.reset();
        elementos.idAutor.value = '';
        elementos.idLivro.value = '';
    };

    // --- Funções CRUD (Criar, Ler, Atualizar, Deletar) ---
    
    window.abrirEdicaoAutor = (id) => {
        const autor = todosAutores.find(a => a.id === id);
        if (autor) {
            elementos.idAutor.value = autor.id;
            elementos.nomeAutor.value = autor.nome;
            elementos.nacionalidadeAutor.value = autor.nacionalidade;
            elementos.dataNascimentoAutor.value = autor.dataNascimento;
            abrirModal(elementos.modalAutor, "Editar Autor");
        }
    };

    window.deletarAutor = async (id) => {
        if (confirm('Tem certeza que deseja excluir este autor? Isso pode afetar os livros associados.')) {
            try {
                await fetchData(`autores/${id}`, { method: 'DELETE' });
                mostrarNotificacao('Autor excluído com sucesso!', 'success');
                carregarAutores();
                carregarAutoresParaSelect();
            } catch (err) {
                mostrarNotificacao(err.message, 'error');
            }
        }
    };

    const salvarAutor = async (e) => {
        e.preventDefault();
        const id = elementos.idAutor.value;
        const autor = {
            nome: elementos.nomeAutor.value,
            nacionalidade: elementos.nacionalidadeAutor.value,
            dataNascimento: elementos.dataNascimentoAutor.value || null
        };
        // Para PUT, precisamos enviar o ID no corpo também
        if (id) {
            autor.id = id;
        }

        const method = id ? 'PUT' : 'POST';
        const endpoint = id ? `autores/${id}` : 'autores';
        
        try {
            await fetchData(endpoint, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(autor)
            });
            mostrarNotificacao(`Autor ${id ? 'atualizado' : 'salvo'} com sucesso!`, 'success');
            fecharModal(elementos.modalAutor);
            carregarAutores();
            carregarAutoresParaSelect();
        } catch (err) {
            mostrarNotificacao(err.message, 'error');
        }
    };
    
    window.abrirEdicaoLivro = (id) => {
        const livro = todosLivros.find(l => l.id === id);
        if (livro) {
            elementos.idLivro.value = livro.id;
            elementos.tituloLivro.value = livro.titulo;
            elementos.autorLivroSelect.value = livro.autor.id;
            elementos.dataPublicacaoLivro.value = livro.dataPublicacao;
            elementos.editoraLivro.value = livro.editora;
            elementos.resumoLivro.value = livro.resumo;
            abrirModal(elementos.modalLivro, "Editar Livro");
        }
    };
    
    window.deletarLivro = async (id) => {
        if (confirm('Tem certeza que deseja excluir este livro?')) {
            try {
                await fetchData(`livros/${id}`, { method: 'DELETE' });
                mostrarNotificacao('Livro excluído com sucesso!', 'success');
                carregarLivros();
            } catch (err) {
                mostrarNotificacao(err.message, 'error');
            }
        }
    };

    const salvarLivro = async (e) => {
        e.preventDefault();
        const id = elementos.idLivro.value;
        const livro = {
            titulo: elementos.tituloLivro.value,
            autor: { id: elementos.autorLivroSelect.value },
            dataPublicacao: elementos.dataPublicacaoLivro.value || null,
            editora: elementos.editoraLivro.value,
            resumo: elementos.resumoLivro.value,
        };
        if (id) {
            livro.id = id;
        }

        const method = id ? 'PUT' : 'POST';
        const endpoint = id ? `livros/${id}` : 'livros';

        try {
            await fetchData(endpoint, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(livro)
            });
            mostrarNotificacao(`Livro ${id ? 'atualizado' : 'salvo'} com sucesso!`, 'success');
            fecharModal(elementos.modalLivro);
            carregarLivros();
        } catch (err) {
            mostrarNotificacao(err.message, 'error');
        }
    };
    
    window.mostrarResumo = (titulo, resumo) => {
        elementos.tituloModalResumo.textContent = `Resumo de "${titulo}"`;
        elementos.conteudoModalResumo.textContent = resumo;
        abrirModal(elementos.modalResumo);
    };

    // --- Funções Utilitárias ---

    const mostrarNotificacao = (mensagem, tipo) => {
        elementos.notificacao.textContent = mensagem;
        elementos.notificacao.className = `notificacao ${tipo} mostrar`;
        setTimeout(() => {
            elementos.notificacao.classList.remove('mostrar');
        }, 3000);
    };

    // --- Configuração dos Event Listeners ---

    const inicializar = () => {
        // Carregamento inicial
        carregarAutores();
        carregarLivros();
        carregarAutoresParaSelect();

        // Navegação
        elementos.navegacao.addEventListener('click', e => {
            if (e.target.classList.contains('link-navegacao')) {
                e.preventDefault();
                const alvoId = e.target.getAttribute('data-alvo');
                elementos.secoes.forEach(s => s.classList.add('escondido'));
                document.getElementById(alvoId).classList.remove('escondido');
                
                elementos.navegacao.querySelectorAll('.link-navegacao').forEach(l => l.classList.remove('ativo'));
                e.target.classList.add('ativo');
            }
        });

        // Botões
        elementos.btnAdicionarAutor.addEventListener('click', () => abrirModal(elementos.modalAutor, 'Adicionar Autor'));
        elementos.btnAdicionarLivro.addEventListener('click', () => abrirModal(elementos.modalLivro, 'Adicionar Livro'));
        elementos.btnAtualizarAutores.addEventListener('click', carregarAutores);
        elementos.btnAtualizarLivros.addEventListener('click', carregarLivros);
        
        // Formulários
        elementos.formAutor.addEventListener('submit', salvarAutor);
        elementos.formLivro.addEventListener('submit', salvarLivro);

        // Pesquisa
        elementos.pesquisaAutorInput.addEventListener('input', e => {
            const termo = e.target.value.toLowerCase();
            const filtrados = todosAutores.filter(a => a.nome.toLowerCase().includes(termo));
            renderizarTabelaAutores(filtrados);
        });

        elementos.pesquisaLivroInput.addEventListener('input', e => {
            const termo = e.target.value.toLowerCase();
            const filtrados = todosLivros.filter(l => l.titulo.toLowerCase().includes(termo));
            renderizarTabelaLivros(filtrados);
        });

        // Modais
        elementos.fecharModais.forEach(btn => {
            btn.addEventListener('click', () => {
                const modalId = btn.getAttribute('data-modal');
                fecharModal(document.getElementById(modalId));
            });
        });

        window.addEventListener('click', e => {
            if (e.target.classList.contains('modal')) {
                fecharModal(e.target);
            }
        });

        // Menu Mobile
        elementos.btnMenuMobile.addEventListener('click', (event) => {
            event.stopPropagation();
            elementos.barraLateral.classList.toggle('aberta');
        });
        document.addEventListener('click', (event) => {
            if (elementos.barraLateral.classList.contains('aberta') && !elementos.barraLateral.contains(event.target) && event.target !== elementos.btnMenuMobile) {
                elementos.barraLateral.classList.remove('aberta');
            }
        });
    };

    inicializar();
});