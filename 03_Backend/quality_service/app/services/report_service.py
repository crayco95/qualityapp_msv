from reportlab.lib import colors
from reportlab.lib.pagesizes import letter
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle
from reportlab.lib.styles import getSampleStyleSheet
from io import BytesIO

from app.db import get_db_connection

class ReportService:
    @staticmethod
    def generate_assessment_report(assessment_id):
        """Genera un reporte PDF para una evaluación específica"""
        conn = get_db_connection()
        cursor = conn.cursor()

        try:
            # Obtener datos de la evaluación
            cursor.execute("""
                SELECT
                    a.assmt_id,
                    a.assmt_score,
                    a.assmt_date_create,
                    s.soft_name,
                    s.soft_company,
                    s.soft_city,
                    st.strnd_name,
                    st.strnd_version,
                    st.strnd_description,
                    p.param_name,
                    p.param_description,
                    p.param_weight,
                    c.clsf_level,
                    c.clsf_range_min,
                    c.clsf_range_max
                FROM rp_assessment a
                JOIN ge_software s ON s.soft_id = a.assmt_software_id
                JOIN ge_standards st ON st.strnd_id = a.assmt_standard_id
                JOIN ge_parameters p ON p.param_id = a.assmt_param_id
                LEFT JOIN ge_clasification c ON c.clsf_id = a.assmt_classification_id
                WHERE a.assmt_id = %s
            """, (assessment_id,))

            assessment_data = cursor.fetchone()
            if not assessment_data:
                raise ValueError("Evaluación no encontrada")

            # Crear el PDF
            buffer = BytesIO()
            doc = SimpleDocTemplate(buffer, pagesize=letter)
            styles = getSampleStyleSheet()
            story = []

            # Título
            story.append(Paragraph(f"Reporte de Evaluación - {assessment_data[3]}", styles['Heading1']))
            story.append(Spacer(1, 12))

            # Información general
            story.append(Paragraph(f"Estándar: {assessment_data[6]} v{assessment_data[7]}", styles['Normal']))
            story.append(Paragraph(f"Fecha: {assessment_data[2].strftime('%d/%m/%Y') if assessment_data[2] else 'N/A'}", styles['Normal']))
            story.append(Paragraph(f"Puntaje: {assessment_data[1] if assessment_data[1] is not None else 'N/A'}", styles['Normal']))
            story.append(Paragraph(f"Clasificación: {assessment_data[12] if assessment_data[12] else 'Sin clasificar'}", styles['Normal']))
            story.append(Spacer(1, 12))

            # Información del software
            story.append(Paragraph("Información del Software", styles['Heading2']))
            story.append(Paragraph(f"Empresa: {assessment_data[4]}", styles['Normal']))
            story.append(Paragraph(f"Ciudad: {assessment_data[5]}", styles['Normal']))
            story.append(Spacer(1, 12))

            # Información del parámetro
            story.append(Paragraph("Parámetro Evaluado", styles['Heading2']))
            story.append(Paragraph(f"Nombre: {assessment_data[9]}", styles['Normal']))
            story.append(Paragraph(f"Descripción: {assessment_data[10] if assessment_data[10] else 'N/A'}", styles['Normal']))
            story.append(Paragraph(f"Peso: {(assessment_data[11] * 100):.1f}%", styles['Normal']))

            # Generar PDF
            doc.build(story)
            pdf = buffer.getvalue()
            buffer.close()

            return pdf

        except Exception as e:
            raise e
        finally:
            conn.close()

    @staticmethod
    def generate_software_summary_report(software_id):
        """Genera un reporte consolidado para un software"""
        conn = get_db_connection()
        cursor = conn.cursor()

        try:
            # Obtener información del software
            cursor.execute("""
                SELECT soft_name, soft_company, soft_city
                FROM ge_software
                WHERE soft_id = %s
            """, (software_id,))

            software_data = cursor.fetchone()
            if not software_data:
                raise ValueError("Software no encontrado")

            # Obtener todas las evaluaciones del software
            cursor.execute("""
                SELECT
                    a.assmt_id,
                    a.assmt_score,
                    a.assmt_date_create,
                    st.strnd_name,
                    st.strnd_version,
                    p.param_name,
                    c.clsf_level
                FROM rp_assessment a
                JOIN ge_standards st ON st.strnd_id = a.assmt_standard_id
                JOIN ge_parameters p ON p.param_id = a.assmt_param_id
                LEFT JOIN ge_clasification c ON c.clsf_id = a.assmt_classification_id
                WHERE a.assmt_software_id = %s
                ORDER BY st.strnd_name, p.param_name
            """, (software_id,))

            evaluations = cursor.fetchall()

            # Crear el PDF
            buffer = BytesIO()
            doc = SimpleDocTemplate(buffer, pagesize=letter)
            styles = getSampleStyleSheet()
            story = []

            # Título
            story.append(Paragraph(f"Reporte Consolidado - {software_data[0]}", styles['Heading1']))
            story.append(Spacer(1, 12))

            # Información del software
            story.append(Paragraph("Información del Software", styles['Heading2']))
            story.append(Paragraph(f"Empresa: {software_data[1]}", styles['Normal']))
            story.append(Paragraph(f"Ciudad: {software_data[2]}", styles['Normal']))
            story.append(Paragraph(f"Total de Evaluaciones: {len(evaluations)}", styles['Normal']))
            story.append(Spacer(1, 12))

            # Tabla de evaluaciones
            if evaluations:
                story.append(Paragraph("Detalle de Evaluaciones", styles['Heading2']))

                data = [['ID', 'Estándar', 'Parámetro', 'Puntuación', 'Clasificación', 'Fecha']]

                for eval in evaluations:
                    data.append([
                        str(eval[0]),
                        f"{eval[3]} v{eval[4]}",
                        eval[5],
                        f"{eval[1]:.1f}" if eval[1] is not None else "N/A",
                        eval[6] or "Sin clasificar",
                        eval[2].strftime('%d/%m/%Y') if eval[2] else 'N/A'
                    ])

                table = Table(data)
                table.setStyle(TableStyle([
                    ('BACKGROUND', (0, 0), (-1, 0), colors.grey),
                    ('TEXTCOLOR', (0, 0), (-1, 0), colors.whitesmoke),
                    ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
                    ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
                    ('FONTSIZE', (0, 0), (-1, 0), 10),
                    ('BOTTOMPADDING', (0, 0), (-1, 0), 12),
                    ('BACKGROUND', (0, 1), (-1, -1), colors.beige),
                    ('GRID', (0, 0), (-1, -1), 1, colors.black)
                ]))
                story.append(table)
            else:
                story.append(Paragraph("No se encontraron evaluaciones para este software.", styles['Normal']))

            # Generar PDF
            doc.build(story)
            pdf = buffer.getvalue()
            buffer.close()

            return pdf

        except Exception as e:
            raise e
        finally:
            conn.close()