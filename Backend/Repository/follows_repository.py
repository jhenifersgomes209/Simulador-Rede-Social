import sqlite3
from typing import Any

from DB.connect import get_connection

class FollowsRepository:
    @staticmethod
    def follow(user_id1: int, user_id2: int) -> int | None:
        with get_connection() as conn:
            cursor = conn.execute("""
                INSERT INTO Follows (follower_id, followed_id)
                VALUES (?, ?)
            """, (user_id1, user_id2))

            return cursor.lastrowid

    @staticmethod
    def unfollow(follower_id: int, followed_id: int) -> bool:
        with get_connection() as conn:
            cursor = conn.execute("""
                DELETE FROM Follows 
                WHERE follower_id = ? 
                AND followed_id = ?
            """, (follower_id, followed_id))

            return cursor.rowcount > 0

    @staticmethod
    def get_all_follows() -> list[tuple[int, int]]:
        with get_connection() as conn:
            conn.row_factory = sqlite3.Row
            cursor = conn.execute("""
                SELECT follower_id, followed_id FROM Follows  
            """, )
            
            follows = cursor.fetchall()

            return [tuple(follow) for follow in follows]