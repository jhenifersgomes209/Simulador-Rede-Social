from flask import Blueprint, jsonify, Response, request

from Repository.users_repository import UserRepository
from extensions import graph_controller

user_bp = Blueprint('users', __name__)

@user_bp.route('/', methods=['GET'])
def get_users() -> tuple[Response, int]:
    users = UserRepository.get_users()

    if users == []:
        return jsonify({
            "error": "No users found"
        }), 404

    return jsonify(users), 200

@user_bp.route('/', methods=['POST'])
def add_user() -> tuple[Response, int]:
    data = request.get_json()

    if data is None:
        return jsonify({
            "error": "Could not create new user"
        }), 401

    user = graph_controller.create_user(
        username= str(data["username"]),
        email=str(data["email"]),
        password_hash=str(data["password_hash"])
    )

    return jsonify({
        "msg": f"Success! User {data["username"]} created with User ID {user}",
        "body": user
    }), 201

@user_bp.route('/<int:user_id>', methods=['GET'])
def get_user(user_id) -> tuple[Response, int]:
    user = UserRepository.get_user_by_id(user_id)

    if user is None:
        return jsonify({
            "error": "User not found"
        }), 404

    return jsonify(user), 200

@user_bp.route('/<int:user_id>', methods=['DELETE'])
def delete_user(user_id) -> tuple[Response, int]:
    removed = graph_controller.remove_user(user_id)

    if not removed:
        return jsonify({
            "error": "User was not removed"
        }), 404

    return jsonify({"msg": f"Success! User ID {user_id} removed"}), 204

@user_bp.route('/<int:follwer>/follow/<int:followed>', methods=['POST'])
def follow_user(follower: int, followed: int) -> tuple[Response, int]:
    follow_id = graph_controller.follow_user(follower, followed)

    if follow_id is None:
        return jsonify({
            "error": f"Could not follow User ID {followed}"
        }), 404
         
    return jsonify({"msg": f"Success! Following user ID {followed}"}), 201

@user_bp.route('/<int:follwer>/follow/<int:followed>', methods=['DELETE'])
def unfollow_user(follower: int, followed: int) -> tuple[Response, int]:
    following = graph_controller.unfollow_user(follower, followed)

    if following:
        return jsonify({
            "error": f"Could not unfollow User ID {followed}"
        }), 404
         
    return jsonify({"msg": f"Success! Unfollowing user ID {followed}"}), 204
