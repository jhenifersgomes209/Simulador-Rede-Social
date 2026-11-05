from networkx import MultiDiGraph

class GraphService:
    def __init__(self, graph: MultiDiGraph) -> None:
        """Creates the graph object

        Args:
            graph (MultiDiGraph): multi digraph injection dependency 
        """
        self.graph: MultiDiGraph = graph

    def add_node(self, name: str) -> None:
        """Add a node to the Graph. It represents the user in a Social Social

        Args:
            name (str): name of the user/node
        """
        self.graph.add_node(name)

    def remove_node(self, name: str) -> str | None:
        """Remove the node and all adjacent edges 

        Args:
            name (str): name of the user that will be deleted 

        Returns:
            str: name of the user/node when removal succeed. None if not
        """
        neighbors: list[str] = list(self.graph.neighbors(name))

        if name in self.graph:
            return 
        
        if neighbors:
            for neighbor in neighbors:
                self.graph.remove_edge(name, neighbor)
        self.graph.remove_node(name)

        return name 

    def add_edge(self, name1:str, name2: str) -> None:
        """Add an edge between the to users/nodes passed via parameters. **Directionaly depended!** 

        Args:
            name1 (str): User1 that connects to User2
            name2 (str): User2. Does not connect with User1 (**directional**)
        """
        self.graph.add_edge(name1, name2)

    def remove_edge(self, name1:str, name2: str) -> tuple[str, str] | None:
        """Remove the edge/connection/follow from name1 with name2

        Args:
            name1 (str): User1 that connects to User2
            name2 (str): User2. Does not connect with User1 (**directional**)

        Returns:
            tuple[str, str]: tuple containing name1 and name2 when the removal succeed. None if not
        """
        if (name1, name2) in self.graph:
            return

        self.graph.remove_edge(name1, name2)