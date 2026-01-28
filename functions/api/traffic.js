export async function onRequest(context) {
    const { searchParams } = new URL(context.request.url);
    const time = searchParams.get('time') || '08';
    const bbox = searchParams.get('bbox');

    // Nationwide Real-time Traffic Data (Mock)
    // We generate dynamic data based on the requested bbox area
    const features = [];

    if (bbox) {
        const [minLng, minLat, maxLng, maxLat] = bbox.split(',').map(Number);

        // Generate 5-10 random road segments within the visible bbox
        const count = 8;
        for (let i = 0; i < count; i++) {
            const startLng = minLng + Math.random() * (maxLng - minLng);
            const startLat = minLat + Math.random() * (maxLat - minLat);
            const endLng = startLng + (Math.random() - 0.5) * 0.01;
            const endLat = startLat + (Math.random() - 0.5) * 0.01;

            const speed = Math.floor(Math.random() * 60) + 10;
            let congestion = '원활';
            if (speed < 20) congestion = '정체';
            else if (speed < 40) congestion = '서행';

            features.push({
                type: 'Feature',
                properties: {
                    link_id: `L-${Math.floor(Math.random() * 90000) + 10000}`,
                    congestion: congestion,
                    avg_speed: speed,
                    timestamp: new Date().toISOString()
                },
                geometry: {
                    type: 'LineString',
                    coordinates: [[startLng, startLat], [endLng, endLat]]
                }
            });
        }
    }

    return new Response(JSON.stringify({
        type: 'FeatureCollection',
        features: features,
        metadata: {
            timestamp: new Date().toISOString(),
            region_count: features.length
        }
    }), {
        headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
        }
    });
}
