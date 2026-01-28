/**
 * Mock Data Generator (Simulating QGIS Processed Output)
 * Expanded for National Regions
 */

const QGIS_Output = {
    regionalRoutes: {
        seoul: [
            { "type": "Feature", "properties": { "route_id": "Seoul-100", "route_nm": "100번 (도심순환)", "color": "#2563eb" }, "geometry": { "type": "LineString", "coordinates": [[126.97, 37.56], [126.98, 37.57]] } },
            { "type": "Feature", "properties": { "route_id": "Seoul-7016", "route_nm": "7016번 (지선)", "color": "#10b981" }, "geometry": { "type": "LineString", "coordinates": [[126.96, 37.55], [126.97, 37.56]] } }
        ],
        busan: [
            { "type": "Feature", "properties": { "route_id": "Busan-1001", "route_nm": "1001번 (급행)", "color": "#dc2626" }, "geometry": { "type": "LineString", "coordinates": [[129.07, 35.17], [129.08, 35.18]] } },
            { "type": "Feature", "properties": { "route_id": "Busan-88", "route_nm": "88번 (부산역)", "color": "#2563eb" }, "geometry": { "type": "LineString", "coordinates": [[129.04, 35.11], [129.05, 35.12]] } }
        ],
        daegu: [
            { "type": "Feature", "properties": { "route_id": "Daegu-805", "route_nm": "805번 (순환)", "color": "#f59e0b" }, "geometry": { "type": "LineString", "coordinates": [[128.60, 35.87], [128.61, 35.88]] } },
            { "type": "Feature", "properties": { "route_id": "Daegu-Express1", "route_nm": "급행1번", "color": "#dc2626" }, "geometry": { "type": "LineString", "coordinates": [[128.58, 35.85], [128.59, 35.86]] } }
        ],
        incheon: [
            { "type": "Feature", "properties": { "route_id": "Incheon-2", "route_nm": "인천 2번", "color": "#2563eb" }, "geometry": { "type": "LineString", "coordinates": [[126.70, 37.45], [126.71, 37.46]] } }
        ],
        gwangju: [
            { "type": "Feature", "properties": { "route_id": "Gwangju-01", "route_nm": "순환01", "color": "#f59e0b" }, "geometry": { "type": "LineString", "coordinates": [[126.85, 35.15], [126.86, 35.16]] } }
        ],
        daejeon: [
            { "type": "Feature", "properties": { "route_id": "Daejeon-102", "route_nm": "102번", "color": "#10b981" }, "geometry": { "type": "LineString", "coordinates": [[127.38, 36.35], [127.39, 36.36]] } }
        ]
    },

    getRoutes: (city = 'seoul') => {
        return {
            "type": "FeatureCollection",
            "features": QGIS_Output.regionalRoutes[city] || QGIS_Output.regionalRoutes['seoul']
        };
    },

    getStops: () => {
        return {
            "type": "FeatureCollection",
            "features": [
                { "type": "Feature", "properties": { "stop_id": "S1", "stop_nm": "정류장 A" }, "geometry": { "type": "Point", "coordinates": [126.97, 37.56] } },
                { "type": "Feature", "properties": { "stop_id": "S2", "stop_nm": "정류장 B" }, "geometry": { "type": "Point", "coordinates": [128.60, 35.87] } }
            ]
        };
    },

    getHeatmapData: () => {
        return {
            "type": "FeatureCollection",
            "features": [
                { "type": "Feature", "properties": { "intensity": 0.8 }, "geometry": { "type": "Point", "coordinates": [126.975, 37.565] } },
                { "type": "Feature", "properties": { "intensity": 0.6 }, "geometry": { "type": "Point", "coordinates": [126.980, 37.562] } },
                { "type": "Feature", "properties": { "intensity": 0.9 }, "geometry": { "type": "Point", "coordinates": [126.972, 37.568] } }
            ]
        };
    },

    getBufferData: () => {
        return {
            "type": "FeatureCollection",
            "features": [
                { "type": "Feature", "properties": { "type": "buffer" }, "geometry": { "type": "Polygon", "coordinates": [[[126.965, 37.56], [126.975, 37.56], [126.975, 37.57], [126.965, 37.57], [126.965, 37.56]]] } }
            ]
        };
    }
};

window.QGIS_Output = QGIS_Output;
