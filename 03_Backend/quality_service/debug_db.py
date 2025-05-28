#!/usr/bin/env python3
"""
Script para verificar el estado de la base de datos
"""
import sys
import os
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from app.db import get_db_connection

def check_database():
    print("🔍 Verificando estado de la base de datos...")

    conn = get_db_connection()
    if not conn:
        print("❌ Error: No se pudo conectar a la base de datos")
        return

    cursor = conn.cursor()

    try:
        # Verificar estándares
        print("\n📋 Verificando estándares...")
        cursor.execute("SELECT strnd_id, strnd_name, strnd_version FROM ge_standards ORDER BY strnd_id")
        standards = cursor.fetchall()
        print(f"   Estándares encontrados: {len(standards)}")
        for std in standards:
            print(f"   - ID: {std[0]}, Nombre: {std[1]}, Versión: {std[2]}")

        # Verificar parámetros
        print("\n📊 Verificando parámetros...")
        cursor.execute("SELECT COUNT(*) FROM ge_parameters")
        param_count = cursor.fetchone()[0]
        print(f"   Total de parámetros: {param_count}")

        if param_count > 0:
            cursor.execute("""
                SELECT param_id, param_name, param_standard_id, param_parent_id
                FROM ge_parameters
                ORDER BY param_standard_id, param_parent_id NULLS FIRST, param_id
                LIMIT 10
            """)
            params = cursor.fetchall()
            print("   Primeros 10 parámetros:")
            for param in params:
                parent_info = f", Padre: {param[3]}" if param[3] else ""
                print(f"   - ID: {param[0]}, Nombre: {param[1]}, Estándar: {param[2]}{parent_info}")

        # Verificar software
        print("\n💻 Verificando software...")
        cursor.execute("SELECT COUNT(*) FROM ge_software")
        software_count = cursor.fetchone()[0]
        print(f"   Total de software: {software_count}")

        if software_count > 0:
            cursor.execute("SELECT soft_id, soft_name, soft_company FROM ge_software LIMIT 5")
            softwares = cursor.fetchall()
            print("   Software disponible:")
            for sw in softwares:
                print(f"   - ID: {sw[0]}, Nombre: {sw[1]}, Empresa: {sw[2]}")

        # Verificar evaluaciones
        print("\n📝 Verificando evaluaciones...")
        cursor.execute("SELECT COUNT(*) FROM rp_assessment")
        assessment_count = cursor.fetchone()[0]
        print(f"   Total de evaluaciones: {assessment_count}")

        # Verificar estructura de tabla de parámetros
        print("\n🔧 Verificando estructura de ge_parameters...")
        cursor.execute("""
            SELECT column_name, data_type, is_nullable
            FROM information_schema.columns
            WHERE table_name = 'ge_parameters'
            ORDER BY ordinal_position
        """)
        columns = cursor.fetchall()
        print("   Columnas de ge_parameters:")
        for col in columns:
            print(f"   - {col[0]}: {col[1]} ({'NULL' if col[2] == 'YES' else 'NOT NULL'})")

    except Exception as e:
        print(f"❌ Error al verificar la base de datos: {e}")
    finally:
        conn.close()

if __name__ == "__main__":
    check_database()
