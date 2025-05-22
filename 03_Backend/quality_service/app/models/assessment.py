class Assessment:
    def __init__(self, id, software_id, standard_id, param_id, score=None, 
                 classification_id=None, date_create=None, date_update=None):
        self.id = id
        self.software_id = software_id
        self.standard_id = standard_id
        self.param_id = param_id 
        self.score = score
        self.classification_id = classification_id
        self.date_create = date_create
        self.date_update = date_update

    @staticmethod
    def from_db_row(row):
        return Assessment(
            id=row[0],
            software_id=row[1],
            standard_id=row[2],
            param_id=row[3],
            score=row[4] if len(row) > 4 else None,
            classification_id=row[5] if len(row) > 5 else None,
            date_create=row[6] if len(row) > 6 else None,
            date_update=row[7] if len(row) > 7 else None
        )

    def to_dict(self):
        return {
            "id": self.id,
            "software_id": self.software_id,
            "standard_id": self.standard_id,
            "param_id": self.param_id,
            "score": float(self.score) if self.score is not None else None,
            "classification_id": self.classification_id,
            "date_create": str(self.date_create) if self.date_create else None,
            "date_update": str(self.date_update) if self.date_update else None
        }