# 🗺️ 관광 정보 웹 서비스 (React + Node.js)

이 프로젝트는 ![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)를 기반으로 한 SPA(Single Page Application)로,  
![NodeJS](https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white)와 연동되어 사용자 인터랙션 및 데이터 처리를 수행하는 웹 애플리케이션입니다.

## 💡 주요 기능

- ✅ **회원가입 및 로그인 페이지**
  - JWT 기반 인증
  - 사용자 상태 유지 및 보호된 라우팅

- 🌍 **통역기 기능 페이지**
  - 사용자가 입력한 텍스트를 다양한 언어로 번역
  - 텍스트를 음성으로, 음성을 텍스트로 변환
  - 외부 번역 API 연동

- 📌 **지도 페이지**
  - 관광지 위치 시각화
  - 현재 위치에서 관광지까지의 경로 출력

- 🔍 **관광지 검색 페이지**
  - 키워드로 지역 및 명소 검색
  - 관광지 설명 출력

- ⭐ **관광지 즐겨찾기 페이지**
  - 로그인 사용자 기준 즐겨찾기 추가/삭제
  - 즐겨찾기 목록 조회 가능

## 🛠 사용 기술

| 영역       | 기술 스택                                  |
|------------|---------------------------------------------|
| 프론트엔드 | React.js, React Router, Axios, CSS/Styled-Components |
| 백엔드     | Node.js, Express.js                         |
| 인증       | JWT (JSON Web Token)                        |
| API 통신   | REST API 기반 통신                          |
| 지도 기능  | Google Map API          |
