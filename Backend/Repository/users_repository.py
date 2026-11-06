import sqlite3
from typing import Any

from DB.connect import get_connection

class UserRepository:
    @staticmethod
    def add_user(username: str, email: str, password_hash: str) -> int | None:
        with get_connection() as conn:
            cursor = conn.execute("""
                INSERT INTO Users (username, email, password)
                VALUES (?, ?, ?)
            """, (username, email, password_hash))

            return cursor.lastrowid
    
    @staticmethod
    def remove_user(user_id: int) -> bool:
        with get_connection() as conn:
            cursor = conn.execute("""
                DELETE FROM Users WHERE id = ?
            """, (user_id,))

            return cursor.rowcount > 0
    
    @staticmethod
    def get_user_by_id(user_id) -> dict[str, Any] | None:
        with get_connection() as conn:
            conn.row_factory = sqlite3.Row

            cursor = conn.execute("""
                SELECT id, username, email, created_at
                FROM Users
                WHERE id = ?
            """, (user_id,))

            user = cursor.fetchone()

            return dict(user) if user else None
        
    @staticmethod
    def get_users() -> list[dict[str, Any]]:
        with get_connection() as conn:
            conn.row_factory = sqlite3.Row

            cursor = conn.execute("""
                SELECT id, username, email, created_at
                FROM Users
            """)

            users = cursor.fetchall()

            return [dict(user) for user in users]