from app.db import get_db_connection
from app.models.participant import Participant

class ParticipantService:
    @staticmethod
    def create_participant(name, position, email, phone):
        conn = get_db_connection()
        cursor = conn.cursor()
        
        try:
            cursor.execute("""
                INSERT INTO ge_participants 
                (part_name, part_position, part_email, part_phone)
                VALUES (%s, %s, %s, %s)
                RETURNING part_id, part_name, part_position, part_email, part_phone
            """, (name, position, email, phone))
            
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
                SELECT part_id, part_name, part_position, part_email, part_phone
                FROM ge_participants
                ORDER BY part_name
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
                SELECT part_id, part_name, part_position, part_email, part_phone
                FROM ge_participants
                WHERE part_id = %s
            """, (participant_id,))
            
            participant_data = cursor.fetchone()
            if participant_data:
                return Participant.from_db_row(participant_data)
            return None
        finally:
            conn.close()
    @staticmethod
    def update_participant(participant_id, name=None, position=None, email=None, phone=None):
        conn = get_db_connection()
        cursor = conn.cursor()
        
        try:
            update_fields = []
            params = []
            
            if name is not None:
                update_fields.append("part_name = %s")
                params.append(name)
            if position is not None:
                update_fields.append("part_position = %s")
                params.append(position)
            if email is not None:
                update_fields.append("part_email = %s")
                params.append(email)
            if phone is not None:
                update_fields.append("part_phone = %s")
                params.append(phone)
                
            if not update_fields:
                return None
                
            params.append(participant_id)
            
            query = f"""
                UPDATE ge_participants 
                SET {", ".join(update_fields)}
                WHERE part_id = %s
                RETURNING part_id, part_name, part_position, part_email, part_phone
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
                WHERE part_id = %s
                RETURNING part_id
            """, (participant_id,))
            
            deleted = cursor.fetchone()
            conn.commit()
            
            return bool(deleted)
            
        except Exception as e:
            conn.rollback()
            raise e
        finally:
            conn.close()