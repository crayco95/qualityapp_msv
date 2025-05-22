class Subcategory:
    def __init__(self, id, param_id, name, description, date_create=None, date_update=None):
        self.id = id
        self.param_id = param_id
        self.name = name
        self.description = description
        self.date_create = date_create
        self.date_update = date_update

    @staticmethod
    def from_db_row(row):
        return Subcategory(
            id=row[0],
            param_id=row[1],
            name=row[2],
            description=row[3],
            date_create=row[4] if len(row) > 4 else None,
            date_update=row[5] if len(row) > 5 else None
        )

    def to_dict(self):
        return {
            "id": self.id,
            "param_id": self.param_id,
            "name": self.name,
            "description": self.description,
            "date_create": str(self.date_create) if self.date_create else None,
            "date_update": str(self.date_update) if self.date_update else None
        }