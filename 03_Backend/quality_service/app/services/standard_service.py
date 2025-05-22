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
                (strnd_name, strnd_description, strnd_version, strnd_status)
                VALUES (%s, %s, %s, %s)
                RETURNING strnd_id, strnd_name, strnd_description, strnd_version, 
                          strnd_status, strnd_date_create, strnd_date_update
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
                SELECT strnd_id, strnd_name, strnd_description, strnd_version,
                       strnd_status, strnd_date_create, strnd_date_update
                FROM ge_standards
                ORDER BY strnd_name
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
            update_fields = []
            params = []
            
            if name is not None:
                update_fields.append("strnd_name = %s")
                params.append(name)
            if description is not None:
                update_fields.append("strnd_description = %s")
                params.append(description)
            if version is not None:
                update_fields.append("strnd_version = %s")
                params.append(version)
            if status is not None:
                update_fields.append("strnd_status = %s")
                params.append(status)
                

                
            if not update_fields:
                return None
                
            params.append(standard_id)
            
            query = f"""
                UPDATE ge_standards 
                SET {", ".join(update_fields)}
                WHERE strnd_id = %s
                RETURNING strnd_id, strnd_name, strnd_description, strnd_version, 
                          strnd_status, strnd_date_create, strnd_date_update
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
            # Primero verificamos si hay parámetros asociados
            cursor.execute("""
                SELECT COUNT(*) FROM ge_parameters WHERE param_stdr_id = %s
            """, (standard_id,))
            
            count = cursor.fetchone()[0]
            if count > 0:
                raise Exception("No se puede eliminar el estándar porque tiene parámetros asociados")
            
            # Si no hay parámetros, procedemos con la eliminación
            cursor.execute("""
                DELETE FROM ge_standards
                WHERE strnd_id = %s
                RETURNING strnd_id
            """, (standard_id,))
            
            deleted = cursor.fetchone()
            conn.commit()
            
            return bool(deleted)
            
        except Exception as e:
            conn.rollback()
            raise e
        finally:
            conn.close()