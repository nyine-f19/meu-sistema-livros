document.addEventListener('DOMContentLoaded', function () {
    const URL_BASE_API = 'http://localhost:8080';
    const URL_API_AUTORES = `${URL_BASE_API}/autores`;
    const URL_API_LIVROS = `${URL_BASE_API}/livros`;
    let todosOsAutores = [];
    let todosOsLivros = [];

    const navegacaoPrincipal = document.getElementById('navegacao-principal');
    const secoes = document.querySelectorAll('.secao-conteudo');
    const notificacao = document.getElementById('notificacao');

    function mostrarSecao(idAlvo) {
        secoes.forEach(secao => secao.classList.add('escondido'));
        document.getElementById(idAlvo)?.classList.remove('escondido');

        navegacaoPrincipal.querySelectorAll('.link-navegacao').forEach(link => {
            link.classList.remove('ativo');
            if (link.dataset.alvo === idAlvo) {
                link.classList.add('ativo');
            }
        });
    }

    navegacaoPrincipal.addEventListener('click', (e) => {
        if (e.target.matches('.link-navegacao')) {
            e.preventDefault();
            const idAlvo = e.target.dataset.alvo;
            mostrarSecao(idAlvo);
        }
    });

    function mostrarNotificacao(mensagem, tipo = 'success') {
        notificacao.textContent = mensagem;
        notificacao.className = `notificacao ${tipo} mostrar`;
        setTimeout(() => notificacao.classList.remove('mostrar'), 3000);
    }
    
    const secaoAutor = {
        corpoTabela: document.getElementById('tabela-autores').querySelector('tbody'),
        inputPesquisa: document.getElementById('pesquisa-autor-input'),
        btnAdicionar: document.getElementById('btn-adicionar-autor'),
        btnAtualizar: document.getElementById('btn-atualizar-autores'),
        modal: document.getElementById('modal-autor'),
        formulario: document.getElementById('formulario-autor'),
        idInput: document.getElementById('id-autor'),
        tituloModal: document.getElementById('titulo-modal-autor'),
        spinner: document.getElementById('spinner-carregamento-autor')
    };

    async function buscarAutores() {
        secaoAutor.spinner.classList.remove('escondido');
        try {
            const resposta = await fetch(URL_API_AUTORES);
            if (!resposta.ok) throw new Error('Erro ao carregar autores.');
            todosOsAutores = await resposta.json();
            exibirAutores(todosOsAutores);
            preencherDropdownAutores();
        } catch (erro) {
            mostrarNotificacao(erro.message, 'error');
        } finally {
            secaoAutor.spinner.classList.add('escondido');
        }
    }

    function exibirAutores(autores) {
        secaoAutor.corpoTabela.innerHTML = '';
        if (autores.length === 0) {
            secaoAutor.corpoTabela.innerHTML = '<tr><td colspan="5">Nenhum autor encontrado.</td></tr>';
            return;
        }
        autores.forEach(autor => {
            const linha = secaoAutor.corpoTabela.insertRow();
            linha.innerHTML = `
                <td>${autor.id}</td><td>${autor.nome}</td>
                <td>${autor.nacionalidade || 'N/A'}</td>
                <td>${autor.dataNascimento ? new Date(autor.dataNascimento + 'T00:00:00').toLocaleDateString('pt-BR') : 'N/A'}</td>
                <td><button class="btn btn-warning btn-editar" data-tipo="autor" data-id="${autor.id}">Editar</button> <button class="btn btn-danger btn-excluir" data-tipo="autor" data-id="${autor.id}">Excluir</button></td>
            `;
        });
    }
    
    secaoAutor.btnAdicionar.addEventListener('click', () => {
        secaoAutor.formulario.reset();
        secaoAutor.idInput.value = '';
        secaoAutor.tituloModal.textContent = 'Adicionar Autor';
        secaoAutor.modal.style.display = 'flex';
    });

    secaoAutor.btnAtualizar.addEventListener('click', buscarAutores);

    secaoAutor.formulario.addEventListener('submit', async (e) => {
        e.preventDefault();
        const id = secaoAutor.idInput.value;
        const metodo = id ? 'PUT' : 'POST';
        const url = id ? `${URL_API_AUTORES}/${id}` : URL_API_AUTORES;
        const dadosAutor = {
            nome: document.getElementById('nome-autor').value,
            nacionalidade: document.getElementById('nacionalidade-autor').value,
            dataNascimento: document.getElementById('data-nascimento-autor').value || null
        };
        
        try {
            const resposta = await fetch(url, { method: metodo, headers: {'Content-Type': 'application/json'}, body: JSON.stringify(dadosAutor) });
            if (!resposta.ok) {
                const err = await resposta.json();
                throw new Error(err.message);
            }
            secaoAutor.modal.style.display = 'none';
            buscarAutores();
            mostrarNotificacao(`Autor ${id ? 'atualizado' : 'adicionado'}!`);
        } catch (erro) {
            mostrarNotificacao(erro.message, 'error');
        }
    });
    
    secaoAutor.inputPesquisa.addEventListener('input', () => {
        const consulta = secaoAutor.inputPesquisa.value.toLowerCase();
        const filtrado = todosOsAutores.filter(a => a.nome.toLowerCase().includes(consulta));
        exibirAutores(filtrado);
    });

    const secaoLivro = {
        corpoTabela: document.getElementById('tabela-livros').querySelector('tbody'),
        inputPesquisa: document.getElementById('pesquisa-livro-input'),
        btnAdicionar: document.getElementById('btn-adicionar-livro'),
        btnAtualizar: document.getElementById('btn-atualizar-livros'),
        modal: document.getElementById('modal-livro'),
        formulario: document.getElementById('formulario-livro'),
        idInput: document.getElementById('id-livro'),
        selectAutor: document.getElementById('autor-livro'),
        tituloModal: document.getElementById('titulo-modal-livro'),
        spinner: document.getElementById('spinner-carregamento-livro')
    };
    
    async function buscarLivros() {
        secaoLivro.spinner.classList.remove('escondido');
        try {
            const resposta = await fetch(URL_API_LIVROS);
            if (!resposta.ok) throw new Error('Erro ao carregar livros.');
            todosOsLivros = await resposta.json();
            exibirLivros(todosOsLivros);
        } catch (erro) {
            mostrarNotificacao(erro.message, 'error');
        } finally {
            secaoLivro.spinner.classList.add('escondido');
        }
    }
    
    function exibirLivros(livros) {
        secaoLivro.corpoTabela.innerHTML = '';
        if (livros.length === 0) {
            secaoLivro.corpoTabela.innerHTML = '<tr><td colspan="7">Nenhum livro encontrado.</td></tr>';
            return;
        }
        livros.forEach(livro => {
            const linha = secaoLivro.corpoTabela.insertRow();
            const resumoCurto = livro.resumo && livro.resumo.length > 50 
                ? livro.resumo.substring(0, 50) + '...' 
                : (livro.resumo || 'N/A');

            linha.innerHTML = `
                <td>${livro.id}</td>
                <td>${livro.titulo}</td>
                <td>${livro.autor.nome}</td>
                <td>${livro.dataPublicacao ? new Date(livro.dataPublicacao + 'T00:00:00').toLocaleDateString('pt-BR') : 'N/A'}</td>
                <td>${livro.editora || 'N/A'}</td>
                <td class="resumo-clicavel" onclick="mostrarResumoCompleto(this)" data-resumo="${livro.resumo || ''}">
                    ${resumoCurto}
                </td>
                <td><button class="btn btn-warning btn-editar" data-tipo="livro" data-id="${livro.id}">Editar</button> <button class="btn btn-danger btn-excluir" data-tipo="livro" data-id="${livro.id}">Excluir</button></td>
            `;
        });
    }

    function preencherDropdownAutores() {
        secaoLivro.selectAutor.innerHTML = '<option value="">Selecione um autor...</option>';
        todosOsAutores.forEach(autor => {
            const option = document.createElement('option');
            option.value = autor.id;
            option.textContent = autor.nome;
            secaoLivro.selectAutor.appendChild(option);
        });
    }
    
    secaoLivro.btnAdicionar.addEventListener('click', () => {
        secaoLivro.formulario.reset();
        secaoLivro.idInput.value = '';
        secaoLivro.tituloModal.textContent = 'Adicionar Livro';
        secaoLivro.modal.style.display = 'flex';
    });

    secaoLivro.btnAtualizar.addEventListener('click', buscarLivros);
    
    secaoLivro.formulario.addEventListener('submit', async (e) => {
        e.preventDefault();
        const idAutor = document.getElementById('autor-livro').value;
        if (!idAutor) {
            mostrarNotificacao("Por favor, selecione um autor.", "error");
            return;
        }
        const id = secaoLivro.idInput.value;
        const metodo = id ? 'PUT' : 'POST';
        const url = id ? `${URL_API_LIVROS}/${id}` : URL_API_LIVROS;
        const dadosLivro = {
            titulo: document.getElementById('titulo-livro').value,
            dataPublicacao: document.getElementById('data-publicacao-livro').value || null,
            editora: document.getElementById('editora-livro').value,
            resumo: document.getElementById('resumo-livro').value,
            autor: { id: idAutor }
        };

        try {
            const resposta = await fetch(url, { method: metodo, headers: {'Content-Type': 'application/json'}, body: JSON.stringify(dadosLivro) });
            if (!resposta.ok) {
                const err = await resposta.json();
                throw new Error(err.message || err.error);
            }
            secaoLivro.modal.style.display = 'none';
            buscarLivros();
            mostrarNotificacao(`Livro ${id ? 'atualizado' : 'adicionado'}!`);
        } catch (erro) {
            mostrarNotificacao(erro.message, 'error');
        }
    });
    
    secaoLivro.inputPesquisa.addEventListener('input', () => {
        const consulta = secaoLivro.inputPesquisa.value.toLowerCase();
        const filtrado = todosOsLivros.filter(l => l.titulo.toLowerCase().includes(consulta) || l.autor.nome.toLowerCase().includes(consulta));
        exibirLivros(filtrado);
    });

    document.body.addEventListener('click', async (e) => {
        if (e.target.matches('.fechar-modal')) {
            document.getElementById(e.target.dataset.modal).style.display = 'none';
        }
        if (e.target.matches('.modal')) {
            e.target.style.display = 'none';
        }

        if (e.target.matches('.btn-excluir')) {
            const tipo = e.target.dataset.tipo;
            const id = e.target.dataset.id;
            if (confirm(`Tem certeza que deseja excluir este ${tipo}?`)) {
                const url = tipo === 'autor' ? `${URL_API_AUTORES}/${id}` : `${URL_API_LIVROS}/${id}`;
                try {
                    const resposta = await fetch(url, { method: 'DELETE' });
                    if (!resposta.ok) {
                        const err = await resposta.json();
                        throw new Error(err.message || 'Erro ao excluir.');
                    }
                    mostrarNotificacao(`${tipo.charAt(0).toUpperCase() + tipo.slice(1)} excluído!`);
                    tipo === 'autor' ? buscarAutores() : buscarLivros();
                } catch(erro) {
                    mostrarNotificacao(erro.message, 'error');
                }
            }
        }
        
        if (e.target.matches('.btn-editar')) {
            const tipo = e.target.dataset.tipo;
            const id = e.target.dataset.id;
            if (tipo === 'autor') {
                const autor = todosOsAutores.find(a => a.id == id);
                if (autor) {
                    secaoAutor.formulario.reset();
                    secaoAutor.idInput.value = autor.id;
                    document.getElementById('nome-autor').value = autor.nome;
                    document.getElementById('nacionalidade-autor').value = autor.nacionalidade;
                    document.getElementById('data-nascimento-autor').value = autor.dataNascimento;
                    secaoAutor.tituloModal.textContent = 'Editar Autor';
                    secaoAutor.modal.style.display = 'flex';
                }
            } else if (tipo === 'livro') {
                const livro = todosOsLivros.find(l => l.id == id);
                if (livro) {
                    secaoLivro.formulario.reset();
                    secaoLivro.idInput.value = livro.id;
                    document.getElementById('titulo-livro').value = livro.titulo;
                    document.getElementById('autor-livro').value = livro.autor.id;
                    document.getElementById('data-publicacao-livro').value = livro.dataPublicacao;
                    document.getElementById('editora-livro').value = livro.editora;
                    document.getElementById('resumo-livro').value = livro.resumo;
                    secaoLivro.tituloModal.textContent = 'Editar Livro';
                    secaoLivro.modal.style.display = 'flex';
                }
            }
        }
    });

    function mostrarResumoCompleto(elemento) {
        const resumoCompleto = elemento.dataset.resumo;
        if (resumoCompleto) {
            document.getElementById('conteudo-modal-resumo').textContent = resumoCompleto;
            document.getElementById('modal-resumo').style.display = 'flex';
        }
    }
    window.mostrarResumoCompleto = mostrarResumoCompleto;

    async function iniciar() {
        mostrarSecao('secao-autores');
        await buscarAutores();
        await buscarLivros();
    }

    iniciar();
});