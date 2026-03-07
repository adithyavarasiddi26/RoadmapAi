# backend/app/resetall.py
from database.db_connection import engine
from schema.database_schema import base

def reset_database():
    # be sure you really want to destroy everything!
    base.metadata.drop_all(engine)     # drops every table defined on base
    base.metadata.create_all(engine)   # recreates them from the models

if __name__ == "__main__":
    reset_database()
    print("database schema reset")