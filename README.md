# 🛰️ Open Transit GIS | 실시간 교통 및 대중교통 분석 시스템

QGIS 데이터 파이프라인을 기반으로 한 실시간 교통 체증 및 대중교통 노선 시각화 시스템입니다. 데이터 정합성(Spatial Integrity)을 최우선으로 설계된 엔터프라이즈급 GIS 웹 솔루션입니다.

### 🔗 라이브 데모
**[실시간 서비스 접속하기](https://trafficgis-controller.pages.dev)**

---

## 🚀 주요 기능

### 1. 전국 단위 지역 지원 (Nationwide Support)
- **전국 주요 도시**: 서울, 부산, 대구, 인천, 광주, 대전 지역의 데이터를 즉시 확인 가능합니다.
- **지역별 노선 최적화**: 선택한 지역에 맞는 버스 노선 목록과 지리 정보를 자동으로 동기화합니다.

### 2. 실시간 교통 체증 시각화 (Real-time ITS)
- **Bbox 동적 로딩**: 현재 지도 화면 범위(Bounding Box) 내의 데이터를 실시간으로 가져와 성능을 최적화했습니다.
- **5분 주기 자동 갱신**: 데이터 소스와의 실시간 동기화를 통해 항상 최신 교통 상황을 제공합니다.
- **다이내믹 인터랙션**: 도로 위 마우스 오버 시 강조 효과 및 상세 정보(속도, 정체도, 갱신 시각) 팝업을 제공합니다.

### 3. 고정밀 데이터 정합성 (Spatial Data Integrity)
- **도로 중심선 기반 렌더링**: '정합성의 황금률'을 적용하여, 일직선의 링크 데이터가 아닌 실제 도로의 곡률을 정확히 따라가는 시각화를 구현했습니다.
- **QGIS 데이터 SOP**: 상용 수준의 데이터 정제를 위한 표준 작업 절차(SOP)를 수립하여 적용했습니다.

### 4. 공간 분석 레이어 (Spatial Analysis)
- **정류장 밀도 분석 (Heatmap)**: 대중교통 취약 지역 및 거점을 파악하기 위한 히트맵 레이어.
- **300m 생활권 분석 (Buffer)**: 정류장 중심의 역세권/생활권 영향도를 시각 분석합니다.

---

## 🛠️ 기술 스택

### **Frontend**
- **Leaflet.js**: 경량 오픈소스 지도 라이브러리.
- **Vanilla JS / CSS3**: 고성능 및 커스텀 디자인 시스템 구축.

### **Backend (Serverless)**
- **Cloudflare Pages Functions**: Edge 컴퓨팅 기반의 서버리스 API.
- **GeoJSON**: 표준 공간 데이터 교환 포맷.

### **Analysis & Data**
- **QGIS 3.x**: 공간 데이터 가공 및 정제(Fix, Simplify, Snap).
- **Spatial MariaDB/MySQL**: 공간 인덱스 및 연산 처리.

---

## 🗺️ 아키텍처 및 SOP
프로세스의 상세한 내용과 QGIS 작업 가이드는 아래 문서를 참조하세요:
- [QGIS 작업 표준 가이드 (SOP)](./public/docs/qgis-guide.md)
- [시스템 구현 워크스루](./walkthrough.md)

---
© 2026 Open Transit GIS Project. All rights reserved.
