from flask import Blueprint, jsonify, Response, request

from Repository.posts_repository import PostRepository

post_bp = Blueprint('posts', __name__)

@post_bp.route('/', methods=['GET'])
def get_users() -> tuple[Response, int]:
    users = PostRepository.get_posts()

    if users == []:
        return jsonify({
            "error": "No posts found"
        }), 404

    return jsonify(users), 200

@post_bp.route('/', methods=['POST'])
def add_user() -> tuple[Response, int]:
    data = request.get_json()

    if data is None:
        return jsonify({
            "error": "Could not create new post"
        }), 401

    post = PostRepository.add_post(
        content= str(data["content"]),
        user_id=int(data["user_id"]),
        likes=int(data["likes"])
    )

    return jsonify({
        "msg": f"Success! Post created with Post ID {post}",
        "body": post
    }), 201

@post_bp.route('/<int:post_id>', methods=['GET'])
def get_user(post_id) -> tuple[Response, int]:
    post = PostRepository.get_post(post_id)

    if post is None:
        return jsonify({
            "error": "Post not found"
        }), 404

    return jsonify(post), 200

@post_bp.route('/<int:post_id>', methods=['DELETE'])
def delete_user(post_id) -> tuple[Response, int]:
    removed = PostRepository.remove_post(post_id)

    if not removed:
        return jsonify({
            "error": f"Post ID {post_id} was not removed"
        }), 404

    return jsonify({"msg": f"Success! Post ID {post_id} removed"}), 204