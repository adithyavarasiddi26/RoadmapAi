from database.db_connection import engine
from schema.database_schema import base

def update_database():
    # be sure you really want to update the database schema!
    base.metadata.create_all(engine)   # creates any tables that don't exist yet, but doesn't drop anything

if __name__ == "__main__":
    update_database()
    print("database schema updated")