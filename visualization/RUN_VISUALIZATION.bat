@echo off

start chrome --noerrdialogs --hide-crash-restore-bubble --force-device-scale-factor=1.1 --kiosk --app="http://localhost:3000" && npx serve dist