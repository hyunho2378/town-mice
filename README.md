# 화천 Town MICE PASS (프로토타입)

빌드 도구 없는 정적 웹앱입니다. React/ReactDOM/Babel/Tailwind를 CDN으로 불러오고,
브라우저에서 바로 JSX를 변환합니다. Node 설치나 빌드 과정이 필요 없습니다.

## 실행 방법

`index.html`을 정적 서버로 열면 됩니다.

```
python3 -m http.server 8080
```

그다음 http://localhost:8080 접속.

## 구성

- 더픽트 Bill Concert(bill.thepict.co.kr) 실제 화면 구조를 복제(로그인, 인증현황, 영수증 인증 플로우)
- 화천 전용 확장: 1박 누적 목표, 화천 3대 권역 스탬프, NFC 태그(결제 없는 지점), 대행사/화천군 리포트 화면
