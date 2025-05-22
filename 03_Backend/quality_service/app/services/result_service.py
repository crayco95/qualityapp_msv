from app.db import get_db_connection
from app.models.result import Result

class ResultService:
    @staticmethod
    def create_result(assessment_id, score, classification_id):
        conn = get_db_connection()
        cursor = conn.cursor()
        
        try:
            cursor.execute("""
                INSERT INTO rp_results 
                (rslt_assmt_id, rslt_score, rslt_clsf_id)
                VALUES (%s, %s, %s)
                RETURNING rslt_id, rslt_assmt_id, rslt_score, rslt_clsf_id, rslt_date_create
            """, (assessment_id, score, classification_id))
            
            result_data = cursor.fetchone()
            conn.commit()
            
            return Result.from_db_row(result_data)
        except Exception as e:
            conn.rollback()
            raise e
        finally:
            conn.close()

    @staticmethod
    def get_results_by_assessment(assessment_id):
        conn = get_db_connection()
        cursor = conn.cursor()
        
        try:
            cursor.execute("""
                SELECT rslt_id, rslt_assmt_id, rslt_score, rslt_clsf_id, rslt_date_create, rslt_date_update
                FROM rp_results
                WHERE rslt_assmt_id = %s
                ORDER BY rslt_date_create DESC
            """, (assessment_id,))
            
            results = [Result.from_db_row(row) for row in cursor.fetchall()]
            return results
        finally:
            conn.close()

    @staticmethod
    def get_result_by_id(result_id):
        conn = get_db_connection()
        cursor = conn.cursor()
        
        try:
            cursor.execute("""
                SELECT rslt_id, rslt_assmt_id, rslt_score, rslt_clsf_id, rslt_date_create, rslt_date_update
                FROM rp_results
                WHERE rslt_id = %s
            """, (result_id,))
            
            result_data = cursor.fetchone()
            if result_data:
                return Result.from_db_row(result_data)
            return None
        finally:
            conn.close()

    @staticmethod
    def update_result(result_id, score=None, classification_id=None):
        conn = get_db_connection()
        cursor = conn.cursor()
        
        try:
            update_fields = []
            params = []
            
            if score is not None:
                update_fields.append("rslt_score = %s")
                params.append(score)
            if classification_id is not None:
                update_fields.append("rslt_clsf_id = %s")
                params.append(classification_id)
                
            if not update_fields:
                return None
            update_fields.append("rslt_date_update = CURRENT_TIMESTAMP")    
            params.append(result_id)
            
            query = f"""
                UPDATE rp_results 
                SET {", ".join(update_fields)}
                WHERE rslt_id = %s
                RETURNING rslt_id, rslt_asmt_id, rslt_score, rslt_clsf_id, rslt_date_create, rslt_date_update
            """
            
            cursor.execute(query, params)
            result_data = cursor.fetchone()
            conn.commit()
            
            if result_data:
                return Result.from_db_row(result_data)
            return None
            
        except Exception as e:
            conn.rollback()
            raise e
        finally:
            conn.close()

    @staticmethod
    def delete_result(result_id):
        conn = get_db_connection()
        cursor = conn.cursor()
        
        try:
            cursor.execute("""
                DELETE FROM rp_results
                WHERE rslt_id = %s
                RETURNING rslt_id
            """, (result_id,))
            
            deleted = cursor.fetchone()
            conn.commit()
            
            return bool(deleted)
            
        except Exception as e:
            conn.rollback()
            raise e
        finally:
            conn.close()