class Parameter:
    def __init__(self, id, standard_id, name, description, weight, parent_id=None, 
                 status=True, date_create=None, date_update=None):
        self.id = id
        self.standard_id = standard_id
        self.name = name
        self.description = description
        self.weight = weight
        self.parent_id = parent_id
        self.status = status
        self.date_create = date_create
        self.date_update = date_update

    @staticmethod
    def from_db_row(row):
        return Parameter(
            id=row[0],
            standard_id=row[1],
            name=row[2],
            description=row[3],
            weight=row[4],
            parent_id=row[5] if len(row) > 5 else None,
            status=row[6] if len(row) > 6 else True,
            date_create=row[7] if len(row) > 7 else None,
            date_update=row[8] if len(row) > 8 else None
        )

    def to_dict(self):
        return {
            "id": self.id,
            "standard_id": self.standard_id,
            "name": self.name,
            "description": self.description,
            "weight": float(self.weight),
            "parent_id": self.parent_id,
            "status": self.status,
            "date_create": str(self.date_create) if self.date_create else None,
            "date_update": str(self.date_update) if self.date_update else None
        }