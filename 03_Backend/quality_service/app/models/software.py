class Software:
    def __init__(self, id, name, general_objective, specific_objectives, 
                 company_name, city, evaluation_date):
        self.id = id
        self.name = name
        self.general_objective = general_objective
        self.specific_objectives = specific_objectives
        self.company_name = company_name
        self.city = city
        self.evaluation_date = evaluation_date

    @staticmethod
    def from_db_row(row):
        return Software(
            id=row[0],
            name=row[1],
            general_objective=row[2],
            specific_objectives=row[3],
            company_name=row[4],
            city=row[5],
            evaluation_date=row[6]
        )

    def to_dict(self):
        return {
            "id": self.id,
            "name": self.name,
            "general_objective": self.general_objective,
            "specific_objectives": self.specific_objectives,
            "company_name": self.company_name,
            "city": self.city,
            "evaluation_date": self.evaluation_date
        }