from app.db import get_db_connection
from app.models.participant import Participant

class ParticipantService:
    @staticmethod
    def create_participant(soft_id, usr_id, name, position, signature=None):
        conn = get_db_connection()
        cursor = conn.cursor()

        try:
            cursor.execute("""
                INSERT INTO ge_participants
                (prcnt_soft_id, prcnt_usr_id, prcnt_name, prcnt_position, prcnt_signature)
                VALUES (%s, %s, %s, %s, %s)
                RETURNING prcnt_id, prcnt_name, prcnt_position, prcnt_soft_id,
                          prcnt_usr_id, prcnt_signature, prcnt_date_create
            """, (soft_id, usr_id, name, position, signature))

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
                SELECT p.prcnt_id, p.prcnt_name, p.prcnt_position, p.prcnt_soft_id,
                       p.prcnt_usr_id, p.prcnt_signature, p.prcnt_date_create,
                       u.usr_name, u.usr_email, u.usr_rol, s.soft_name
                FROM ge_participants p
                LEFT JOIN au_users u ON p.prcnt_usr_id = u.usr_id
                LEFT JOIN ge_software s ON p.prcnt_soft_id = s.soft_id
                ORDER BY p.prcnt_date_create DESC
            """)

            participants = []
            for row in cursor.fetchall():
                participant_data = {
                    'id': row[0],
                    'name': row[1],
                    'position': row[2],
                    'soft_id': row[3],
                    'usr_id': row[4],
                    'signature': row[5],
                    'date_create': row[6],
                    'user_name': row[7],
                    'user_email': row[8],
                    'user_role': row[9] if row[9] else None,  # Rol del usuario desde au_users
                    'software_name': row[10]
                }
                participants.append(participant_data)

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

    @staticmethod
    def get_participants_by_software(soft_id):
        conn = get_db_connection()
        cursor = conn.cursor()

        try:
            cursor.execute("""
                SELECT p.prcnt_id, p.prcnt_name, p.prcnt_position, p.prcnt_soft_id,
                       p.prcnt_usr_id, p.prcnt_signature, p.prcnt_date_create,
                       u.usr_name, u.usr_email, u.usr_rol, s.soft_name
                FROM ge_participants p
                LEFT JOIN au_users u ON p.prcnt_usr_id = u.usr_id
                LEFT JOIN ge_software s ON p.prcnt_soft_id = s.soft_id
                WHERE p.prcnt_soft_id = %s
                ORDER BY p.prcnt_date_create DESC;
            """, (soft_id,))

            participants = []
            for row in cursor.fetchall():
                participant_data = {
                    'id': row[0],
                    'name': row[1],
                    'position': row[2],
                    'soft_id': row[3],
                    'usr_id': row[4],
                    'signature': row[5],
                    'date_create': row[6],
                    'user_name': row[7],
                    'user_email': row[8],
                    'user_role': row[9] if row[9] else None,  # Rol del usuario desde au_users
                    'software_name': row[10]  # Nombre del software
                }
                participants.append(participant_data)

            return participants
        finally:
            conn.close()

    @staticmethod
    def check_participant_exists(soft_id, usr_id):
        """Verificar si un usuario ya es participante de un software"""
        conn = get_db_connection()
        cursor = conn.cursor()

        try:
            cursor.execute("""
                SELECT COUNT(*) FROM ge_participants
                WHERE prcnt_soft_id = %s AND prcnt_usr_id = %s
            """, (soft_id, usr_id))

            count = cursor.fetchone()[0]
            return count > 0
        finally:
            conn.close()