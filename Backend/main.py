from flask import Flask

from extensions import graph_controller

from Routes.users import user_bp
from Routes.posts import post_bp


app = Flask(__name__)
app.register_blueprint(post_bp, url_prefix='/api/posts')
app.register_blueprint(user_bp, url_prefix='/api/users')

graph_controller.load_graph()

if __name__ == '__main__':
    try:
        print(graph_controller.graph_service.graph)
        print(graph_controller.graph_service.graph.nodes)
        print(graph_controller.graph_service.graph.edges)
        app.run(debug=True)
    except Exception as e:
        print(e)