:: =========================================================================================================================================================================
:: #VERSION:0000001000
:: =========================================================================================================================================================================
:: HISTORIAL DE CAMBIOS
::
:: Version        GAP                Solicitud        Fecha        Realiza            Descripcion
:: -----------    -------------    -------------    ----------    -------------    -----------------------------------------------------------------------------------------
:: 1000                                             17/05/2025      Cesar           Se crea bash para la instalacion de la base de datos
:: -----------    -------------    -------------    ----------    -------------    -----------------------------------------------------------------------------------------
:: =========================================================================================================================================================================

@echo off
title INSTALACION GENERAL PROJECT QUALITY APP

set pgcl = PGCLIENTENCODING=utf-8
:: Ubicacion donde se encuentra el instalador general
set "CURRENT_DIR=%cd%"

:: --------------------------------------------------------- 

echo.
echo -----------------------------------------
echo            INSTALADOR GENERAL!
echo -----------------------------------------
echo.
echo Se ubica en la unidad del repositorio del proyecto
echo.
echo %CURRENT_DIR%
echo.
echo Digite Pasword Postgres
SET /p passwd_postgres=%psswd%
SET PGPASSWORD=%passwd_postgres%
echo.
echo -----------------------------------------
echo            DATABASE_SCHEMA
echo -----------------------------------------
cd "DATABASE_SCHEMA"
echo.
chcp 65001
echo.
echo Se ejecuta PGCLIENTENCODING
echo.
psql -h 127.0.0.1 -p 5432 -U postgres -d postgres -a -f INSTALADOR_GENERAL.sql > compila.lst
echo.
echo Se finalizo la instalacion de database schema.
echo.
:: --------------------------------------------------------- 
cd %CURRENT_DIR%
echo.
dir PARCHE_V* /b /on > parches.lst
echo -----------------------------------------
echo          EJECUCION DE PARCHES...
echo -----------------------------------------
FOR /F %%x in (parches.lst) DO (
		echo -----------------------------------------
		echo             %%x
		cd %CURRENT_DIR%
		cd %%x
		echo.
		psql -U postgres -d postgres -a -f INSTALADOR_GENERAL.sql > compila.lst
		echo Se finalizo la instalacion del %%x. 
		echo.
		echo -----------------------------------------
	)	
pause
