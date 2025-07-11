# 내 대출 한도 계산기 (LTV/DSR)

복잡하고 자주 바뀌는 부동산 대출 규제(LTV, DSR)를 사용자가 쉽고 정확하게 계산하여, 본인의 대출 가능 한도를 직관적으로 파악할 수 있는 모바일 앱입니다.

## 🚀 주요 기능

### 1. LTV (주택담보대출비율) 계산기
- **주택 가격**: 매매가 또는 시세 입력
- **주택 소재지**: 투기과열지구, 조정대상지역, 기타지역 선택
- **주택 보유 현황**: 무주택자, 1주택자, 다주택자 선택
- **계산 결과**: 적용 LTV 비율과 최대 대출 가능 금액 표시

### 2. DSR (총부채원리금상환비율) 계산기
- **연 소득**: 세전 연간 총소득 입력
- **신규 대출 조건**: 원금, 금리, 기간, 상환방식 설정
- **기존 보유 대출**: 모든 기존 대출 정보 입력 및 관리
- **계산 결과**: DSR 비율과 대출 가능 여부 판단

### 3. 사용자 편의 기능
- **용어 설명**: LTV, DSR 등 금융 용어에 대한 툴팁 제공
- **최신 규제 안내**: 현재 적용되는 규제 기준 정보 제공
- **결과 공유**: 계산 결과를 텍스트로 공유 가능
- **직관적인 UI**: 깔끔하고 사용하기 쉬운 인터페이스

## 📱 현재 규제 기준 (2024년)

### LTV (주택담보대출비율)
- **투기과열지구**: 무주택자 50%, 1주택자 40%, 다주택자 30%
- **조정대상지역**: 무주택자 60%, 1주택자 50%, 다주택자 40%
- **기타지역**: 무주택자 70%, 1주택자 60%, 다주택자 50%

### DSR (총부채원리금상환비율)
- **대출 한도**: 40% (연간 소득 대비 총 부채 원리금 상환액)

## 🛠 기술 스택

- **프레임워크**: React Native (Expo)
- **언어**: TypeScript
- **아이콘**: Expo Vector Icons
- **네비게이션**: React Navigation
- **스타일링**: React Native StyleSheet

## 📦 설치 및 실행

### 필수 요구사항
- Node.js (v16 이상)
- npm 또는 yarn
- Expo CLI

### 설치 방법

1. **저장소 클론**
```bash
git clone [repository-url]
cd LoanCalculator
```

2. **의존성 설치**
```bash
npm install
```

3. **앱 실행**
```bash
npm start
```

4. **플랫폼별 실행**
```bash
# Android
npm run android

# iOS (macOS 필요)
npm run ios

# 웹
npm run web
```

## 🎯 사용법

### 1. LTV 계산하기
1. 홈 화면에서 "LTV 계산기" 선택
2. 주택 가격 입력 (만원 단위)
3. 주택 소재지 선택 (투기과열지구/조정대상지역/기타지역)
4. 주택 보유 현황 선택 (무주택자/1주택자/다주택자)
5. "LTV 계산하기" 버튼 클릭
6. 결과 확인 후 "이 금액으로 DSR 계산하기" 선택 가능

### 2. DSR 계산하기
1. 홈 화면에서 "DSR 계산기" 선택 또는 LTV 결과에서 연결
2. 연 소득 입력 (세전, 만원 단위)
3. 신규 대출 조건 입력 (원금, 금리, 기간, 상환방식)
4. 기존 보유 대출이 있다면 "추가" 버튼으로 입력
5. "DSR 계산하기" 버튼 클릭
6. 결과 확인

### 3. 결과 공유하기
- 결과 화면에서 공유 버튼 클릭
- 계산 결과를 텍스트로 복사하여 다른 앱에 공유 가능

## 📁 프로젝트 구조

```
LoanCalculator/
├── src/
│   ├── components/          # 재사용 가능한 컴포넌트
│   │   ├── LTVCalculator.tsx
│   │   ├── DSRCalculator.tsx
│   │   ├── ResultScreen.tsx
│   │   └── Tooltip.tsx
│   ├── screens/             # 화면 컴포넌트
│   │   └── HomeScreen.tsx
│   ├── types/               # TypeScript 타입 정의
│   │   └── index.ts
│   └── utils/               # 유틸리티 함수
│       └── regulations.ts
├── App.tsx                  # 메인 앱 컴포넌트
├── package.json
└── README.md
```

## ⚠️ 주의사항

- 이 계산 결과는 **참고용**이며, 실제 대출 한도는 은행의 심사 결과에 따라 달라질 수 있습니다.
- 규제는 정부 정책에 따라 변경될 수 있으니 최신 정보를 확인하시기 바랍니다.
- 정확한 대출 상담을 위해서는 **은행에 직접 문의**하시기 바랍니다.

## 🔄 업데이트 계획

- [ ] 원격 규제 정보 업데이트 기능
- [ ] 계산 결과 저장 및 히스토리 기능
- [ ] 푸시 알림 (규제 변경 시)
- [ ] 다크 모드 지원
- [ ] 다국어 지원

## 📞 문의

앱 사용 중 문제가 발생하거나 개선 사항이 있으시면 이슈를 등록해 주세요.

---

**개발자**: AI Assistant  
**버전**: 1.0.0  
**라이선스**: MIT 