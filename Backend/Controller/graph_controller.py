from Services.graph_services import GraphService
from Services.algorithmic_service import AlgorihmicService

from Repository.users_repository import UserRepository
from Repository.follows_repository import FollowsRepository

class GraphController:

    def __init__(self, graph: GraphService):

        self.graph_service = graph

    def create_user(self, username: str, email: str, password_hash: str) -> bool:
        success = UserRepository.add_user(
            username=username,
            email=email,
            password_hash=password_hash
        )

        if success is None:
            return False

        self.graph_service.add_node(success)

        return True

    def remove_user(self, user_id: int) -> bool:
        success = UserRepository.remove_user(user_id)

        if not success:
            return False

        self.graph_service.remove_node(user_id)

        return True 

    def follow_user(self, follower_id: int, followed_id: int) -> bool:
        success = FollowsRepository.follow(
            follower_id, followed_id
        )

        if success is None:
            return False

        # Update the in-memory graph
        self.graph_service.add_edge(follower_id, followed_id)

        return True

    def unfollow_user(self, follower_id: int, followed_id: int) -> bool:

        success = FollowsRepository.unfollow(
            follower_id, followed_id
        )

        if not success:
            return False

        self.graph_service.remove_edge(follower_id, followed_id)

        return True

    def recommend_users(
        self,
        user_id: int,
        limit: int = 5,
        max_depth: int = 2
    ) -> list:

        return AlgorihmicService.recomendar_usuarios(
            graph=self.graph_service.graph,
            origin=user_id,
            limit=limit,
            max_depth=max_depth
        )

    def load_graph(self):
        follows = FollowsRepository.get_all_follows()

        for follower_id, followed_id in follows:
            self.graph_service.add_edge(
                follower_id,
                followed_id
        )