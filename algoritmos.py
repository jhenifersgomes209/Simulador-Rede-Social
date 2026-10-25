
from collections import deque

#deque - Cria uma fila começando pelo usuário de origem
#visitados - Guarda os usuários já descobertos
#peopleft - Retira o primeiro usuário da fila
#caminho.reverse - Coloca o caminho na ordem da origem ao destino
#grafo.neighbors - Encontra os usuários conectados ao atual
#anteriores - Registra por qual vértice chegamos a cada usuário

def busca_em_largura(grafo, origem, destino):
    """
    Encontra um menor caminho entre dois usuários
    utilizando BFS (Busca em Largura).

    Retorna uma lista com os vértices do caminho.
    Se não houver caminho, retorna None.
    """
    if origem not in grafo or destino not in grafo:
        return None

    fila = deque([origem])
    visitados = {origem}
    anteriores = {origem: None}

    while fila:
        atual = fila.popleft()

        if atual == destino:
            caminho = []
            while atual is not None:
                caminho.append(atual)
                atual = anteriores[atual]

            caminho.reverse()
            return caminho

        for vizinho in grafo.neighbors(atual):
            if vizinho not in visitados:
                visitados.add(vizinho)
                anteriores[vizinho] = atual
                fila.append(vizinho)

    return None
