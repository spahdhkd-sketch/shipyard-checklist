@echo off
chcp 65001 >nul
cd /d "%~dp0"
echo 운영 주소에 새 배포를 연결합니다...
call vercel alias set index-html-l3novbksr-spahdhkd-3161s-projects.vercel.app gs-safety-checklist.vercel.app
echo.
echo 완료! 창을 닫으셔도 됩니다.
pause
