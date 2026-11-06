import sqlite3
from typing import Any

from DB.connect import get_connection

class PostRepository:

    @staticmethod
    def add_post(content: str, user_id: int, likes: int) -> int | None:
        with get_connection() as conn:
            cursor = conn.execute("""
                INSERT INTO Posts (content, user_id)
                VALUES (?, ?, ?)
            """, (content, user_id, likes))

            return cursor.lastrowid
    
    @staticmethod
    def get_posts() -> list[dict[str, Any]]:
        with get_connection() as conn:
            conn.row_factory = sqlite3.Row
            cursor = conn.execute("""
                SELECT * FROM Posts  
            """, )
            
            posts = cursor.fetchall()

            return [dict(post) for post in posts]
    
    @staticmethod
    def get_post(post_id) -> dict[str, Any] | None:
        with get_connection() as conn:
            cursor = conn.execute("""
                SELECT * FROM Posts
                WHERE post_id = ?  
            """, (post_id,))
            
            post = cursor.fetchone()

            return dict(post) if post is not None else None

    @staticmethod
    def update_post_status(post_id: int, liked: bool) -> int:
        with get_connection() as conn:
            cursor = conn.execute("""
                SELECT p.likes FROM Posts p 
                WHERE id = ?
            """, (post_id,))
            likes = int(cursor.fetchone())

            if liked: 
                likes += 1
            else:
                likes -= 1 

            cursor.execute("""
                UPDATE Posts SET likes = ?
                WHERE pots_id = ?
            """, (post_id, liked))

            return likes

    @staticmethod
    def remove_post(post_id: int):
        with get_connection() as conn:
            cursor = conn.execute("""
                DELETE FROM Posts WHERE id = ?
            """, (post_id,))

            return cursor.rowcount > 0