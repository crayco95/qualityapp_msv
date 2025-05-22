from app.db import get_db_connection
from app.models.subcategory import Subcategory

class SubcategoryService:
    @staticmethod
    def create_subcategory(param_id, name, description):
        conn = get_db_connection()
        cursor = conn.cursor()
        
        try:
            cursor.execute("""
                INSERT INTO ge_subcategory 
                (subctg_param_id, subctg_name, subctg_description)
                VALUES (%s, %s, %s)
                RETURNING subctg_id, subctg_param_id, subctg_name, subctg_description,
                          subctg_date_create, subctg_date_update
            """, (param_id, name, description))
            
            subcategory_data = cursor.fetchone()
            conn.commit()
            
            return Subcategory.from_db_row(subcategory_data)
        except Exception as e:
            conn.rollback()
            raise e
        finally:
            conn.close()

    @staticmethod
    def get_subcategories_by_parameter(param_id):
        conn = get_db_connection()
        cursor = conn.cursor()
        
        try:
            cursor.execute("""
                SELECT subctg_id, subctg_param_id, subctg_name, subctg_description,
                       subctg_date_create, subctg_date_update
                FROM ge_subcategory
                WHERE subctg_param_id = %s
                ORDER BY subctg_name
            """, (param_id,))
            
            subcategories = [Subcategory.from_db_row(row) for row in cursor.fetchall()]
            return subcategories
        finally:
            conn.close()

    @staticmethod
    def get_subcategory_by_id(subcategory_id):
        conn = get_db_connection()
        cursor = conn.cursor()
        
        try:
            cursor.execute("""
                SELECT subctg_id, subctg_param_id, subctg_name, subctg_description,
                       subctg_date_create, subctg_date_update
                FROM ge_subcategory
                WHERE subctg_id = %s
            """, (subcategory_id,))
            
            subcategory_data = cursor.fetchone()
            if subcategory_data:
                return Subcategory.from_db_row(subcategory_data)
            return None
        finally:
            conn.close()

    @staticmethod
    def update_subcategory(subcategory_id, name=None, description=None):
        conn = get_db_connection()
        cursor = conn.cursor()
        
        try:
            update_fields = []
            params = []
            
            if name is not None:
                update_fields.append("subctg_name = %s")
                params.append(name)
            if description is not None:
                update_fields.append("subctg_description = %s")
                params.append(description)
                
            if not update_fields:
                return None

            update_fields.append("subctg_date_update = CURRENT_TIMESTAMP")
            params.append(subcategory_id)
            
            query = f"""
                UPDATE ge_subcategory 
                SET {", ".join(update_fields)}
                WHERE subctg_id = %s
                RETURNING subctg_id, subctg_param_id, subctg_name, subctg_description,
                          subctg_date_create, subctg_date_update
            """
            
            cursor.execute(query, params)
            subcategory_data = cursor.fetchone()
            conn.commit()
            
            if subcategory_data:
                return Subcategory.from_db_row(subcategory_data)
            return None
            
        except Exception as e:
            conn.rollback()
            raise e
        finally:
            conn.close()

    @staticmethod
    def delete_subcategory(subcategory_id):
        conn = get_db_connection()
        cursor = conn.cursor()
        
        try:
            cursor.execute("""
                DELETE FROM ge_subcategory
                WHERE subctg_id = %s
                RETURNING subctg_id
            """, (subcategory_id,))
            
            deleted = cursor.fetchone()
            conn.commit()
            
            return bool(deleted)
            
        except Exception as e:
            conn.rollback()
            raise e
        finally:
            conn.close()