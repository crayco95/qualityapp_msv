from app.db import get_db_connection
from app.models.standard import Standard

class StandardService:
    @staticmethod
    def create_standard(name, description, version, status=True):
        conn = get_db_connection()
        cursor = conn.cursor()
        
        try:
            cursor.execute("""
                INSERT INTO ge_standards 
                (stdr_name, stdr_description, stdr_version, stdr_status)
                VALUES (%s, %s, %s, %s)
                RETURNING stdr_id, stdr_name, stdr_description, stdr_version, stdr_status
            """, (name, description, version, status))
            
            standard_data = cursor.fetchone()
            conn.commit()
            
            return Standard.from_db_row(standard_data)
        except Exception as e:
            conn.rollback()
            raise e
        finally:
            conn.close()

    @staticmethod
    def get_all_standards():
        conn = get_db_connection()
        cursor = conn.cursor()
        
        try:
            cursor.execute("""
                SELECT stdr_id, stdr_name, stdr_description, stdr_version, stdr_status
                FROM ge_standards
                ORDER BY stdr_name
            """)
            
            standards = [Standard.from_db_row(row) for row in cursor.fetchall()]
            return standards
        finally:
            conn.close()

    @staticmethod
    def get_standard_by_id(standard_id):
        conn = get_db_connection()
        cursor = conn.cursor()
        
        try:
            cursor.execute("""
                SELECT stdr_id, stdr_name, stdr_description, stdr_version, stdr_status
                FROM ge_standards
                WHERE stdr_id = %s
            """, (standard_id,))
            
            standard_data = cursor.fetchone()
            if standard_data:
                return Standard.from_db_row(standard_data)
            return None
        finally:
            conn.close()

    @staticmethod
    def update_standard(standard_id, name=None, description=None, version=None, status=None):
        conn = get_db_connection()
        cursor = conn.cursor()
        
        try:
            # Construir la consulta dinámicamente basada en los campos proporcionados
            update_fields = []
            params = []
            
            if name is not None:
                update_fields.append("stdr_name = %s")
                params.append(name)
            if description is not None:
                update_fields.append("stdr_description = %s")
                params.append(description)
            if version is not None:
                update_fields.append("stdr_version = %s")
                params.append(version)
            if status is not None:
                update_fields.append("stdr_status = %s")
                params.append(status)
                
            if not update_fields:
                return None
                
            params.append(standard_id)
            
            query = f"""
                UPDATE ge_standards 
                SET {", ".join(update_fields)}
                WHERE stdr_id = %s
                RETURNING stdr_id, stdr_name, stdr_description, stdr_version, stdr_status
            """
            
            cursor.execute(query, params)
            standard_data = cursor.fetchone()
            conn.commit()
            
            if standard_data:
                return Standard.from_db_row(standard_data)
            return None
            
        except Exception as e:
            conn.rollback()
            raise e
        finally:
            conn.close()

    @staticmethod
    def delete_standard(standard_id):
        conn = get_db_connection()
        cursor = conn.cursor()
        
        try:
            cursor.execute("""
                DELETE FROM ge_standards
                WHERE stdr_id = %s
                RETURNING stdr_id
            """, (standard_id,))
            
            deleted = cursor.fetchone()
            conn.commit()
            
            return bool(deleted)
            
        except Exception as e:
            conn.rollback()
            raise e
        finally:
            conn.close()