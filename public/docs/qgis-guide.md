# QGIS Data Processing Guide (Public Transport GIS)

This guide outlines the professional workflow for preparing transit and traffic data for the web, focusing on **Spatial Data Integrity**.

## STEP 1: Data Preparation
1. **Import Data**: Load your CSV/SHP files into QGIS.
2. **Coordinate System**: Ensure all layers are set to `EPSG:4326` (WGS 84).
3. **Field Cleaning**: Use `Refactor Fields` to rename and drop unnecessary columns.

## STEP 2: Geometry Refinement (Enterprise Standard)
To ensure traffic lines accurately follow the road network in Web GIS, follow these steps:

1. **Fix Geometries**: `Vector > Geometry Tools > Fix Geometries`. Removes self-intersections and invalid rings.
2. **Standardize Layer Type**: `Vector > Geometry Tools > Multipart to Singleparts`. Ensures each road is a single `LineString`, not `MultiLineString`.
3. **Snap to Road**: Use the Snapping Toolbar (Tolerance: 5-10m) to align nodes perfectly with the road centerlines.
4. **Simplify for Web**: `Vector > Geometry Tools > Simplify` (Tolerance: 0.0001, Preserve Topology: Yes). This reduces data size while maintaining the "feel" of the road.

## STEP 3: Traffic Congestion Analysis
1. **Join Traffic Data**: Join your Road Network layer with the Traffic CSV using `road_id`.
   > [!IMPORTANT]
   > Geometry must always come from the refined Road layer, not the raw CSV.
2. **Calculate Congestion**: Use Field Calculator:
   ```sql
   CASE 
     WHEN "avg_speed" < 20 THEN '정체'
     WHEN "avg_speed" < 40 THEN '서행'
     ELSE '원활'
   END
   ```
3. **Time-Slot Segmentation**: Filter by time and export separate GeoJSONs (e.g., `traffic_08.geojson`).

## STEP 4: Export Protocols
- **Format**: GeoJSON.
- **Precision**: Set `COORDINATE_PRECISION` to `6`.
- **Simplification**: Apply simplification to ensure smooth rendering in Leaflet.

---

## 🚀 Web GIS Verification Checklist
- [x] LineString is singlepart?
- [x] Fix Geometries applied?
- [x] Simplify Geometry optimized?
- [x] road_id Join verified?
- [x] EPSG:4326 Project CRS?

---

## ✅ QGIS 도로 정합성 문제 해결 SOP (실행용 프롬프트)

**목적**: Web GIS(Leaflet)에서 교통 체증 선이 도로를 정확히 따라가도록 Geometry를 상용 수준으로 정제합니다.

### 작업 지시 (반드시 순서대로)
1.  **Geometry 유효성 검사**: `Vector > Geometry Tools > Check Validity`. 문제 피처 레이어 분리.
2.  **Geometry 정규화**: `Vector > Geometry Tools > Fix Geometries`. 모든 피처를 Valid 상태로 변환.
3.  **Multipart 단일화**: `Vector > Geometry Tools > Multipart to Singleparts`. 결과는 `LineString`만 유지.
4.  **도로 중심선 정합 (Snapping)**: 
    - Mode: `Vertex + Segment`, Tolerance: `5~10 meters`.
    - 실제 도로 중심선에 밀착되도록 스냅.
5.  **웹 시각화용 단순화 (Simplify)**:
    - Tolerance: `0.00005 ~ 0.0001`, `Preserve Topology` 활성화.
    - 불필요한 Vertex 제거로 웹 렌더링 성능 최적화.
6.  **Web 전용 레이어 분리**: 결과 레이어 `road_web_clean`으로 관리 (원본과 혼용 금지).
7.  **Join 재검증**: `road_id` 기준으로 조인하되, Geometry는 반드시 `road_web_clean`만 사용.
8.  **GeoJSON Export**:
    - CRS: `EPSG:4326`, Precision: `6`.
    - `Force multipart to singlepart` 활성화.
    - 필드 최소화: `road_id`, `avg_speed`, `congestion`, `time_slot`.

### 검증 기준
- [ ] 확대/축소 시 선이 튀거나 어긋나지 않음.
- [ ] 교차로에서 선들이 자연스럽게 연결됨.
- [ ]도로와 평행하지 않은 '중구난방' 선이 모두 제거됨.
- [ ] Leaflet `weight 3~5` 설정 시 깨끗하게 표시됨.
