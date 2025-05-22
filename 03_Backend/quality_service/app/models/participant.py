class Participant:
    def __init__(self, id, name, position, soft_id, usr_id, signature=None, date_create=None):
        self.id = id
        self.name = name
        self.position = position
        self.soft_id = soft_id
        self.usr_id = usr_id
        self.signature = signature
        self.date_create = date_create

    @staticmethod
    def from_db_row(row):
        return Participant(
            id=row[0],
            name=row[1],
            position=row[2],
            soft_id=row[3],
            usr_id=row[4],
            signature=row[5] if len(row) > 5 else None,
            date_create=row[6] if len(row) > 6 else None
        )

    def to_dict(self):
        return {
            "id": self.id,
            "name": self.name,
            "position": self.position,
            "soft_id": self.soft_id,
            "usr_id": self.usr_id,
            "signature": self.signature,
            "date_create": str(self.date_create) if self.date_create else None
        }