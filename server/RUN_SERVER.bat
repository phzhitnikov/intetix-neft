@echo off

set "SCRIPT_FOLDER=%~dp0"

set "VIRTUAL_ENV=%SCRIPT_FOLDER%\env"

call "%VIRTUAL_ENV%\Scripts\activate"

python "%SCRIPT_FOLDER%\main.py"

deactivate