from app.db import get_db_connection
from app.models.parameter import Parameter

class ParameterService:
    @staticmethod
    def create_parameter(standard_id, name, description, weight, parent_id=None, status=True):
        conn = get_db_connection()
        cursor = conn.cursor()
        
        try:
            # Validar peso
            if not 0 <= float(weight) <= 1:
                raise ValueError("El peso debe estar entre 0 y 1")

            # Validar parent_id si existe
            if parent_id:
                cursor.execute("""
                    SELECT param_stdr_id FROM ge_parameters WHERE param_id = %s
                """, (parent_id,))
                parent = cursor.fetchone()
                if not parent:
                    raise ValueError("El parámetro padre no existe")
                if parent[0] != standard_id:
                    raise ValueError("El parámetro padre debe pertenecer al mismo estándar")

            cursor.execute("""
                INSERT INTO ge_parameters 
                (param_stdr_id, param_name, param_description, param_weight, 
                 param_parent_id, param_status)
                VALUES (%s, %s, %s, %s, %s, %s)
                RETURNING param_id, param_stdr_id, param_name, param_description, 
                          param_weight, param_parent_id, param_status, 
                          param_date_create, param_date_update
            """, (standard_id, name, description, weight, parent_id, status))
            
            parameter_data = cursor.fetchone()
            conn.commit()
            
            return Parameter.from_db_row(parameter_data)
        except Exception as e:
            conn.rollback()
            raise e
        finally:
            conn.close()

    @staticmethod
    def update_parameter(parameter_id, name=None, description=None, weight=None, status=None):
        conn = get_db_connection()
        cursor = conn.cursor()
        
        try:
            update_fields = []
            params = []
            
            if name is not None:
                update_fields.append("param_name = %s")
                params.append(name)
            if description is not None:
                update_fields.append("param_description = %s")
                params.append(description)
            if weight is not None:
                if not 0 <= float(weight) <= 1:
                    raise ValueError("El peso debe estar entre 0 y 1")
                update_fields.append("param_weight = %s")
                params.append(weight)
            if status is not None:
                update_fields.append("param_status = %s")
                params.append(status)
                
            if not update_fields:
                return None

            
                
            params.append(parameter_id)
            
            query = f"""
                UPDATE ge_parameters 
                SET {", ".join(update_fields)}
                WHERE param_id = %s
                RETURNING param_id, param_stdr_id, param_name, param_description, 
                          param_weight, param_parent_id, param_status,
                          param_date_create, param_date_update
            """
            
            cursor.execute(query, params)
            parameter_data = cursor.fetchone()
            conn.commit()
            
            if parameter_data:
                return Parameter.from_db_row(parameter_data)
            return None
            
        except Exception as e:
            conn.rollback()
            raise e
        finally:
            conn.close()

    @staticmethod
    def get_parameters_by_standard(standard_id):
        conn = get_db_connection()
        cursor = conn.cursor()
        
        try:
            cursor.execute("""
                WITH RECURSIVE param_tree AS (
                    SELECT 
                        param_id, param_stdr_id, param_name, param_description, 
                        param_weight, param_parent_id, param_status,
                        0 as level,
                        ARRAY[param_id] as path
                    FROM ge_parameters
                    WHERE param_parent_id IS NULL AND param_stdr_id = %s
                    
                    UNION ALL
                    
                    SELECT 
                        p.param_id, p.param_stdr_id, p.param_name, p.param_description,
                        p.param_weight, p.param_parent_id, p.param_status,
                        pt.level + 1,
                        pt.path || p.param_id
                    FROM ge_parameters p
                    INNER JOIN param_tree pt ON p.param_parent_id = pt.param_id
                )
                SELECT * FROM param_tree
                ORDER BY path;
            """, (standard_id,))
            
            parameters = [Parameter.from_db_row(row) for row in cursor.fetchall()]
            return parameters
        finally:
            conn.close()

    @staticmethod
    def get_parameter_by_id(parameter_id):
        conn = get_db_connection()
        cursor = conn.cursor()
        
        try:
            cursor.execute("""
                SELECT param_id, param_stdr_id, param_name, param_description, 
                       param_weight, param_parent_id, param_status
                FROM ge_parameters
                WHERE param_id = %s
            """, (parameter_id,))
            
            parameter_data = cursor.fetchone()
            if parameter_data:
                return Parameter.from_db_row(parameter_data)
            return None
        finally:
            conn.close()

    @staticmethod
    def delete_parameter(parameter_id):
        conn = get_db_connection()
        cursor = conn.cursor()
        
        try:
            # Verificar si tiene parámetros hijos
            cursor.execute("""
                SELECT COUNT(*) FROM ge_parameters
                WHERE param_parent_id = %s
            """, (parameter_id,))
            
            if cursor.fetchone()[0] > 0:
                raise ValueError("No se puede eliminar un parámetro que tiene subparámetros")

            cursor.execute("""
                DELETE FROM ge_parameters
                WHERE param_id = %s
                RETURNING param_id
            """, (parameter_id,))
            
            deleted = cursor.fetchone()
            conn.commit()
            
            return bool(deleted)
            
        except Exception as e:
            conn.rollback()
            raise e
        finally:
            conn.close()