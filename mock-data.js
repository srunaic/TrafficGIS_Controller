/**
 * Mock Data Generator (Simulating QGIS Processed Output)
 */

const QGIS_Output = {
    getRoutes: () => {
        return {
            "type": "FeatureCollection",
            "features": [
                {
                    "type": "Feature",
                    "properties": { "route_id": "7016", "route_nm": "7016번", "type": "Main", "color": "#2563eb" },
                    "geometry": { "type": "LineString", "coordinates": [[126.97, 37.56], [126.975, 37.562], [126.98, 37.565], [126.985, 37.568]] }
                },
                {
                    "type": "Feature",
                    "properties": { "route_id": "100", "route_nm": "100번", "type": "Express", "color": "#dc2626" },
                    "geometry": { "type": "LineString", "coordinates": [[126.96, 37.55], [126.97, 37.555], [126.98, 37.56], [126.99, 37.565]] }
                }
            ]
        };
    },
    getStops: () => {
        return {
            "type": "FeatureCollection",
            "features": [
                { "type": "Feature", "properties": { "stop_id": "S1", "stop_nm": "정류장 A" }, "geometry": { "type": "Point", "coordinates": [126.97, 37.56] } },
                { "type": "Feature", "properties": { "stop_id": "S2", "stop_nm": "정류장 B" }, "geometry": { "type": "Point", "coordinates": [126.98, 37.565] } }
            ]
        };
    }
};

window.QGIS_Output = QGIS_Output;
