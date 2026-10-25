
import streamlit as st
import networkx as nx
import matplotlib.pyplot as plt
from algoritmos import busca_em_largura

st.set_page_config(
    page_title="Simulador de Rede Social",
    page_icon="🌐",
    layout="wide"
)

st.title("🌐 Simulador de Rede Social")
st.subheader("Teoria dos Grafos - Grupo 02")

st.write("Gerencie usuários e amizades e visualize as conexões da rede.")

# 1. INICIALIZAR O GRAFO

if "grafo" not in st.session_state:
    G = nx.Graph()

    usuarios = [
        "Jhenifer", "João", "Alexandre", "Yan", "Tiago"
    ]

    amizades = [
        ("Jhenifer", "Yan"),
        ("Jhenifer", "Alexandre"),
        ("Yan", "João"),
        ("Alexandre", "João"),
        ("João", "Tiago")
    ]

    G.add_nodes_from(usuarios)
    G.add_edges_from(amizades)

    st.session_state.grafo = G

G = st.session_state.grafo

# 2. INFORMAÇÕES DA REDE

col1, col2, col3 = st.columns(3)

col1.metric("Usuários", G.number_of_nodes())
col2.metric("Amizades", G.number_of_edges())
col3.metric("Tipo de grafo", "Não dirigido")

st.divider()

# 3. CADASTRAR USUÁRIOS

st.subheader("👤 Cadastrar usuário")

with st.form("form_usuario", clear_on_submit=True):
    nome = st.text_input("Nome do novo usuário")

    cadastrar = st.form_submit_button("Adicionar usuário")

    if cadastrar:
        nome = nome.strip()

        if not nome:
            st.warning("Digite um nome válido.")

        elif nome.casefold() in {
            usuario.casefold() for usuario in G.nodes()
        }:
            st.warning("Esse usuário já existe!")

        else:
            G.add_node(nome)
            st.success(f"Usuário {nome} cadastrado!")
            st.rerun()

st.divider()

# 4. CRIAR AMIZADES

st.subheader("🤝 Criar amizade")

lista_usuarios = sorted(G.nodes())

if len(lista_usuarios) >= 2:

    with st.form("form_amizade"):

        usuario1 = st.selectbox(
            "Selecione o primeiro usuário",
            lista_usuarios
        )

        usuario2 = st.selectbox(
            "Selecione o segundo usuário",
            lista_usuarios,
            index=1
        )

        adicionar = st.form_submit_button("Criar amizade")

        if adicionar:

            if usuario1 == usuario2:
                st.warning(
                    "Um usuário não pode ser amigo de si mesmo."
                )

            elif G.has_edge(usuario1, usuario2):
                st.warning("Essa amizade já existe!")

            else:
                G.add_edge(usuario1, usuario2)
                st.success("Amizade criada com sucesso!")
                st.rerun()

else:
    st.info("Cadastre pelo menos dois usuários.")

st.divider()

# 5. VISUALIZAR O GRAFO

st.subheader("🔗 Rede de amizades")

if G.number_of_nodes() > 0:

    fig, ax = plt.subplots(figsize=(8, 5))

    pos = nx.spring_layout(
        G,
        seed=42,
        k=1.5,
        iterations=100
    )

    nx.draw_networkx_edges(
        G,
        pos,
        ax=ax,
        edge_color="#A0AEC0",
        width=2
    )

    nx.draw_networkx_nodes(
        G,
        pos,
        ax=ax,
        node_color="#8ECAE6",
        node_size=900,
        edgecolors="#367DA8",
        linewidths=1.5
    )

    nx.draw_networkx_labels(
        G,
        pos,
        ax=ax,
        font_size=9,
        font_weight="bold"
    )

    ax.margins(0.30)
    ax.axis("off")

    st.pyplot(fig, width=650)
    plt.close(fig)

else:
    st.info("Ainda não existem usuários cadastrados.")

st.divider()

# 6. GRAU DOS VÉRTICES

st.subheader("📊 Quantidade de amigos por usuário")

for usuario in G.nodes():
    st.write(
        f"**{usuario}:** {G.degree(usuario)} amigo(s)"
    )

for usuario in G.nodes():
    st.write(
        f"**{usuario}:** {G.degree(usuario)} amigo(s)"
    )

# 7. BUSCA EM LARGURA (BFS)

st.divider()

st.subheader("🔎 Encontrar caminho entre usuários")

st.write(
    "Selecione dois usuários para descobrir "
    "o menor caminho de amizades entre eles."
)

usuarios_bfs = sorted(G.nodes())

if len(usuarios_bfs) >= 2:

    with st.form("form_bfs"):

        origem = st.selectbox(
            "Usuário de origem",
            usuarios_bfs,
            key="bfs_origem"
        )

        destino = st.selectbox(
            "Usuário de destino",
            usuarios_bfs,
            index=1,
            key="bfs_destino"
        )

        buscar = st.form_submit_button(
            "🔍 Buscar menor caminho"
        )

    if buscar:

        caminho = busca_em_largura(
            G, origem, destino
        )

        if caminho is None:
            st.warning(
                "Não existe um caminho entre esses usuários."
            )

        else:
            distancia = len(caminho) - 1

            st.success("Caminho encontrado!")

            st.write(
                "**Caminho:** " + " → ".join(caminho)
            )

            st.metric(
                "Distância entre usuários",
                f"{distancia} conexão(ões)"
            )

else:
    st.info(
        "Cadastre pelo menos dois usuários "
        "para realizar a busca BFS."
    )
