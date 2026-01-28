export async function onRequest(context) {
    const { searchParams } = new URL(context.request.url);
    const time = searchParams.get('time') || '08';
    const bbox = searchParams.get('bbox');

    const features = [];

    if (bbox) {
        const [minLng, minLat, maxLng, maxLat] = bbox.split(',').map(Number);

        // Improved Mock Generation: Orthogonal "Grid-like" Road Segments
        const count = 12;
        for (let i = 0; i < count; i++) {
            const startLng = minLng + Math.random() * (maxLng - minLng);
            const startLat = minLat + Math.random() * (maxLat - minLat);

            // Force segments to be either horizontal or vertical for "road-like" look
            const isVertical = Math.random() > 0.5;
            const length = 0.005; // ~500m

            const endLng = isVertical ? startLng : startLng + (Math.random() > 0.5 ? length : -length);
            const endLat = isVertical ? startLat + (Math.random() > 0.5 ? length : -length) : startLat;

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
        features: features
    }), {
        headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
        }
    });
}
