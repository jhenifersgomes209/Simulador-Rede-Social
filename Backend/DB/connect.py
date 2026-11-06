import sqlite3
from contextlib import contextmanager
from pathlib import Path

PATH_TO_DB = Path(__file__).resolve().parent
DB_PATH = f"{PATH_TO_DB}/database.db"

@contextmanager
def get_connection():
    conn = sqlite3.connect(DB_PATH)
    conn.execute("PRAGMA foreign_keys = ON")

    try:
        yield conn
        conn.commit()
    except Exception:
        conn.rollback()
        raise
    finally:
        conn.close()