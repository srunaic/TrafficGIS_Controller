export async function onRequest(context) {
    const { searchParams } = new URL(context.request.url);
    const time = searchParams.get('time') || '08';

    // Enterprise Traffic Data (GeoJSON) - Transitioned from PHP
    const data = {
        '08': [
            { id: 'L1', congestion: '정체', speed: 15, coords: [[126.97, 37.56], [126.98, 37.56]] },
            { id: 'L2', congestion: '정체', speed: 12, coords: [[126.98, 37.56], [126.98, 37.57]] }
        ],
        '18': [
            { id: 'L1', congestion: '정체', speed: 10, coords: [[126.97, 37.56], [126.98, 37.56]] },
            { id: 'L2', congestion: '서행', speed: 25, coords: [[126.98, 37.56], [126.98, 37.57]] }
        ],
        '12': [
            { id: 'L3', congestion: '원활', speed: 45, coords: [[126.98, 37.57], [126.97, 37.57]] },
            { id: 'L4', congestion: '원활', speed: 50, coords: [[126.97, 37.57], [126.97, 37.56]] }
        ]
    };

    const selected = data[time] || data['12'];

    const features = selected.map(item => ({
        type: 'Feature',
        properties: {
            link_id: item.id,
            congestion: item.congestion,
            avg_speed: item.speed
        },
        geometry: {
            type: 'LineString',
            coordinates: item.coords
        }
    }));

    return new Response(JSON.stringify({
        type: 'FeatureCollection',
        features: features
    }), {
        headers: { 'Content-Type': 'application/json' }
    });
}
