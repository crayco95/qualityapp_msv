class Participant:
    def __init__(self, id, name, position, email, phone):
        self.id = id
        self.name = name
        self.position = position
        self.email = email
        self.phone = phone

    @staticmethod
    def from_db_row(row):
        return Participant(
            id=row[0],
            name=row[1],
            position=row[2],
            email=row[3],
            phone=row[4]
        )

    def to_dict(self):
        return {
            "id": self.id,
            "name": self.name,
            "position": self.position,
            "email": self.email,
            "phone": self.phone
        }