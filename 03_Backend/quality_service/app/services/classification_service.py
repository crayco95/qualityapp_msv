from app.db import get_db_connection
from app.models.classification import Classification

class ClassificationService:
    @staticmethod
    def create_classification(range_min, range_max, level):
        conn = get_db_connection()
        cursor = conn.cursor()
        
        try:
            # Validate ranges
            if range_min >= range_max:
                raise ValueError("El rango mínimo debe ser menor que el rango máximo")

            cursor.execute("""
                INSERT INTO ge_clasification 
                (clsf_range_min, clsf_range_max, clsf_level)
                VALUES (%s, %s, %s)
                RETURNING clsf_id, clsf_range_min, clsf_range_max, clsf_level,
                          clsf_date_create, clsf_date_update
            """, (range_min, range_max, level))
            
            classification_data = cursor.fetchone()
            conn.commit()
            
            return Classification.from_db_row(classification_data)
        except Exception as e:
            conn.rollback()
            raise e
        finally:
            conn.close()

    @staticmethod
    def get_all_classifications():
        conn = get_db_connection()
        cursor = conn.cursor()
        
        try:
            cursor.execute("""
                SELECT clsf_id, clsf_range_min, clsf_range_max, clsf_level,
                       clsf_date_create, clsf_date_update
                FROM ge_clasification
                ORDER BY clsf_range_min
            """)
            
            classifications = [Classification.from_db_row(row) for row in cursor.fetchall()]
            return classifications
        finally:
            conn.close()

    @staticmethod
    def get_classification_by_id(classification_id):
        conn = get_db_connection()
        cursor = conn.cursor()
        
        try:
            cursor.execute("""
                SELECT clsf_id, clsf_range_min, clsf_range_max, clsf_level,
                       clsf_date_create, clsf_date_update
                FROM ge_clasification
                WHERE clsf_id = %s
            """, (classification_id,))
            
            classification_data = cursor.fetchone()
            if classification_data:
                return Classification.from_db_row(classification_data)
            return None
        finally:
            conn.close()

    @staticmethod
    def update_classification(classification_id, range_min=None, range_max=None, level=None):
        conn = get_db_connection()
        cursor = conn.cursor()
        
        try:
            # Get current values if we need to validate ranges
            if range_min is not None or range_max is not None:
                cursor.execute("""
                    SELECT clsf_range_min, clsf_range_max
                    FROM ge_clasification
                    WHERE clsf_id = %s
                """, (classification_id,))
                current = cursor.fetchone()
                if current:
                    current_min, current_max = current
                    final_min = range_min if range_min is not None else current_min
                    final_max = range_max if range_max is not None else current_max
                    if final_min >= final_max:
                        raise ValueError("El rango mínimo debe ser menor que el rango máximo")

            update_fields = []
            params = []
            
            if range_min is not None:
                update_fields.append("clsf_range_min = %s")
                params.append(range_min)
            if range_max is not None:
                update_fields.append("clsf_range_max = %s")
                params.append(range_max)
            if level is not None:
                update_fields.append("clsf_level = %s")
                params.append(level)
                
            if not update_fields:
                return None

            update_fields.append("clsf_date_update = CURRENT_TIMESTAMP")
            params.append(classification_id)
            
            query = f"""
                UPDATE ge_clasification 
                SET {", ".join(update_fields)}
                WHERE clsf_id = %s
                RETURNING clsf_id, clsf_range_min, clsf_range_max, clsf_level,
                          clsf_date_create, clsf_date_update
            """
            
            cursor.execute(query, params)
            classification_data = cursor.fetchone()
            conn.commit()
            
            if classification_data:
                return Classification.from_db_row(classification_data)
            return None
            
        except Exception as e:
            conn.rollback()
            raise e
        finally:
            conn.close()

    @staticmethod
    def delete_classification(classification_id):
        conn = get_db_connection()
        cursor = conn.cursor()
        
        try:
            cursor.execute("""
                DELETE FROM ge_clasification
                WHERE clsf_id = %s
                RETURNING clsf_id
            """, (classification_id,))
            
            deleted = cursor.fetchone()
            conn.commit()
            
            return bool(deleted)
            
        except Exception as e:
            conn.rollback()
            raise e
        finally:
            conn.close()

    @staticmethod
    def get_classification_by_score(score):
        conn = get_db_connection()
        cursor = conn.cursor()
        
        try:
            cursor.execute("""
                SELECT clsf_id, clsf_range_min, clsf_range_max, clsf_level,
                       clsf_date_create, clsf_date_update
                FROM ge_clasification
                WHERE %s BETWEEN clsf_range_min AND clsf_range_max
            """, (score,))
            
            classification_data = cursor.fetchone()
            if classification_data:
                return Classification.from_db_row(classification_data)
            return None
        finally:
            conn.close()