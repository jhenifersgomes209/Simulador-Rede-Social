from networkx import MultiDiGraph

from Services.graph_services import GraphService
from Controller.graph_controller import GraphController

graph_service = GraphService(MultiDiGraph())
graph_controller = GraphController(graph_service)