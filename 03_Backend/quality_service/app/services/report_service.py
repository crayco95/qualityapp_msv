from reportlab.lib import colors
from reportlab.lib.pagesizes import letter
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import inch
from io import BytesIO
from datetime import datetime

from app.services.assessment_service import AssessmentService
from app.services.software_service import SoftwareService
from app.services.standard_service import StandardService
from app.services.result_service import ResultService
from app.models.report import Report

class ReportService:
    @staticmethod
    def generate_assessment_report(assessment_id):
        # Obtener datos de la evaluación
        assessment = AssessmentService.get_assessment_by_id(assessment_id)
        if not assessment:
            raise ValueError("Evaluación no encontrada")

        # Obtener datos relacionados
        software = SoftwareService.get_software_by_id(assessment.software_id)
        standard = StandardService.get_standard_by_id(assessment.standard_id)
        results = ResultService.get_results_by_assessment(assessment_id)

        # Crear objeto reporte
        report = Report(
            software_name=software.name,
            standard_name=standard.name,
            assessment_date=assessment.date_create,
            results=[r.to_dict() for r in results],
            final_score=assessment.score,
            classification=assessment.classification_id
        )

        # Generar PDF
        buffer = BytesIO()
        doc = SimpleDocTemplate(buffer, pagesize=letter)
        story = []

        # Estilos
        styles = getSampleStyleSheet()
        title_style = styles['Heading1']
        normal_style = styles['Normal']

        # Título
        story.append(Paragraph(f"Reporte de Evaluación - {software.name}", title_style))
        story.append(Spacer(1, 12))

        # Información general
        story.append(Paragraph(f"Estándar: {standard.name}", normal_style))
        story.append(Paragraph(f"Fecha: {assessment.date_create.strftime('%d/%m/%Y')}", normal_style))
        story.append(Paragraph(f"Puntaje Final: {assessment.score}", normal_style))
        story.append(Spacer(1, 12))

        # Tabla de resultados
        if results:
            data = [['Parámetro', 'Puntaje', 'Clasificación']]
            for result in results:
                data.append([
                    result.param_id,
                    result.score,
                    result.classification_id
                ])

            table = Table(data)
            table.setStyle(TableStyle([
                ('BACKGROUND', (0, 0), (-1, 0), colors.grey),
                ('TEXTCOLOR', (0, 0), (-1, 0), colors.whitesmoke),
                ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
                ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
                ('FONTSIZE', (0, 0), (-1, 0), 14),
                ('BOTTOMPADDING', (0, 0), (-1, 0), 12),
                ('BACKGROUND', (0, 1), (-1, -1), colors.beige),
                ('TEXTCOLOR', (0, 1), (-1, -1), colors.black),
                ('FONTNAME', (0, 1), (-1, -1), 'Helvetica'),
                ('FONTSIZE', (0, 1), (-1, -1), 12),
                ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
                ('GRID', (0, 0), (-1, -1), 1, colors.black)
            ]))
            story.append(table)

        # Generar PDF
        doc.build(story)
        pdf = buffer.getvalue()
        buffer.close()
        
        return pdf

    @staticmethod
    def generate_software_summary_report(software_id):
        # Obtener datos del software
        software = SoftwareService.get_software_by_id(software_id)
        if not software:
            raise ValueError("Software no encontrado")
    
        # Obtener todas las evaluaciones del software
        assessments = AssessmentService.get_assessments_by_software(software_id)
        if not assessments:
            raise ValueError("No se encontraron evaluaciones para este software")
    
        # Generar PDF
        buffer = BytesIO()
        doc = SimpleDocTemplate(buffer, pagesize=letter)
        story = []
    
        # Estilos
        styles = getSampleStyleSheet()
        title_style = styles['Heading1']
        subtitle_style = styles['Heading2']
        normal_style = styles['Normal']
    
        # Título principal
        story.append(Paragraph(f"Reporte General de Evaluaciones - {software.name}", title_style))
        story.append(Spacer(1, 12))
    
        # Información del software
        story.append(Paragraph("Información del Software", subtitle_style))
        story.append(Paragraph(f"Nombre: {software.name}", normal_style))
        story.append(Paragraph(f"Descripción: {software.description}", normal_style))
        story.append(Spacer(1, 12))
    
        # Resumen estadístico
        total_evaluaciones = len(assessments)
        promedio_general = sum(a.score for a in assessments if a.score is not None) / total_evaluaciones if total_evaluaciones > 0 else 0
        
        story.append(Paragraph("Resumen Estadístico", subtitle_style))
        story.append(Paragraph(f"Total de Evaluaciones: {total_evaluaciones}", normal_style))
        story.append(Paragraph(f"Promedio General: {promedio_general:.2f}%", normal_style))
        story.append(Spacer(1, 12))
    
        # Tabla de evaluaciones
        story.append(Paragraph("Detalle de Evaluaciones", subtitle_style))
        
        data = [['Estándar', 'Parámetro', 'Puntaje', 'Clasificación', 'Fecha']]
        
        for assessment in assessments:
            standard = StandardService.get_standard_by_id(assessment.standard_id)
            parameter = ParameterService.get_parameter_by_id(assessment.param_id)
            classification = ClassificationService.get_classification_by_id(assessment.classification_id) if assessment.classification_id else None
            
            data.append([
                standard.name if standard else 'N/A',
                parameter.name if parameter else 'N/A',
                f"{assessment.score:.2f}%" if assessment.score is not None else 'N/A',
                classification.name if classification else 'N/A',
                assessment.date_create.strftime('%d/%m/%Y') if assessment.date_create else 'N/A'
            ])
    
        table = Table(data)
        table.setStyle(TableStyle([
            ('BACKGROUND', (0, 0), (-1, 0), colors.grey),
            ('TEXTCOLOR', (0, 0), (-1, 0), colors.whitesmoke),
            ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
            ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
            ('FONTSIZE', (0, 0), (-1, 0), 12),
            ('BOTTOMPADDING', (0, 0), (-1, 0), 12),
            ('BACKGROUND', (0, 1), (-1, -1), colors.beige),
            ('TEXTCOLOR', (0, 1), (-1, -1), colors.black),
            ('FONTNAME', (0, 1), (-1, -1), 'Helvetica'),
            ('FONTSIZE', (0, 1), (-1, -1), 10),
            ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
            ('GRID', (0, 0), (-1, -1), 1, colors.black)
        ]))
        story.append(table)
        story.append(Spacer(1, 12))
    
        # Gráfico de evolución (si hay múltiples evaluaciones)
        if total_evaluaciones > 1:
            story.append(Paragraph("Nota: Los resultados detallados y gráficos de evolución están disponibles en reportes individuales.", normal_style))
    
        # Generar PDF
        doc.build(story)
        pdf = buffer.getvalue()
        buffer.close()
        
        return pdf