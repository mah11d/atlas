import { useMemo, useState, useCallback, useEffect, useRef } from 'react';
import {
  ComposableMap,
  Geographies,
  Geography,
  Marker,
  ZoomableGroup,
  Line,
} from 'react-simple-maps';
import { useAtlas } from '@/context/AtlasContext';
import { getCountry, getOcean, countries } from '@/data';

const GEO_URL = 'https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json';

// ISO numeric (in TopoJSON) -> ISO alpha-3 mapping for the countries we have data for.
// The TopoJSON uses numeric IDs (UN M49). We map by name as a fallback.
const NAME_TO_ID: Record<string, string> = {};
countries.forEach((c) => {
  NAME_TO_ID[c.name.toLowerCase()] = c.id;
});

// Some TopoJSON names differ from our data names
const NAME_OVERRIDES: Record<string, string> = {
  'United States of America': 'USA',
  'United States': 'USA',
  'Russia': 'RUS',
  'Democratic Republic of the Congo': 'COD',
  'Republic of the Congo': 'COG',
  'Czechia': 'CZE',
  'South Korea': 'KOR',
  'North Korea': 'PRK',
  'Ivory Coast': 'CIV',
  "Côte d'Ivoire": 'CIV',
  'Burma': 'MMR',
  'Vietnam': 'VNM',
  'Iran': 'IRN',
  'Syria': 'SYR',
  'Bosnia and Herz.': 'BIH',
  'Dominican Rep.': 'DOM',
  'Central African Rep.': 'CAF',
  'Eq. Guinea': 'GNQ',
  'S. Sudan': 'SSD',
  'Dem. Rep. Congo': 'COD',
  'Congo': 'COG',
  'United Kingdom': 'GBR',
  'Netherlands': 'NLD',
  'Macedonia': 'MKD',
  'North Macedonia': 'MKD',
  'W. Sahara': 'ESH',
  'Bahamas': 'BHS',
  'Falkland Is.': 'FLK',
  'Fr. S. Antarctic Lands': 'ATF',
  'Solomon Is.': 'SLB',
  'N. Cyprus': 'CYP',
  'Kosovo': 'KSV',
  'Timor-Leste': 'TLS',
  'eSwatini': 'SWZ',
};

function resolveCountryId(name: string): string | undefined {
  if (NAME_OVERRIDES[name]) return NAME_OVERRIDES[name];
  return NAME_TO_ID[name.toLowerCase()];
}

interface WorldMapProps {
  onCountryClick?: (id: string) => void;
}

export default function WorldMap({ onCountryClick }: WorldMapProps) {
  const {
    theme, mapMode, selection, setSelection, setHoveredCountry, hoveredCountry,
    highlightedCountries, setHighlightedCountries, addRecent, setExplorerTab, coloredHighlights,
  } = useAtlas();
  const [position, setPosition] = useState({ coordinates: [0, 20], zoom: 1 });
  const containerRef = useRef<HTMLDivElement>(null);

  const isDark = theme === 'dark';

  const baseFill = useMemo(() => {
    if (mapMode === 'physical') return isDark ? '#1e3a2e' : '#cfe8d8';
    if (mapMode === 'daynight') return isDark ? '#1a1f2e' : '#7dd3fc';
    return isDark ? '#334155' : '#dbeafe';
  }, [mapMode, isDark]);

  const oceanFill = useMemo(() => {
    if (mapMode === 'physical') return isDark ? '#0c1f2e' : '#d6ecf5';
    if (mapMode === 'daynight') return isDark ? '#0a0e1a' : '#38bdf8';
    return isDark ? '#0f172a' : '#e0f2fe';
  }, [mapMode, isDark]);

  const handleMoveEnd = useCallback((next: typeof position) => {
    setPosition(next);
  }, []);

  const handleClick = useCallback(
    (geo: { properties: { name: string } }) => {
      const id = resolveCountryId(geo.properties.name);
      if (id) {
        addRecent(id);
        setSelection({ kind: 'country', id });
        setExplorerTab('countries');
        onCountryClick?.(id);
      }
    },
    [addRecent, setSelection, setExplorerTab, onCountryClick]
  );

  const handleHover = useCallback(
    (geo: { properties: { name: string } }) => {
      const id = resolveCountryId(geo.properties.name);
      setHoveredCountry(id ?? null);
    },
    [setHoveredCountry]
  );

  const handleLeave = useCallback(() => {
    setHoveredCountry(null);
  }, [setHoveredCountry]);

  // When selection is a country, highlight it
  const selectedId = selection?.kind === 'country' ? selection.id : null;

  // Compute fill for a country
  const getFill = useCallback(
    (name: string): string => {
      const id = resolveCountryId(name);
      if (!id) return isDark ? '#1e293b' : '#cbd5e1';
      if (selectedId === id) return '#3385ff';
      if (highlightedCountries.includes(id)) return coloredHighlights[id] || '#22d3ee';
      if (hoveredCountry === id) return isDark ? '#475569' : '#93c5fd';
      if (mapMode === 'daynight' && !isDark) {
        // Day side: warm sunny land colors
        const lon = resolveCountryId(name) ? 0 : 0; // placeholder
        void lon;
        return '#fcd34d';
      }
      return baseFill;
    },
    [selectedId, highlightedCountries, hoveredCountry, baseFill, isDark, mapMode, coloredHighlights]
  );

  // Day/night terminator (simplified): compute sun longitude
  const sunLon = useMemo(() => {
    const now = new Date();
    const utcHours = now.getUTCHours() + now.getUTCMinutes() / 60;
    // Sun is overhead at noon UTC at longitude 0, moves westward
    return -((utcHours - 12) * 15);
  }, []);

  // Re-render day/night every minute
  const [, setTick] = useState(0);
  useEffect(() => {
    if (mapMode !== 'daynight') return;
    const t = setInterval(() => setTick((x) => x + 1), 60000);
    return () => clearInterval(t);
  }, [mapMode]);

  // Ocean markers
  const oceanMarkers = useMemo(
    () =>
      [
        { id: 'pacific', label: 'Pacific', coords: [-160, 0] as [number, number] },
        { id: 'atlantic', label: 'Atlantic', coords: [-30, 10] as [number, number] },
        { id: 'indian', label: 'Indian', coords: [80, -20] as [number, number] },
        { id: 'southern', label: 'Southern', coords: [0, -70] as [number, number] },
        { id: 'arctic', label: 'Arctic', coords: [0, 80] as [number, number] },
      ],
    []
  );

  return (
    <div ref={containerRef} className="relative w-full h-full overflow-hidden rounded-2xl">
      <ComposableMap
        width={800}
        height={500}
        projection="geoEqualEarth"
        projectionConfig={{ scale: 160 }}
        style={{ width: '100%', height: '100%', background: oceanFill }}
      >
        <ZoomableGroup
          zoom={position.zoom}
          center={position.coordinates as [number, number]}
          onMoveEnd={handleMoveEnd}
          minZoom={1}
          maxZoom={8}
        >
          <Geographies geography={GEO_URL}>
            {((data: unknown) => {
              const geographies = (data as { geographies: Array<{ properties: { name: string }; rsmKey: string }> }).geographies;
              return geographies.map((geo) => {
                const id = resolveCountryId(geo.properties.name);
                const hasData = !!id && !!getCountry(id);
                return (
                  <Geography
                    key={geo.rsmKey}
                    geography={geo as never}
                    className="country-path"
                    onClick={() => handleClick(geo)}
                    onMouseEnter={() => handleHover(geo)}
                    onMouseLeave={handleLeave}
                    style={{
                      default: { fill: getFill(geo.properties.name), stroke: isDark ? '#0f172a' : '#ffffff', strokeWidth: 0.4 },
                      hover: { fill: getFill(geo.properties.name), stroke: '#3385ff', strokeWidth: 1, outline: 'none' },
                      pressed: { fill: '#3385ff', outline: 'none' },
                    }}
                    tabIndex={hasData ? 0 : -1}
                    role="button"
                    aria-label={geo.properties.name}
                  />
                );
              });
            })}
          </Geographies>

          {/* Day/night terminator overlay */}
          {mapMode === 'daynight' && (
            <>
              <Line
                from={[sunLon - 180, -90]}
                to={[sunLon - 180, 90]}
                stroke={isDark ? '#fbbf24' : '#f59e0b'}
                strokeWidth={2}
                strokeDasharray="6 4"
                strokeLinecap="round"
                opacity={0.9}
              />
              <Line
                from={[sunLon - 180, -90]}
                to={[sunLon - 180, 90]}
                stroke={isDark ? '#fbbf24' : '#fbbf24'}
                strokeWidth={6}
                strokeDasharray="2 8"
                strokeLinecap="round"
                opacity={0.3}
              />
            </>
          )}

          {/* Ocean labels */}
          {oceanMarkers.map((o) => (
            <Marker key={o.id} coordinates={o.coords} onClick={() => { const oc = getOcean(o.id); if (oc) setSelection({ kind: 'ocean', id: o.id }); }}>
              <text
                textAnchor="middle"
                y={0}
                style={{
                  fill: mapMode === 'daynight' ? '#94a3b8' : isDark ? '#64748b' : '#64748b',
                  fontSize: 10,
                  fontWeight: 600,
                  fontFamily: 'Inter, sans-serif',
                  pointerEvents: 'none',
                  opacity: 0.7,
                }}
              >
                {o.label}
              </text>
            </Marker>
          ))}

          {/* Markers for tiny countries we have data for but may not be visible at 110m */}
          {countries
            .filter((c) => c.area < 50000)
            .map((c) => (
              <Marker
                key={c.id}
                coordinates={c.coordinates}
                onClick={() => { addRecent(c.id); setSelection({ kind: 'country', id: c.id }); setExplorerTab('countries'); }}
                onMouseEnter={() => setHoveredCountry(c.id)}
                onMouseLeave={() => setHoveredCountry(null)}
              >
                <circle
                  r={position.zoom > 3 ? 3 : 2}
                  fill={selectedId === c.id ? '#3385ff' : highlightedCountries.includes(c.id) ? (coloredHighlights[c.id] || '#22d3ee') : '#f59e0b'}
                  stroke={isDark ? '#0f172a' : '#ffffff'}
                  strokeWidth={0.5}
                  style={{ cursor: 'pointer' }}
                />
              </Marker>
            ))}
        </ZoomableGroup>
      </ComposableMap>

      {/* Zoom controls */}
      <div className="absolute bottom-4 right-4 flex flex-col gap-1.5 z-20">
        <button
          onClick={() => setPosition((p) => ({ ...p, zoom: Math.min(p.zoom * 1.5, 8) }))}
          className="w-9 h-9 rounded-lg glass-strong flex items-center justify-center text-lg font-bold text-slate-700 dark:text-slate-200 hover:bg-brand-500 hover:text-white transition-colors shadow-md"
          aria-label="Zoom in"
        >
          +
        </button>
        <button
          onClick={() => setPosition((p) => ({ ...p, zoom: Math.max(p.zoom / 1.5, 1) }))}
          className="w-9 h-9 rounded-lg glass-strong flex items-center justify-center text-lg font-bold text-slate-700 dark:text-slate-200 hover:bg-brand-500 hover:text-white transition-colors shadow-md"
          aria-label="Zoom out"
        >
          −
        </button>
        <button
          onClick={() => setPosition({ coordinates: [0, 20], zoom: 1 })}
          className="w-9 h-9 rounded-lg glass-strong flex items-center justify-center text-slate-700 dark:text-slate-200 hover:bg-brand-500 hover:text-white transition-colors shadow-md text-xs font-bold"
          aria-label="Reset zoom"
        >
          ⌂
        </button>
      </div>

      {/* Legend */}
      <div className="absolute top-3 left-3 z-20 glass rounded-xl px-3 py-2 text-xs text-slate-600 dark:text-slate-300 hidden sm:block">
        <div className="flex items-center gap-1.5 mb-1">
          <span className="w-3 h-3 rounded-sm" style={{ background: '#3385ff' }} />
          <span>Selected</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-sm" style={{ background: '#22d3ee' }} />
          <span>Highlighted</span>
        </div>
      </div>
    </div>
  );
}
