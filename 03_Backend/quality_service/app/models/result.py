from datetime import datetime

class Result:
    def __init__(self, result_id, assessment_id, score, classification_id, 
                 date_create=None, date_update=None):
        self.result_id = result_id
        self.assessment_id = assessment_id
        self.score = score
        self.classification_id = classification_id
        self.date_create = date_create
        self.date_update = date_update

    @staticmethod
    def from_db_row(row):
        return Result(
            result_id=row[0],
            assessment_id=row[1],
            score=row[2],
            classification_id=row[3],
            date_create=row[4],
            date_update=row[5]
        )

    def to_dict(self):
        return {
            "result_id": self.result_id,
            "assessment_id": self.assessment_id,
            "score": self.score,
            "classification_id": self.classification_id,
            "date_create": self.date_create.isoformat() if self.date_create else None,
            "date_update": self.date_update.isoformat() if self.date_update else None
        }