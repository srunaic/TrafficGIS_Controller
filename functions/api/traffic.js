export async function onRequest(context) {
    const { searchParams } = new URL(context.request.url);
    const bbox = searchParams.get('bbox'); // minLng,minLat,maxLng,maxLat

    if (!bbox) {
        return new Response(JSON.stringify({ error: "Bbox required" }), { status: 400 });
    }

    // 1. Prepare Overpass QL Query
    // Format: [out:json];way["highway"](minLat,minLng,maxLat,maxLng);out geom;
    const [minLng, minLat, maxLng, maxLat] = bbox.split(',').map(Number);
    const overpassQuery = `[out:json][timeout:25];
    way["highway"~"primary|secondary|tertiary|residential"](${minLat},${minLng},${maxLat},${maxLng});
    out geom;`;

    const overpassUrl = `https://overpass-api.de/api/interpreter?data=${encodeURIComponent(overpassQuery)}`;

    try {
        const response = await fetch(overpassUrl);
        if (!response.ok) throw new Error("Overpass API Error");

        const osmData = await response.json();

        // 2. Convert OSM Elements to GeoJSON LineStrings
        const features = osmData.elements.filter(el => el.type === 'way' && el.geometry).map(way => {
            const coordinates = way.geometry.map(point => [point.lon, point.lat]);

            // 3. Inject Dynamic Traffic Attributes (Mocked for now, but on real geometry)
            const speed = Math.floor(Math.random() * 100) + 10;
            let congestion = '원활';
            if (speed < 20) congestion = '정체';
            else if (speed < 40) congestion = '서행';
            else if (speed > 70) congestion = '쾌속';

            return {
                type: 'Feature',
                properties: {
                    road_id: way.id,
                    name: way.tags.name || "Unnamed Road",
                    highway: way.tags.highway,
                    congestion: congestion,
                    avg_speed: speed,
                    timestamp: new Date().toISOString()
                },
                geometry: {
                    type: 'LineString',
                    coordinates: coordinates
                }
            };
        });

        return new Response(JSON.stringify({
            type: 'FeatureCollection',
            features: features,
            metadata: {
                source: "OpenStreetMap via Overpass API",
                count: features.length
            }
        }), {
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            }
        });

    } catch (err) {
        return new Response(JSON.stringify({
            error: "Failed to fetch real OSM data",
            details: err.message
        }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
}
