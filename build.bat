@echo off
echo ========================================
echo  Validador NFe - Build para Windows
echo  Smartsheet Inc.
echo ========================================
echo.

echo [1/3] Instalando dependencias...
call npm install

echo.
echo [2/3] Gerando executavel...
call npm run build

echo.
echo [3/3] Build concluido!
echo.
echo O instalador foi gerado em: dist/
echo.

pause

