class Standard:
    def __init__(self, id, name, description, version, status=True, date_create=None, date_update=None):
        self.id = id
        self.name = name
        self.description = description
        self.version = version
        self.status = status
        self.date_create = date_create
        self.date_update = date_update

    @staticmethod
    def from_db_row(row):
        return Standard(
            id=row[0],
            name=row[1],
            description=row[2],
            version=row[3],
            status=row[4],
            date_create=row[5],
            date_update=row[6]
        )

    def to_dict(self):
        return {
            "id": self.id,
            "name": self.name,
            "description": self.description,
            "version": self.version,
            "status": self.status,
            "date_create": str(self.date_create) if self.date_create else None,
            "date_update": str(self.date_update) if self.date_update else None
        }