@echo off
REM Öffnet die lokale Website im Standardbrowser (robust)
setlocal
set "IDX=%~dp0index.html"
if not exist "%IDX%" (
	echo Fehler: index.html nicht gefunden.
	echo Erwarteter Pfad:
	echo    %IDX%
	echo Bitte pruefen, ob der Ordner korrekt ist.
	pause
	exit /b 1
)
echo Oeffne Webseite...
start "VCan" "%IDX%"
echo Falls sich nichts geoeffnet hat, kopiere diesen Pfad und fuege ihn in die Adresszeile deines Browsers ein:
echo    %IDX%
echo Oder druecke Windows+R, fuege den Pfad ein und Enter.
echo.
echo Druecke eine Taste zum Schliessen.
pause >nul
