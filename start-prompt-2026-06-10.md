# Start Prompt - 다른 데스크탑의 Claude / Codex 용 (2026-06-10)

## 먼저 (작업한 데스크탑에서) 푸시

이번 작업 커밋 3개가 아직 원격에 안 올라가 있습니다. 작업했던 데스크탑에서:

```powershell
cd <repo>
git log --oneline -4   # handoff + 3ef1800 / 205417e / dc9e4a7 확인
git push origin main
```

## 다른 데스크탑에서 시작할 때 붙여넣을 프롬프트

```text
GitHub `spahdhkd-sketch/shipyard-checklist` 저장소를 클론하고 main 브랜치를 pull한 뒤,
먼저 `handoff-2026-06-10.md`를 열어 현재 상태의 기준으로 삼아.

그다음 `npm install`(esbuild 포함), `npm run verify`(전부 통과해야 함),
`npm run build:assets`(assets/dist 재생성)로 로컬 상태를 확인해.

작업 시작 전에 production alias가 `gs-safety-checklist.vercel.app`,
Vercel 프로젝트가 `index-html`, Supabase ref가 `yuuroocvxvzgmsdeeiws`인지 다시 확인해.

중요: 이 마운트/대용량 파일 편집 시 끝이 잘리는 사례가 있었으니, 큰 파일은
편집 후 반드시 `node --check`로 검증해. (자세한 내용은 handoff-2026-06-10.md 참고)

다음 할 일 우선순위:
A) 압축 산출물(assets/dist)을 HTML/SW가 참조하도록 교체 + 에셋 토큰 bump
B) 다크모드 + 접근성(prefers-reduced-motion / focus-visible / 터치타깃)
C) CSP를 vercel.json 헤더로 일원화, app-v2.js 모듈 분할 지속
```
