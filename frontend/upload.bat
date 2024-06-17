@echo off
setlocal

:: Ejecutar la construcción del proyecto Angular
echo "Iniciando la construcción del proyecto..."
call npm run build --base-href='./'



echo "Construcción completada con éxito."

:: Configuración
set SERVER=libreelec
set USER=root
@REM set PASS=mypassword
set LOCAL_DIR=dist/proyecto-software/browser
set REMOTE_DIR=.local/www/www/aula

:: Generar el archivo de comandos SFTP
echo Generando el archivo de comandos SFTP...
echo lcd %LOCAL_DIR% > sftp_commands.txt
echo cd %REMOTE_DIR% >> sftp_commands.txt
echo put * >> sftp_commands.txt
echo bye >> sftp_commands.txt

:: Mostrar el contenido del archivo de comandos SFTP para verificación
type sftp_commands.txt

:: Ejecutar SFTP con los comandos generados
echo "Ejecutando SFTP..."
sftp -b sftp_commands.txt %USER%@%SERVER%

echo "Carga SFTP completada con éxito."

:: Limpiar
del sftp_commands.txt

endlocal
@echo on
