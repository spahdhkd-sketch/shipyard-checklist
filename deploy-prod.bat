@echo off
chcp 65001 >nul
setlocal enabledelayedexpansion
cd /d "%~dp0"
echo ============================================
echo  GS 안전 체크리스트 - 운영 배포 (원클릭)
echo ============================================
echo.
echo [1/3] 정적 에셋 빌드 중 (assets/dist 재생성)...
call npm.cmd run build:assets
if errorlevel 1 (
  echo 에셋 빌드 실패. 배포를 중단합니다.
  pause
  exit /b 1
)
echo.
echo [2/3] Vercel 프로덕션 배포 중...
set "DEPLOY_LOG=%TEMP%\gs-deploy-%RANDOM%.log"
set "DEPLOY_URL="
rem 전체 출력을 로그로 캡처 (stdout/stderr 구분에 의존하지 않음), --yes로 프롬프트 방지
call vercel.cmd --prod --yes > "%DEPLOY_LOG%" 2>&1
if errorlevel 1 (
  echo 배포 명령이 실패했습니다. 출력:
  type "%DEPLOY_LOG%"
  del "%DEPLOY_LOG%" 2>nul
  pause
  exit /b 1
)
rem 로그에서 첫 번째 배포 URL(https://....vercel.app)만 추출 (Inspect의 vercel.com 줄은 제외)
for /f "usebackq tokens=*" %%L in ("%DEPLOY_LOG%") do (
  if not defined DEPLOY_URL (
    for %%W in (%%L) do (
      if not defined DEPLOY_URL (
        echo %%W| findstr /i /r /c:"^https://[a-z0-9._-]*\.vercel\.app$" >nul && set "DEPLOY_URL=%%W"
      )
    )
  )
)
if defined DEPLOY_LOG del "%DEPLOY_LOG%" 2>nul
if "!DEPLOY_URL!"=="" (
  echo 배포 URL을 자동으로 찾지 못했습니다. 아래를 직접 실행하세요:
  echo   vercel --prod
  echo   vercel alias set ^<배포URL^> gs-safety-checklist.vercel.app
  pause
  exit /b 1
)
echo 배포 완료: !DEPLOY_URL!
echo.
echo [3/3] 운영 주소 연결 중...
call vercel.cmd alias set "!DEPLOY_URL!" gs-safety-checklist.vercel.app
if errorlevel 1 (
  echo alias 연결 실패. 수동 실행:
  echo   vercel alias set !DEPLOY_URL! gs-safety-checklist.vercel.app
  pause
  exit /b 1
)
echo.
echo ============================================
echo  완료! https://gs-safety-checklist.vercel.app
echo ============================================
pause
