export async function onRequest(context) {
    const { searchParams } = new URL(context.request.url);
    const time = searchParams.get('time') || '08';
    const bbox = searchParams.get('bbox'); // minX,minY,maxX,maxY

    /**
     * Real-time Traffic Data Logic
     * In a production environment with MariaDB/PostGIS:
     * SELECT * FROM traffic_link 
     * WHERE time_slot = :time 
     * AND MBRIntersects(geom, ST_GeomFromText('POLYGON((...))'))
     */

    const allData = {
        '08': [
            { id: 'L1', congestion: '정체', speed: 15, coords: [[126.97, 37.56], [126.98, 37.56]] },
            { id: 'L2', congestion: '정체', speed: 12, coords: [[126.98, 37.56], [126.98, 37.57]] },
            { id: 'L3', congestion: '서행', speed: 30, coords: [[126.96, 37.55], [126.97, 37.56]] },
            { id: 'L4', congestion: '원활', speed: 55, coords: [[126.99, 37.57], [127.00, 37.58]] }
        ],
        '18': [
            { id: 'L1', congestion: '정체', speed: 10, coords: [[126.97, 37.56], [126.98, 37.56]] },
            { id: 'L2', congestion: '서행', speed: 25, coords: [[126.98, 37.56], [126.98, 37.57]] },
            { id: 'L5', congestion: '정체', speed: 8, coords: [[126.95, 37.54], [126.96, 37.55]] }
        ]
    };

    let selected = allData[time] || allData['08'];

    // Simple Mock Bbox Filtering Logic
    if (bbox) {
        const [minX, minY, maxX, maxY] = bbox.split(',').map(Number);
        selected = selected.filter(item => {
            // Check if any coordinate of the line is within the bbox
            return item.coords.some(([lng, lat]) =>
                lng >= minX && lng <= maxX && lat >= minY && lat <= maxY
            );
        });
    }

    const features = selected.map(item => ({
        type: 'Feature',
        properties: {
            link_id: item.id,
            congestion: item.congestion,
            avg_speed: item.speed,
            timestamp: new Date().toISOString()
        },
        geometry: {
            type: 'LineString',
            coordinates: item.coords
        }
    }));

    return new Response(JSON.stringify({
        type: 'FeatureCollection',
        features: features,
        metadata: {
            bbox: bbox,
            time: time,
            count: features.length
        }
    }), {
        headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
        }
    });
}
