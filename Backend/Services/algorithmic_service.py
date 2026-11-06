from networkx import MultiDiGraph
from collections import deque

class AlgorihmicService:
    def __init__(self) -> None:
        pass

    @staticmethod
    def recomendar_usuarios(
            graph: MultiDiGraph, 
            origin: int, 
            limit: int = 5, 
            max_depth: int = 2
            ) -> list[tuple[str, float]]:

        if origin not in graph:
            return []

        queue: deque[tuple[int, int]] = deque([(origin, 0)])
        visited: set[int] = {origin}
        distances: dict[str, float] = {}

        while queue:
            atual, depth = queue.popleft()

            if depth >= max_depth:
                continue

            for neighbor in graph.neighbors(atual):

                if neighbor not in visited:
                    visited.add(neighbor)

                    new_depth = depth + 1
                    queue.append((neighbor, new_depth))

                    # Não recomendar conexões já existentes
                    if not graph.has_edge(origin, neighbor):
                        distances[neighbor] = new_depth

        # Candidate set. Ranks them from most relevant and less relevant 
        recommendations: dict[str, float] = {}

        for user in distances:

            friends_in_common = len(
                set(graph.neighbors(origin)) &
                set(graph.neighbors(user))
            )

            distance = distances[user]

            score = friends_in_common / distance

            recommendations[user] = score

        # Sort the highest score to the lowest
        ranking = sorted(
            recommendations.items(),
            key=lambda item: item[1],
            reverse=True
        )

        # return a limit
        return ranking[:limit]
