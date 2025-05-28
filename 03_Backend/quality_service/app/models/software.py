class Software:
    def __init__(self, id, name, general_objective, specific_objectives,
                 company_name, city, phone, evaluation_date, date_create=None, date_update=None):
        self.id = id
        self.name = name
        self.general_objective = general_objective
        self.specific_objectives = specific_objectives
        self.company_name = company_name
        self.city = city
        self.phone = phone
        self.evaluation_date = evaluation_date
        self.date_create = date_create
        self.date_update = date_update

    @staticmethod
    def from_db_row(row):
        return Software(
            id=row[0],                      # soft_id
            name=row[1],                    # soft_name
            general_objective=row[2],       # soft_ge_objct
            specific_objectives=row[3],     # soft_spfc_objct
            company_name=row[4],           # soft_company
            city=row[5],                   # soft_city
            phone=row[6],                  # soft_phone
            evaluation_date=row[7],        # soft_test_date
            date_create=row[8] if len(row) > 8 else None,    # soft_date_create
            date_update=row[9] if len(row) > 9 else None     # soft_date_update
        )

    def to_dict(self):
        return {
            "id": self.id,
            "name": self.name,
            "general_objective": self.general_objective,
            "specific_objectives": self.specific_objectives,
            "company_name": self.company_name,
            "city": self.city,
            "phone": self.phone,
            "evaluation_date": str(self.evaluation_date) if self.evaluation_date else None,
            "date_create": str(self.date_create) if self.date_create else None,
            "date_update": str(self.date_update) if self.date_update else None
        }