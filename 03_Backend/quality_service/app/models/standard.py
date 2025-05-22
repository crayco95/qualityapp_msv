class Standard:
    def __init__(self, id, name, description, version, status=True):
        self.id = id
        self.name = name
        self.description = description
        self.version = version
        self.status = status

    @staticmethod
    def from_db_row(row):
        return Standard(
            id=row[0],
            name=row[1],
            description=row[2],
            version=row[3],
            status=row[4] if len(row) > 4 else True
        )

    def to_dict(self):
        return {
            "id": self.id,
            "name": self.name,
            "description": self.description,
            "version": self.version,
            "status": self.status
        }