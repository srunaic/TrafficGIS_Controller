# QGIS Data Processing Guide (Public Transport GIS)

This guide outlines the professional workflow for preparing transit data for the web using QGIS.

## STEP 1: Data Preparation
1. **Import Data**: Load your CSV/SHP files into QGIS.
2. **Coordinate System**: Ensure all layers are set to `EPSG:4326` (WGS 84).
   - Right-click Layer > Layer CRS > Set Layer CRS...
3. **Field Cleaning**: Use `Refactor Fields` to rename and drop unnecessary columns.

## STEP 2: Geometry Validation (Critical)
1. **Fix Geometries**: Run `Vector > Geometry Tools > Fix Geometries`.
2. **Check Validity**: Use `Vector > Geometry Tools > Check Validity` to find self-intersections or open rings.
3. **Snap to Road**: (Optional) Use the `Snap geometries to layer` tool to align bus routes with the road network.

## STEP 3: Spatial Analysis
1. **Dissolve**: If a bus route is split into multiple segments, use `Vector > Geoprocessing Tools > Dissolve` on the `route_id` field.
2. **Simplify**: For Web GIS performance, run `Vector > Geometry Tools > Simplify` (Tolerance: 0.0001).

## STEP 4: Traffic Congestion Analysis (New)
1. **Join Traffic Data**: Join your Road Network layer with the Traffic CSV (Speed/Volume) using `Link_ID`.
2. **Calculate Congestion**: Use Field Calculator to create a `congestion` field:
   ```sql
   CASE 
     WHEN "speed" < 20 THEN '정체'
     WHEN "speed" < 40 THEN '서행'
     ELSE '원활'
   END
   ```
3. **Time-Slot Segmentation**: Filter data by time (e.g., `time = '08:00'`) and export as separate GeoJSONs or a combined DB table with a `time_slot` column.

## QGIS 실무 분석 시나리오 (Portfolio Scenario)
1. **데이터 조인**: `road_id` 기반으로 도로 네트워크(SHP)와 교통속도(CSV) 결합.
2. **속성 계산**: 필드 계산기를 사용하여 `congestion` 필드 생성.
   - `정체`: < 20km/h, `서행`: 20~40km/h, `원활`: > 40km/h.
3. **공간 필터링**: `time_slot` = '08:00' 등의 필터를 적용하여 시간대별 분석 수행.
4. **결과 검증**: 도로와 정류장 레이어를 중첩하여 "노선별 지연 구간" 시각적 확인.

## STEP 5: Export for Web/DB
- **For Web**: Right-click > Export > Save Features As... > **GeoJSON**.
  - Set `COORDINATE_PRECISION` to `6` to reduce file size.
- **For Database**: 
  1. Open `DB Manager` in QGIS.
  2. Connect to your MySQL/MariaDB.
  3. Import the layer directly into the tables created by `schema.sql`.

> [!TIP]
> Always keep a backup of the original dataset before performing 'Dissolve' or 'Simplify' operations.
