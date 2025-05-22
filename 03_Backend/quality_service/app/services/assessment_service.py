from app.db import get_db_connection
from app.models.assessment import Assessment
import logging

class AssessmentService:
    @staticmethod
    def _validate_relations(cursor, software_id, standard_id, param_id):
        # Validar software
        cursor.execute("SELECT sftw_id FROM ge_software WHERE sftw_id = %s", (software_id,))
        if not cursor.fetchone():
            raise ValueError("El software especificado no existe")
            
        # Validar estándar
        cursor.execute("SELECT strnd_id FROM ge_standards WHERE strnd_id = %s", (standard_id,))
        if not cursor.fetchone():
            raise ValueError("El estándar especificado no existe")
            
        # Validar parámetro y su relación con el estándar
        cursor.execute("""
            SELECT param_id FROM ge_parameters 
            WHERE param_id = %s AND param_stdr_id = %s
        """, (param_id, standard_id))
        if not cursor.fetchone():
            raise ValueError("El parámetro no existe o no pertenece al estándar especificado")

    @staticmethod
    def _get_classification_for_score(cursor, score):
        if score is None:
            return None
            
        cursor.execute("""
            SELECT clsf_id 
            FROM ge_clasification 
            WHERE %s BETWEEN clsf_range_min AND clsf_range_max
        """, (score,))
        result = cursor.fetchone()
        return result[0] if result else None

    @staticmethod
    def _check_duplicate_assessment(cursor, software_id, standard_id, param_id):
        cursor.execute("""
            SELECT assmt_id 
            FROM rp_assessment 
            WHERE assmt_software_id = %s 
            AND assmt_standard_id = %s 
            AND assmt_param_id = %s
        """, (software_id, standard_id, param_id))
        return cursor.fetchone() is not None

    @staticmethod
    def create_assessment(software_id, standard_id, param_id, score=None, classification_id=None):
        conn = get_db_connection()
        cursor = conn.cursor()
        
        try:
            # Validaciones iniciales
            if score is not None and not 0 <= float(score) <= 100:
                raise ValueError("El puntaje debe estar entre 0 y 100")

            # Validar relaciones
            AssessmentService._validate_relations(cursor, software_id, standard_id, param_id)

            # Verificar duplicados
            if AssessmentService._check_duplicate_assessment(cursor, software_id, standard_id, param_id):
                raise ValueError("Ya existe una evaluación para esta combinación de software, estándar y parámetro")

            # Obtener clasificación automáticamente si no se proporciona
            if score is not None and classification_id is None:
                classification_id = AssessmentService._get_classification_for_score(cursor, score)

            cursor.execute("""
                INSERT INTO rp_assessment 
                (assmt_software_id, assmt_standard_id, assmt_param_id, 
                 assmt_score, assmt_classification_id)
                VALUES (%s, %s, %s, %s, %s)
                RETURNING assmt_id, assmt_software_id, assmt_standard_id, 
                          assmt_param_id, assmt_score, assmt_classification_id,
                          assmt_date_create, assmt_date_update
            """, (software_id, standard_id, param_id, score, classification_id))
            
            assessment_data = cursor.fetchone()
            conn.commit()
            
            logging.info(f"Evaluación creada exitosamente: ID {assessment_data[0]}")
            return Assessment.from_db_row(assessment_data)

        except Exception as e:
            conn.rollback()
            logging.error(f"Error al crear evaluación: {str(e)}")
            raise e
        finally:
            conn.close()

    @staticmethod
    def get_assessments_by_software(software_id):
        conn = get_db_connection()
        cursor = conn.cursor()
        
        try:
            cursor.execute("""
                SELECT a.assmt_id, a.assmt_software_id, a.assmt_standard_id, 
                       a.assmt_param_id, a.assmt_score, a.assmt_classification_id,
                       a.assmt_date_create, a.assmt_date_update
                FROM rp_assessment a
                JOIN ge_software s ON s.sftw_id = a.assmt_software_id
                WHERE a.assmt_software_id = %s
                ORDER BY a.assmt_standard_id, a.assmt_param_id
            """, (software_id,))
            
            return [Assessment.from_db_row(row) for row in cursor.fetchall()]
        finally:
            conn.close()

    @staticmethod
    def get_software_summary(software_id):
        conn = get_db_connection()
        cursor = conn.cursor()
        
        try:
            cursor.execute("""
                SELECT 
                    assmt_standard_id,
                    COUNT(*) as total_evaluations,
                    AVG(assmt_score) as average_score,
                    MIN(assmt_score) as min_score,
                    MAX(assmt_score) as max_score
                FROM rp_assessment
                WHERE assmt_software_id = %s
                GROUP BY assmt_standard_id
            """, (software_id,))
            
            summary = {}
            for row in cursor.fetchall():
                summary[row[0]] = {
                    'total_evaluaciones': row[1],
                    'promedio': float(row[2]) if row[2] else 0,
                    'minimo': float(row[3]) if row[3] else 0,
                    'maximo': float(row[4]) if row[4] else 0
                }
            return summary
        finally:
            conn.close()

    @staticmethod
    def get_assessments_by_standard(standard_id):
        conn = get_db_connection()
        cursor = conn.cursor()
        
        try:
            cursor.execute("""
                SELECT assmt_id, assmt_software_id, assmt_standard_id, 
                       assmt_param_id, assmt_score, assmt_classification_id,
                       assmt_date_create, assmt_date_update
                FROM rp_assessment
                WHERE assmt_standard_id = %s
                ORDER BY assmt_software_id, assmt_param_id
            """, (standard_id,))
            
            return [Assessment.from_db_row(row) for row in cursor.fetchall()]
        finally:
            conn.close()

    @staticmethod
    def get_assessment_by_id(assessment_id):
        conn = get_db_connection()
        cursor = conn.cursor()
        
        try:
            cursor.execute("""
                SELECT assmt_id, assmt_software_id, assmt_standard_id, 
                       assmt_param_id, assmt_score, assmt_classification_id,
                       assmt_date_create, assmt_date_update
                FROM rp_assessment
                WHERE assmt_id = %s
            """, (assessment_id,))
            
            data = cursor.fetchone()
            return Assessment.from_db_row(data) if data else None
        finally:
            conn.close()

    @staticmethod
    def update_assessment(assessment_id, score=None, classification_id=None):
        conn = get_db_connection()
        cursor = conn.cursor()
        
        try:
            if score is not None:
                if not 0 <= float(score) <= 100:
                    raise ValueError("El puntaje debe estar entre 0 y 100")
                
                # Actualizar clasificación automáticamente si se actualiza el puntaje
                if classification_id is None:
                    classification_id = AssessmentService._get_classification_for_score(cursor, score)

            update_fields = []
            params = []
            
            if score is not None:
                update_fields.append("assmt_score = %s")
                params.append(score)
            if classification_id is not None:
                update_fields.append("assmt_classification_id = %s")
                params.append(classification_id)
                
            if not update_fields:
                return None

            update_fields.append("assmt_date_update = CURRENT_TIMESTAMP")
            params.append(assessment_id)
            
            query = f"""
                UPDATE rp_assessment 
                SET {", ".join(update_fields)}
                WHERE assmt_id = %s
                RETURNING assmt_id, assmt_software_id, assmt_standard_id, 
                          assmt_param_id, assmt_score, assmt_classification_id,
                          assmt_date_create, assmt_date_update
            """
            
            cursor.execute(query, params)
            data = cursor.fetchone()
            conn.commit()
            
            if data:
                logging.info(f"Evaluación actualizada exitosamente: ID {assessment_id}")
                return Assessment.from_db_row(data)
            return None
            
        except Exception as e:
            conn.rollback()
            logging.error(f"Error al actualizar evaluación {assessment_id}: {str(e)}")
            raise e
        finally:
            conn.close()

    @staticmethod
    def delete_assessment(assessment_id):
        conn = get_db_connection()
        cursor = conn.cursor()
        
        try:
            cursor.execute("""
                DELETE FROM rp_assessment
                WHERE assmt_id = %s
                RETURNING assmt_id
            """, (assessment_id,))
            
            deleted = cursor.fetchone()
            conn.commit()
            
            return bool(deleted)
            
        except Exception as e:
            conn.rollback()
            raise e
        finally:
            conn.close()