from app.db import get_db_connection
from app.models.software import Software

class SoftwareService:
    @staticmethod
    def create_software(name, general_objectives, specific_objectives, company, city, phone, test_date):
        conn = get_db_connection()
        cursor = conn.cursor()
        
        try:
            cursor.execute("""
                INSERT INTO ge_software (soft_name, soft_ge_objct, soft_spfc_objct, soft_company, soft_city,
                                        soft_phone, soft_test_date)
                VALUES (%s, %s, %s, %s, %s, %s, %s)
                RETURNING *;
            """, (name, general_objectives, specific_objectives, company, city, phone, test_date))
            
            software_data = cursor.fetchone()
            conn.commit()
            
            return Software.from_db_row(software_data)
        except Exception as e:
            conn.rollback()
            raise e
        finally:
            conn.close()

    @staticmethod
    def get_all_software():
        conn = get_db_connection()
        cursor = conn.cursor()
        
        try:
            cursor.execute("""
                SELECT * FROM ge_software 
                ORDER BY soft_test_date DESC;
            """)
            
            softwares = [Software.from_db_row(row) for row in cursor.fetchall()]
            return softwares
        finally:
            conn.close()

    @staticmethod
    def get_software_by_id(software_id):
        conn = get_db_connection()
        cursor = conn.cursor()
        
        try:
            cursor.execute("""
                SELECT * FROM ge_software 
                WHERE soft_id = %s;
            """, (software_id,))
            
            software_data = cursor.fetchone()
            if software_data:
                return Software.from_db_row(software_data)
            return None
        finally:
            conn.close()
    @staticmethod
    def update_software(software_id, name=None, general_objectives=None, specific_objectives=None, 
                   company=None, city=None, phone=None, test_date=None):
    conn = get_db_connection()
    cursor = conn.cursor()
    
    try:
        update_fields = []
        params = []
        
        if name is not None:
            update_fields.append("soft_name = %s")
            params.append(name)
        if general_objectives is not None:
            update_fields.append("soft_ge_objct = %s")
            params.append(general_objectives)
        if specific_objectives is not None:
            update_fields.append("soft_spfc_objct = %s")
            params.append(specific_objectives)
        if company is not None:
            update_fields.append("soft_company = %s")
            params.append(company)
        if city is not None:
            update_fields.append("soft_city = %s")
            params.append(city)
        if phone is not None:
            update_fields.append("soft_phone = %s")
            params.append(phone)
        if test_date is not None:
            update_fields.append("soft_test_date = %s")
            params.append(test_date)
            
        if not update_fields:
            return None
            
        params.append(software_id)
        
        query = f"""
            UPDATE ge_software 
            SET {", ".join(update_fields)}
            WHERE soft_id = %s
            RETURNING *
        """
        
        cursor.execute(query, params)
        software_data = cursor.fetchone()
        conn.commit()
        
        if software_data:
            return Software.from_db_row(software_data)
        return None
        
    except Exception as e:
        conn.rollback()
        raise e
    finally:
        conn.close()

    @staticmethod
    def delete_software(software_id):
        conn = get_db_connection()
        cursor = conn.cursor()
        
        try:
            cursor.execute("""
                DELETE FROM ge_software
                WHERE soft_id = %s
                RETURNING soft_id
            """, (software_id,))
            
            deleted = cursor.fetchone()
            conn.commit()
            
            return bool(deleted)
            
        except Exception as e:
            conn.rollback()
            raise e
        finally:
            conn.close()