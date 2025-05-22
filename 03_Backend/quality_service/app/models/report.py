class Report:
    def __init__(self, software_name, standard_name, assessment_date, results, final_score, classification):
        self.software_name = software_name
        self.standard_name = standard_name
        self.assessment_date = assessment_date
        self.results = results
        self.final_score = final_score
        self.classification = classification

    def to_dict(self):
        return {
            "software_name": self.software_name,
            "standard_name": self.standard_name,
            "assessment_date": self.assessment_date.isoformat() if self.assessment_date else None,
            "results": self.results,
            "final_score": self.final_score,
            "classification": self.classification
        }