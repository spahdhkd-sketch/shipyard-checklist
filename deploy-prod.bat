@echo off
chcp 65001 >nul
cd /d "%~dp0"
echo ============================================
echo  GS 안전 체크리스트 - 운영 배포 (원클릭)
echo ============================================
echo.
echo [1/2] Vercel 프로덕션 배포 중...
for /f "delims=" %%u in ('call vercel --prod 2^>nul') do set DEPLOY_URL=%%u
if "%DEPLOY_URL%"=="" (
  echo 배포 URL을 가져오지 못했습니다. 아래 명령을 직접 실행해 보세요:
  echo   vercel --prod
  pause
  exit /b 1
)
echo 배포 완료: %DEPLOY_URL%
echo.
echo [2/2] 운영 주소 연결 중...
call vercel alias set %DEPLOY_URL% gs-safety-checklist.vercel.app
echo.
echo ============================================
echo  완료! https://gs-safety-checklist.vercel.app
echo ============================================
pause
