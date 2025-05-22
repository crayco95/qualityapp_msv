from app.db import get_db_connection
from app.models.participant import Participant

class ParticipantService:
    @staticmethod
    def create_participant(name, position, soft_id, usr_id, signature=None):
        conn = get_db_connection()
        cursor = conn.cursor()
        
        try:
            cursor.execute("""
                INSERT INTO ge_participants 
                (prcnt_name, prcnt_position, prcnt_soft_id, prcnt_usr_id, prcnt_signature)
                VALUES (%s, %s, %s, %s, %s)
                RETURNING prcnt_id, prcnt_name, prcnt_position, prcnt_soft_id, 
                          prcnt_usr_id, prcnt_signature, prcnt_date_create
            """, (name, position, soft_id, usr_id, signature))
            
            participant_data = cursor.fetchone()
            conn.commit()
            
            return Participant.from_db_row(participant_data)
        except Exception as e:
            conn.rollback()
            raise e
        finally:
            conn.close()

    @staticmethod
    def get_all_participants():
        conn = get_db_connection()
        cursor = conn.cursor()
        
        try:
            cursor.execute("""
                SELECT prcnt_id, prcnt_name, prcnt_position, prcnt_soft_id, 
                       prcnt_usr_id, prcnt_signature, prcnt_date_create
                FROM ge_participants
                ORDER BY prcnt_name
            """)
            
            participants = [Participant.from_db_row(row) for row in cursor.fetchall()]
            return participants
        finally:
            conn.close()

    @staticmethod
    def get_participant_by_id(participant_id):
        conn = get_db_connection()
        cursor = conn.cursor()
        
        try:
            cursor.execute("""
                SELECT prcnt_id, prcnt_name, prcnt_position, prcnt_soft_id, 
                       prcnt_usr_id, prcnt_signature, prcnt_date_create
                FROM ge_participants
                WHERE prcnt_id = %s
            """, (participant_id,))
            
            participant_data = cursor.fetchone()
            if participant_data:
                return Participant.from_db_row(participant_data)
            return None
        finally:
            conn.close()

    @staticmethod
    def update_participant(participant_id, name=None, position=None, signature=None):
        conn = get_db_connection()
        cursor = conn.cursor()
        
        try:
            update_fields = []
            params = []
            
            if name is not None:
                update_fields.append("prcnt_name = %s")
                params.append(name)
            if position is not None:
                update_fields.append("prcnt_position = %s")
                params.append(position)
            if signature is not None:
                update_fields.append("prcnt_signature = %s")
                params.append(signature)
                
            if not update_fields:
                return None
                
            params.append(participant_id)
            
            query = f"""
                UPDATE ge_participants 
                SET {", ".join(update_fields)}
                WHERE prcnt_id = %s
                RETURNING prcnt_id, prcnt_name, prcnt_position, prcnt_soft_id, 
                          prcnt_usr_id, prcnt_signature, prcnt_date_create
            """
            
            cursor.execute(query, params)
            participant_data = cursor.fetchone()
            conn.commit()
            
            if participant_data:
                return Participant.from_db_row(participant_data)
            return None
            
        except Exception as e:
            conn.rollback()
            raise e
        finally:
            conn.close()

    @staticmethod
    def delete_participant(participant_id):
        conn = get_db_connection()
        cursor = conn.cursor()
        
        try:
            cursor.execute("""
                DELETE FROM ge_participants
                WHERE prcnt_id = %s
                RETURNING prcnt_id
            """, (participant_id,))
            
            deleted = cursor.fetchone()
            conn.commit()
            
            return bool(deleted)
            
        except Exception as e:
            conn.rollback()
            raise e
        finally:
            conn.close()