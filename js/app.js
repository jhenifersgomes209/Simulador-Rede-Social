/* 
    Aqui eu guardo as informações principais do Graphogram.
    Utilizo o localStorage para manter os dados mesmo depois de fechar o navegador.
*/

const STORAGE_KEY = 'graphogram_dados_v1';


// USUÁRIOS INICIAIS

/*
    cadastro dos usuários que utilizo inicialmente.
    O primeiro usuário é o meu perfil e os outros três representam
    as pessoas que fazem parte da rede.
*/

const usuariosIniciais = [
    {
        id: 'usuario',
        name: 'usuario test',
        username: 'usuario_test',
        bio: 'Fazendo novas conexões no Graphogram.',
        photo: 'assets/images/usuario.jpeg'
    },
    {
        id: 'fiori',
        name: 'Diego Fiori',
        username: 'di_fiori',
        bio: 'tiros, rock e codigos, sempre em busca de novas aventuras.',
        photo: 'assets/images/fiori.png'
    },
    {
        id: 'marcao',
        name: 'Marcus ataide',
        username: 'mvataide77',
        bio: 'Overview, itaipu, nvidia',
        photo: 'assets/images/marcao.jpeg'
    },
    {
        id: 'aconccia',
        name: 'Mauricio accocia',
        username: 'coxinhaDev',
        bio: 'coxinha de frango, pão de batata... comendo e cozinhando.',
        photo: 'assets/images/acconcia.jpg'
    },
    {
        id: 'renato',
        name: 'Renato cagnin',
        username: 'o_carada_IA',
        bio: '',
        photo: 'assets/images/renato.png'
    }
];


// CARREGAMENTO DOS DADOS

/*
    verifico se já existem dados salvos no navegador.
    Caso seja o primeiro acesso, utilizo os quatro usuários iniciais.
*/


function carregarDados() {
    const dadosSalvos = localStorage.getItem(STORAGE_KEY);

    if (dadosSalvos) {
        try {
            const dados = JSON.parse(dadosSalvos);

            if (
                Array.isArray(dados.usuarios) &&
                Array.isArray(dados.conexoes) &&
                Array.isArray(dados.publicacoes)
            ) {
                return dados;
            }
        } catch (erro) {
            console.error('Não foi possível carregar os dados:', erro);
        }
    }

    return {
        usuarios: usuariosIniciais,
        conexoes: [],
        publicacoes: [
            {
                id: 'post2',
                usuarioId: 'fiori',
                caption: 'Nova parceria com a manual, muito contente com o resultado!',
                photo: 'assets/images/publifiori.png',
                date: new Date().toISOString(),
                likes: []
            },
            {
                id: 'post3',
                usuarioId: 'marcao',
                caption: 'Um overview de circuitos eletricos, muito obrigado aos alunos presentes!',
                photo: 'assets/images/publimarcao.png',
                date: new Date().toISOString(),
                likes: []
            },
            {
                id: 'post4',
                usuarioId: 'aconccia',
                caption: 'Novo trabalho de dançarino, muito feliz com a oportunidade!',
                photo: 'assets/images/dancarino.png',
                date: new Date().toISOString(),
                likes: []
            },
            {
                id: 'post5',
                usuarioId: 'renato',
                caption: 'Grande dia!',
                photo: 'assets/images/publirenato.jpeg',
                date: new Date().toISOString(),
                likes: []
            }
        ]
    };
}

let dados = carregarDados();


// FUNÇÕES GERAIS

/*
    Aqui eu salvo as alterações realizadas no site.
    Assim, os usuários, as conexões e as publicações continuam
    disponíveis quando eu abrir o Graphogram novamente.
*/

function salvarDados() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(dados));
}

/*
    Aqui eu procuro um usuário pelo seu identificador.
    Essa função facilita o acesso aos dados de cada pessoa.
*/

function buscarUsuario(id) {
    return dados.usuarios.find(usuario => usuario.id === id);
}

/*
    Aqui eu preparo o nome para aparecer em formato de iniciais
    quando a imagem do usuário não estiver disponível.
*/

function pegarIniciais(nome) {
    return nome
        .trim()
        .split(' ')
        .filter(palavra => palavra.length > 0)
        .slice(0, 2)
        .map(palavra => palavra[0].toUpperCase())
        .join('');
}

/*
    Aqui eu gero uma imagem simples com as iniciais do usuário.
    Utilizo essa imagem quando ainda não existe uma foto cadastrada.
*/

function imagemPadrao(nome) {
    const iniciais = pegarIniciais(nome);

    const svg = `
        <svg xmlns="http://www.w3.org/2000/svg" width="120" height="120">
            <rect width="120" height="120" rx="60" fill="#292d4c"/>
            <text
                x="50%"
                y="53%"
                dominant-baseline="middle"
                text-anchor="middle"
                font-size="38"
                font-family="Arial"
                font-weight="bold"
                fill="#b1a6ff"
            >${iniciais}</text>
        </svg>
    `;

    return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
}

/*
    Aqui eu defino qual imagem deve aparecer para cada usuário.
    Se a foto não existir, utilizo a imagem com as iniciais.
*/

function obterFoto(usuario) {
    return usuario.photo || imagemPadrao(usuario.name);
}

/*
    Aqui eu formato a data das publicações para o padrão brasileiro.
*/

function formatarData(data) {
    return new Date(data).toLocaleString('pt-BR', {
        day: '2-digit',
        month: 'short',
        hour: '2-digit',
        minute: '2-digit'
    });
}

/*
    Aqui eu protejo os textos antes de adicioná-los ao HTML.
    Isso evita que caracteres digitados pelos usuários sejam
    interpretados como elementos da página.
*/

function escaparHTML(texto = '') {
    return String(texto).replace(/[&<>"']/g, caractere => {
        const caracteres = {
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#039;'
        };

        return caracteres[caractere];
    });
}

/*
    Aqui eu mostro mensagens rápidas para informar o resultado
    de algumas ações realizadas no Graphogram.
*/

let tempoMensagem;

function mostrarMensagem(mensagem) {
    const toast = document.getElementById('toast');

    toast.textContent = mensagem;
    toast.classList.add('show');

    clearTimeout(tempoMensagem);

    tempoMensagem = setTimeout(() => {
        toast.classList.remove('show');
    }, 2500);
}


// NAVEGAÇÃO ENTRE AS PÁGINAS

/*
    Aqui eu controlo qual página aparece quando clico no menu lateral.
    Também atualizo o título do cabeçalho de acordo com a página escolhida.
*/

const titulosPaginas = {
    home: 'Seu espaço, suas conexões.',
    people: 'Pessoas que fazem parte da rede.',
    graph: 'Visualize como sua rede se conecta.'
};

function abrirPagina(nomePagina) {
    const paginas = document.querySelectorAll('.page');
    const botoesMenu = document.querySelectorAll('.nav-link');

    paginas.forEach(pagina => {
        pagina.classList.remove('active');
    });

    botoesMenu.forEach(botao => {
        botao.classList.remove('active');
    });

    const paginaSelecionada = document.getElementById(`page-${nomePagina}`);
    const botaoSelecionado = document.querySelector(
        `.nav-link[data-page="${nomePagina}"]`
    );

    if (!paginaSelecionada) return;

    paginaSelecionada.classList.add('active');
    // Ajusta o espaço da tela quando o grafo estiver aberto
    document.querySelector('.app-container').classList.toggle(
        'graph-page',
        nomePagina === 'graph'
    );

    if (botaoSelecionado) {
        botaoSelecionado.classList.add('active');
    }

    document.getElementById('pageTitle').textContent =
        titulosPaginas[nomePagina];

    document.getElementById('rightSidebar').style.display =
        nomePagina === 'graph' ? 'none' : '';

    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

/*
    Aqui eu adiciono o evento de clique em cada opção do menu.
*/

document.querySelectorAll('.nav-link').forEach(botao => {
    botao.addEventListener('click', () => {
        abrirPagina(botao.dataset.page);
    });
});

/*
    Aqui eu permito que o botão Ver todos da lateral abra a página Pessoas.
*/

document.querySelectorAll('[data-goto]').forEach(botao => {
    botao.addEventListener('click', () => {
        abrirPagina(botao.dataset.goto);
    });
});


// CONTROLE DAS JANELAS

/*
    Aqui eu crio uma função para abrir as janelas de cadastro,
    publicação e configuração de conexões.
*/

function abrirModal(id) {
    document.getElementById(id).classList.add('open');
}

/*
    Aqui eu fecho a janela selecionada.
*/

function fecharModal(id) {
    document.getElementById(id).classList.remove('open');
}

/*
    Aqui eu conecto os botões que abrem cada janela.
*/

document.getElementById('openUserModal').addEventListener('click', () => {
    abrirModal('userModal');
});

document.getElementById('openConnectionsModal').addEventListener('click', () => {
    atualizarSeletoresConexoes();
    renderizarConexoes();
    abrirModal('connectionsModal');
});

document.getElementById('newPostTextBtn').addEventListener('click', () => {
    abrirModal('postModal');
});

/*
    Aqui eu conecto os botões de fechar das janelas.
*/

document.querySelectorAll('[data-close]').forEach(botao => {
    botao.addEventListener('click', () => {
        fecharModal(botao.dataset.close);
    });
});

/*
    Aqui eu permito fechar a janela quando clico fora dela.
*/

document.querySelectorAll('.modal-backdrop').forEach(modal => {
    modal.addEventListener('click', evento => {
        if (evento.target === modal) {
            modal.classList.remove('open');
        }
    });
});

/*
    Aqui eu permito fechar qualquer janela aberta usando a tecla Escape.
*/

document.addEventListener('keydown', evento => {
    if (evento.key === 'Escape') {
        document.querySelectorAll('.modal-backdrop.open').forEach(modal => {
            modal.classList.remove('open');
        });
    }
});

// Salva os dados quando clicar no botão
document.getElementById('saveDataButton').addEventListener('click', () => {
    salvarDados();
    mostrarMensagem('Dados salvos com sucesso!');
});
// CADASTRO DE USUÁRIOS

/*
    Aqui eu cadastro uma nova pessoa na rede.
    O usuário começa sem foto e recebe uma imagem com suas iniciais.
*/

document.getElementById('userForm').addEventListener('submit', evento => {
    evento.preventDefault();

    const nome = document.getElementById('userName').value.trim();

    const username = document.getElementById('userUsername').value
        .trim()
        .replace(/^@/, '')
        .toLowerCase();

    const bio = document.getElementById('userBio').value.trim();

    if (!nome || !username) {
        mostrarMensagem('Preencha o nome e o nome de usuário.');
        return;
    }

    /*
        Aqui eu verifico se o nome de usuário já está sendo utilizado.
    */

    const usuarioExistente = dados.usuarios.some(usuario => {
        return usuario.username.toLowerCase() === username;
    });

    if (usuarioExistente) {
        mostrarMensagem('Esse nome de usuário já está cadastrado.');
        return;
    }

    /*
        Aqui eu crio um identificador único para o novo usuário.
    */

    const novoUsuario = {
        id: `usuario_${Date.now()}`,
        name: nome,
        username: username,
        bio: bio || 'Novo integrante do Graphogram.',
        photo: ''
    };

    dados.usuarios.push(novoUsuario);

    salvarDados();
    atualizarSite();

    evento.target.reset();
    fecharModal('userModal');

    mostrarMensagem('Usuário cadastrado com sucesso!');
});


// CONFIGURAÇÃO DE QUEM SEGUE QUEM

/*
    Aqui eu preencho os seletores com todos os usuários cadastrados.
    O primeiro campo representa quem segue e o segundo representa
    quem está sendo seguido.
*/

function atualizarSeletoresConexoes() {
    const seletorSeguidor = document.getElementById('followerSelect');
    const seletorSeguido = document.getElementById('followedSelect');

    const opcaoInicial = '<option value="">Selecione uma pessoa</option>';

    seletorSeguidor.innerHTML = opcaoInicial;
    seletorSeguido.innerHTML = opcaoInicial;

    dados.usuarios.forEach(usuario => {
        const opcao = `
            <option value="${escaparHTML(usuario.id)}">
                ${escaparHTML(usuario.name)}
            </option>
        `;

        seletorSeguidor.innerHTML += opcao;
        seletorSeguido.innerHTML += opcao;
    });
}

/*
    Aqui eu verifico se uma relação entre duas pessoas já existe.
    Dessa forma, não cadastro a mesma conexão mais de uma vez.
*/

function conexaoExiste(seguidorId, seguidoId) {
    return dados.conexoes.some(conexao => {
        return (
            conexao.seguidor === seguidorId &&
            conexao.seguido === seguidoId
        );
    });
}

/*
    Aqui eu adiciono uma relação de seguir entre dois usuários.
    A direção da relação é importante para representar as arestas
    do grafo dirigido.
*/

function adicionarConexao(seguidorId, seguidoId) {
    if (!seguidorId || !seguidoId) {
        mostrarMensagem('Selecione as duas pessoas.');
        return false;
    }

    if (seguidorId === seguidoId) {
        mostrarMensagem('Uma pessoa não pode seguir a si mesma.');
        return false;
    }

    if (conexaoExiste(seguidorId, seguidoId)) {
        mostrarMensagem('Essa conexão já está cadastrada.');
        return false;
    }

    dados.conexoes.push({
        id: `conexao_${Date.now()}`,
        seguidor: seguidorId,
        seguido: seguidoId
    });

    salvarDados();
    atualizarSite();

    return true;
}

/*
    Aqui eu recebo os dados selecionados no formulário de conexões.
*/

document.getElementById('connectionForm').addEventListener('submit', evento => {
    evento.preventDefault();

    const seguidorId = document.getElementById('followerSelect').value;
    const seguidoId = document.getElementById('followedSelect').value;

    const adicionou = adicionarConexao(seguidorId, seguidoId);

    if (adicionou) {
        evento.target.reset();
        atualizarSeletoresConexoes();
        renderizarConexoes();

        mostrarMensagem('Conexão adicionada com sucesso!');
    }
});

/*
    Aqui eu apresento todas as relações cadastradas.
    Também deixo um botão para remover uma conexão quando necessário.
*/

function renderizarConexoes() {
    const lista = document.getElementById('connectionsList');

    if (dados.conexoes.length === 0) {
        lista.innerHTML = `
            <div class="empty-state">
                Ainda não existem conexões cadastradas.
            </div>
        `;

        return;
    }

    lista.innerHTML = dados.conexoes.map(conexao => {
        const seguidor = buscarUsuario(conexao.seguidor);
        const seguido = buscarUsuario(conexao.seguido);

        if (!seguidor || !seguido) return '';

        return `
            <div class="connection-item">
                <span>
                    ${escaparHTML(seguidor.name)}
                    → 
                    ${escaparHTML(seguido.name)}
                </span>

                <button
                    type="button"
                    data-remove-connection="${escaparHTML(conexao.id)}"
                >
                    Remover
                </button>
            </div>
        `;
    }).join('');
}

/*
    Aqui eu identifico quando clico em Remover e retiro a relação
    selecionada da lista de conexões.
*/

document.getElementById('connectionsList').addEventListener('click', evento => {
    const botao = evento.target.closest('[data-remove-connection]');

    if (!botao) return;

    const conexaoId = botao.dataset.removeConnection;

    dados.conexoes = dados.conexoes.filter(conexao => {
        return conexao.id !== conexaoId;
    });

    salvarDados();
    atualizarSite();
    renderizarConexoes();

    mostrarMensagem('Conexão removida.');
});


// PÁGINA DE PESSOAS

/*
    Aqui eu monto os cartões dos usuários cadastrados.
    Também verifico se o meu perfil já segue cada pessoa.
*/

function renderizarPessoas() {
    const grade = document.getElementById('peopleGrid');
    const pesquisa = document.getElementById('peopleSearch').value
        .trim()
        .toLowerCase();

    const pessoasFiltradas = dados.usuarios.filter(usuario => {
        return (
            usuario.name.toLowerCase().includes(pesquisa) ||
            usuario.username.toLowerCase().includes(pesquisa)
        );
    });

    document.getElementById('peopleCount').textContent =
        `${dados.usuarios.length} PESSOAS`;

    if (pessoasFiltradas.length === 0) {
        grade.innerHTML = `
            <div class="empty-state">
                Nenhuma pessoa encontrada.
            </div>
        `;

        return;
    }

    grade.innerHTML = pessoasFiltradas.map(usuario => {
        const seguindo = conexaoExiste('usuario', usuario.id);
        const souEu = usuario.id === 'usuario';

        return `
            <article class="person-card">

                <img
                    src="${escaparHTML(obterFoto(usuario))}"
                    alt="Foto de ${escaparHTML(usuario.name)}"
                >

                <h3>${escaparHTML(usuario.name)}</h3>

                <span class="handle">
                    @${escaparHTML(usuario.username)}
                </span>

                <p>${escaparHTML(usuario.bio)}</p>

                ${
                    souEu
                        ? '<span class="section-label">SEU PERFIL</span>'
                        : `
                            <button
                                class="follow-button ${seguindo ? 'following' : ''}"
                                data-follow-user="${escaparHTML(usuario.id)}"
                            >
                                ${seguindo ? 'Seguindo' : '+ Seguir'}
                            </button>
                        `
                }

            </article>
        `;
    }).join('');
}

/*
    Aqui eu permito pesquisar pessoas pelo nome ou pelo nome de usuário.
*/

document.getElementById('peopleSearch').addEventListener('input', () => {
    renderizarPessoas();
});

/*
    Aqui eu conecto o botão Seguir dos cartões.
    Ao clicar, eu adiciono ou removo a relação entre meu perfil e a pessoa.
*/

document.getElementById('peopleGrid').addEventListener('click', evento => {
    const botao = evento.target.closest('[data-follow-user]');

    if (!botao) return;

    const usuarioId = botao.dataset.followUser;

    if (conexaoExiste('usuario', usuarioId)) {
        dados.conexoes = dados.conexoes.filter(conexao => {
            return !(
                conexao.seguidor === 'usuario' &&
                conexao.seguido === usuarioId
            );
        });

        mostrarMensagem('Você deixou de seguir essa pessoa.');
    } else {
        const adicionou = adicionarConexao('usuario', usuarioId);

        if (!adicionou) return;

        mostrarMensagem('Você começou a seguir essa pessoa!');
    }

    salvarDados();
    atualizarSite();
});


// STORIES

/*
    Aqui eu atualizo os stories com os usuários cadastrados.
    Cada pessoa aparece com sua foto redonda e seu nome embaixo.
*/

function renderizarStories() {
    const stories = document.getElementById('storiesRow');

    stories.innerHTML = `
        <button class="story-item add-story" id="storyAdd">
            <div class="story-avatar">
                <span>+</span>
            </div>

            <span>Seu story</span>
        </button>

        ${dados.usuarios.map(usuario => `
            <button
                class="story-item"
                type="button"
                data-story-user="${escaparHTML(usuario.id)}"
            >
                <div class="story-avatar">
                    <img
                        src="${escaparHTML(obterFoto(usuario))}"
                        alt="Foto de ${escaparHTML(usuario.name)}"
                    >
                </div>

                <span>${escaparHTML(usuario.id === 'usuario' ? 'Você' : usuario.name.split(' ')[0])}</span>
            </button>
        `).join('')}
    `;

    document.getElementById('storyAdd').addEventListener('click', () => {
        mostrarMensagem('A publicação de stories será adicionada depois.');
    });
}

/*
    Aqui eu identifico quando clico no story de uma pessoa.
    Por enquanto, mostro uma mensagem porque a visualização de stories
    ainda não faz parte desta etapa do projeto.
*/

document.getElementById('storiesRow').addEventListener('click', evento => {
    const story = evento.target.closest('[data-story-user]');

    if (!story) return;

    const usuario = buscarUsuario(story.dataset.storyUser);

    if (usuario) {
        mostrarMensagem(`Story de ${usuario.name}`);
    }
});


// PUBLICAÇÕES

/*
    Aqui eu preparo a criação de uma publicação.
    A foto selecionada é convertida para um formato que pode ser
    armazenado junto com os dados no localStorage.
*/

document.getElementById('postForm').addEventListener('submit', evento => {
    evento.preventDefault();

    const descricao = document.getElementById('postCaption').value.trim();
    const arquivo = document.getElementById('postPhoto').files[0];

    if (!arquivo) {
        mostrarMensagem('Escolha uma foto para publicar.');
        return;
    }

    if (!arquivo.type.startsWith('image/')) {
        mostrarMensagem('Selecione um arquivo de imagem.');
        return;
    }

    const leitor = new FileReader();

    leitor.onload = () => {
        const novaPublicacao = {
            id: `post_${Date.now()}`,
            usuarioId: 'usuario',
            caption: descricao,
            photo: leitor.result,
            likes: [],
            date: new Date().toISOString()
        };

        dados.publicacoes.unshift(novaPublicacao);

        try {
            salvarDados();
            atualizarSite();

            evento.target.reset();
            fecharModal('postModal');

            mostrarMensagem('Publicação criada com sucesso!');
        } catch (erro) {
            dados.publicacoes.shift();

            mostrarMensagem(
                'Não foi possível salvar a foto. Tente uma imagem menor.'
            );
        }
    };

    leitor.onerror = () => {
        mostrarMensagem('Não foi possível carregar a imagem.');
    };

    leitor.readAsDataURL(arquivo);
});

/*
    Aqui eu apresento as publicações na timeline.
    Cada publicação mostra o autor, a data, a descrição e a foto.
*/

function renderizarPublicacoes() {
    const feed = document.getElementById('feed');

    if (dados.publicacoes.length === 0) {
        feed.innerHTML = `
            <div class="empty-state">
                Ainda não existem publicações.
                <br>
                Crie uma publicação para começar a movimentar sua timeline.
            </div>
        `;

        return;
    }

    feed.innerHTML = dados.publicacoes.map(publicacao => {
        const usuario = buscarUsuario(publicacao.usuarioId);

        if (!usuario) return '';

        const curtida = publicacao.likes.includes('usuario');

        return `
            <article class="post-card">

                <div class="post-head">

                    <img
                        class="avatar"
                        src="${escaparHTML(obterFoto(usuario))}"
                        alt="Foto de ${escaparHTML(usuario.name)}"
                    >

                    <div class="post-author">
                        <strong>${escaparHTML(usuario.name)}</strong>

                        <small>
                            @${escaparHTML(usuario.username)}
                            · ${formatarData(publicacao.date)}
                        </small>
                    </div>

                    <span class="post-menu">•••</span>

                </div>

                <p class="post-caption">
                    ${escaparHTML(publicacao.caption)}
                </p>

                <img
                    class="post-image"
                    src="${escaparHTML(publicacao.photo)}"
                    alt="Imagem da publicação"
                >

                <div class="post-actions">

                    <button
                        class="action-button ${curtida ? 'liked' : ''}"
                        data-like-post="${escaparHTML(publicacao.id)}"
                    >
                        ${curtida ? '♥ Curtido' : '♡ Curtir'}
                    </button>

                    <span class="post-likes">
                        ${publicacao.likes.length} curtidas
                    </span>

                </div>

            </article>
        `;
    }).join('');
}

/*
    Aqui eu controlo as curtidas das publicações.
    Se eu clicar novamente em uma publicação curtida, retiro a curtida.
*/

document.getElementById('feed').addEventListener('click', evento => {
    const botao = evento.target.closest('[data-like-post]');

    if (!botao) return;

    const publicacao = dados.publicacoes.find(item => {
        return item.id === botao.dataset.likePost;
    });

    if (!publicacao) return;

    const jaCurtiu = publicacao.likes.includes('usuario');

    if (jaCurtiu) {
        publicacao.likes = publicacao.likes.filter(id => id !== 'usuario');
    } else {
        publicacao.likes.push('usuario');
    }

    salvarDados();
    atualizarSite();
});


// PERFIL E SUGESTÕES

/*
    Aqui eu atualizo as informações do meu perfil.
    Também calculo quantas pessoas eu sigo e quantas me seguem.
*/

function atualizarPerfil() {
    const usuario = buscarUsuario('usuario');

    if (!usuario) return;

    document.getElementById('topName').textContent = 'usuario';
    document.getElementById('cardName').textContent = usuario.name;
    document.getElementById('cardHandle').textContent = `@${usuario.username}`;
    document.getElementById('cardBio').textContent = usuario.bio;

    document.getElementById('topAvatar').src = obterFoto(usuario);
    document.getElementById('cardAvatar').src = obterFoto(usuario);

    const seguindo = dados.conexoes.filter(conexao => {
        return conexao.seguidor === 'usuario';
    }).length;

    const seguidores = dados.conexoes.filter(conexao => {
        return conexao.seguido === 'usuario';
    }).length;

    const publicacoes = dados.publicacoes.filter(publicacao => {
        return publicacao.usuarioId === 'usuario';
    }).length;

    document.getElementById('statFollowing').textContent = seguindo;
    document.getElementById('statFollowers').textContent = seguidores;
    document.getElementById('statPosts').textContent = publicacoes;
}

/*
    Aqui eu mostro sugestões de pessoas que meu perfil ainda não segue.
*/

function renderizarSugestoes() {
    const lista = document.getElementById('suggestions');

    const sugestoes = dados.usuarios.filter(usuario => {
        return (
            usuario.id !== 'usuario' &&
            !conexaoExiste('usuario', usuario.id)
        );
    });

    if (sugestoes.length === 0) {
        lista.innerHTML = `
            <div class="empty-state">
                Você já segue todos os outros usuários.
            </div>
        `;

        return;
    }

    lista.innerHTML = sugestoes.slice(0, 4).map(usuario => `
        <div class="suggestion">

            <img
                src="${escaparHTML(obterFoto(usuario))}"
                alt="Foto de ${escaparHTML(usuario.name)}"
            >

            <div class="suggestion-info">
                <strong>${escaparHTML(usuario.name)}</strong>
                <small>@${escaparHTML(usuario.username)}</small>
            </div>

            <button
                class="mini-follow"
                data-suggestion-follow="${escaparHTML(usuario.id)}"
            >
                Seguir
            </button>

        </div>
    `).join('');
}

/*
    Aqui eu conecto os botões Seguir que aparecem nas sugestões.
*/

document.getElementById('suggestions').addEventListener('click', evento => {
    const botao = evento.target.closest('[data-suggestion-follow]');

    if (!botao) return;

    const usuarioId = botao.dataset.suggestionFollow;

    const adicionou = adicionarConexao('usuario', usuarioId);

    if (adicionou) {
        mostrarMensagem('Você começou a seguir essa pessoa!');
    }
});


// ESTATÍSTICAS DO GRAFO

/*
    Aqui eu atualizo os números apresentados na página do grafo.
    Cada usuário representa um vértice e cada relação representa uma aresta.
*/

function atualizarEstatisticasGrafo() {
    document.getElementById('graphVertices').textContent =
        dados.usuarios.length;

    document.getElementById('graphEdges').textContent =
        dados.conexoes.length;
}

/*
    Aqui eu atualizo os números quando clico no botão do grafo.
    A área de visualização continua vazia para receber meu código depois.
*/

document.getElementById('updateGraph').addEventListener('click', () => {
    atualizarEstatisticasGrafo();
    mostrarMensagem('Estatísticas do grafo atualizadas.');
});


// DATA DO CABEÇALHO

/*
    Aqui eu mostro a data atual no cabeçalho do Graphogram.
*/

function atualizarData() {
    const data = new Date();

    document.getElementById('currentDate').textContent =
        data.toLocaleDateString('pt-BR', {
            weekday: 'long',
            day: '2-digit',
            month: 'long'
        }).toUpperCase();
}


// ATUALIZAÇÃO GERAL

/*
    Aqui eu reúno as funções responsáveis por atualizar as informações
    do site depois de um cadastro, uma conexão ou uma publicação.
*/

function atualizarSite() {
    salvarDados();

    renderizarPessoas();
    renderizarStories();
    renderizarPublicacoes();
    renderizarSugestoes();
    renderizarConexoes();

    atualizarPerfil();
    atualizarEstatisticasGrafo();
}


// INICIALIZAÇÃO DO GRAPHOGRAM

/*
    Aqui eu carrego as informações iniciais quando abro o site.
    Primeiro verifico os dados salvos e depois atualizo cada parte da página.
*/

function iniciarGraphogram() {
    atualizarData();
    atualizarSite();
    abrirPagina('home');
}
iniciarGraphogram();
