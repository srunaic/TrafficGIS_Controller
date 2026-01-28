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
    },
    getTrafficData: (timeSlot) => {
        // Mocking different congestion patterns based on timeSlot
        const patterns = {
            '08': ['정체', '정체', '서행', '정체'],
            '12': ['원활', '서행', '원활', '원활'],
            '18': ['정체', '서행', '정체', '정체'],
            '22': ['원활', '원활', '원활', '원활']
        };
        const levels = patterns[timeSlot] || patterns['12'];

        return {
            "type": "FeatureCollection",
            "features": [
                { "type": "Feature", "properties": { "link_id": "L1", "congestion_level": levels[0], "avg_speed": 15 }, "geometry": { "type": "LineString", "coordinates": [[126.97, 37.56], [126.98, 37.56]] } },
                { "type": "Feature", "properties": { "link_id": "L2", "congestion_level": levels[1], "avg_speed": 25 }, "geometry": { "type": "LineString", "coordinates": [[126.98, 37.56], [126.98, 37.57]] } },
                { "type": "Feature", "properties": { "link_id": "L3", "congestion_level": levels[2], "avg_speed": 18 }, "geometry": { "type": "LineString", "coordinates": [[126.98, 37.57], [126.97, 37.57]] } },
                { "type": "Feature", "properties": { "link_id": "L4", "congestion_level": levels[3], "avg_speed": 12 }, "geometry": { "type": "LineString", "coordinates": [[126.97, 37.57], [126.97, 37.56]] } }
            ]
        };
    }
};

window.QGIS_Output = QGIS_Output;
