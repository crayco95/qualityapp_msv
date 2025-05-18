--################################################################################      
--##=============================================================================#      
--##=============================================================================#      
--##                               Base de Datos                                 #                          
--##=============================================================================#      
--##=============================================================================#      
--################################################################################   

--##=============================================================================#   
--## Actualización Postgres
--##=============================================================================#  
Se deben ejecutar la siguiente linea de comando dentro del directorio en donde se ha guardado la carpeta de del parche [PARCHE_N.N.N]/:
~~~
chcp 65001
SET PGCLIENTENCODING=utf-8 
psql -U postgres -d postgres -a -f INSTALADOR_GENERAL.sql > compila.lst
~~~
posteriormente se debe escribir la contraseña del usuario postgres el cual se define durante la instalacion de POSTGRES.

                                                                                  
