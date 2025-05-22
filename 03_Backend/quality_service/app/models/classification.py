class Classification:
    def __init__(self, id, range_min, range_max, level, date_create=None, date_update=None):
        self.id = id
        self.range_min = range_min
        self.range_max = range_max
        self.level = level
        self.date_create = date_create
        self.date_update = date_update

    @staticmethod
    def from_db_row(row):
        return Classification(
            id=row[0],
            range_min=row[1],
            range_max=row[2],
            level=row[3],
            date_create=row[4] if len(row) > 4 else None,
            date_update=row[5] if len(row) > 5 else None
        )

    def to_dict(self):
        return {
            "id": self.id,
            "range_min": self.range_min,
            "range_max": self.range_max,
            "level": self.level,
            "date_create": str(self.date_create) if self.date_create else None,
            "date_update": str(self.date_update) if self.date_update else None
        }