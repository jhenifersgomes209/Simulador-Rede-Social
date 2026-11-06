from networkx import MultiDiGraph

class GraphService:
    def __init__(self, graph: MultiDiGraph) -> None:
        """Creates the graph object

        Args:
            graph (MultiDiGraph): multi digraph injection dependency 
        """
        self.graph: MultiDiGraph = graph

    def add_node(self, id: int) -> None:
        """Add a node to the Graph. It represents the user in a Social Social

        Args:
            id (int): id of the user/node
        """
        self.graph.add_node(id)

    def remove_node(self, id: int) -> int | None:
        """Remove the node and all adjacent edges 

        Args:
            id (int): id of the user that will be deleted 

        Returns:
            int: id of the user/node when removal succeed. None if not
        """
        if id not in self.graph:
            return None
        self.graph.remove_node(id)

        return id 

    def add_edge(self, id1: int, id2: int) -> None:
        """Add an edge between the to users/nodes passed via parameters. **Directionaly depended!** 

        Args:
            id1 (str): User1 that connects to User2
            id2 (str): User2. Does not connect with User1 (**directional**)
        """
        self.graph.add_edge(id1, id2)

    def remove_edge(self, id1: int, id2: int) -> tuple[int, int] | None:
        """Remove the edge/connection/follow from id1 with id2

        Args:
            id1 (str): User1 that connects to User2
            id2 (str): User2. Does not connect with User1 (**directional**)

        Returns:
            tuple[str, str]: tuple containing id1 and id2 when the removal succeed. None if not
        """
        if self.graph.has_edge(id1, id2):
            return None
        self.graph.remove_edge(id1, id2)

        return (id1, id2)