import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Search, MapPin, SlidersHorizontal, Map, List, ChevronDown, Navigation } from 'lucide-react';
import PropertyCard from '../components/property/PropertyCard';
import FilterSidebar from '../components/search/FilterSidebar';
import FilterChips from '../components/search/FilterChips';
import MapPanel from '../components/search/MapPanel';
import ComparisonBar from '../components/compare/ComparisonBar';
import EmptyState from '../components/common/EmptyState';
import { PropertyGridSkeleton } from '../components/common/LoadingSkeleton';
import { useSaved } from '../context/SavedContext';
import { Building2 } from 'lucide-react';
import { reverseGeocode } from '../services/locationService';
import { calculateDistanceKm, formatDistance } from '../utils/haversine';

const SORT_OPTIONS = [
  { value: 'recommended', label: 'Recommended' },
  { value: 'newest', label: 'Newest' },
  { value: 'price_low', label: 'Price: Low to High' },
  { value: 'price_high', label: 'Price: High to Low' },
  { value: 'area_low', label: 'Area: Low to High' },
  { value: 'area_high', label: 'Area: High to Low' },
  { value: 'distance', label: 'Distance: Closest First' }
];

const KNOWN_COORDINATES = {
  chennai: { lat: 13.0827, lng: 80.2707 },
  'anna nagar': { lat: 13.0850, lng: 80.2101 },
  adyar: { lat: 13.0012, lng: 80.2565 },
  'besant nagar': { lat: 13.0003, lng: 80.2667 },
  't nagar': { lat: 13.0418, lng: 80.2341 },
  't. nagar': { lat: 13.0418, lng: 80.2341 },
  velachery: { lat: 12.9815, lng: 80.2180 },
  omr: { lat: 12.9348, lng: 80.2312 },
  porur: { lat: 13.0382, lng: 80.1565 },
  bengaluru: { lat: 12.9716, lng: 77.5946 },
  bangalore: { lat: 12.9716, lng: 77.5946 },
  whitefield: { lat: 12.9698, lng: 77.7499 },
  indiranagar: { lat: 12.9784, lng: 77.6408 },
  'hsr layout': { lat: 12.9121, lng: 77.6446 },
  'sarjapur road': { lat: 12.9112, lng: 77.6833 },
  koramangala: { lat: 12.9352, lng: 77.6245 },
  devanahalli: { lat: 13.2458, lng: 77.7126 },
  hebbal: { lat: 13.0358, lng: 77.5970 },
  hyderabad: { lat: 17.3850, lng: 78.4867 },
  gachibowli: { lat: 17.4401, lng: 78.3489 },
  'hitec city': { lat: 17.4474, lng: 78.3762 },
  'jubilee hills': { lat: 17.4325, lng: 78.4073 },
  'banjara hills': { lat: 17.4156, lng: 78.4350 },
  mumbai: { lat: 19.0760, lng: 72.8777 },
  'bandra west': { lat: 19.0596, lng: 72.8295 },
  bandra: { lat: 19.0596, lng: 72.8295 },
  powai: { lat: 19.1176, lng: 72.9060 },
  worli: { lat: 19.0176, lng: 72.8152 },
  'andheri west': { lat: 19.1363, lng: 72.8277 },
  delhi: { lat: 28.6139, lng: 77.2090 },
  'vasant vihar': { lat: 28.5606, lng: 77.1610 },
  'hauz khas': { lat: 28.5494, lng: 77.2001 },
  gurgaon: { lat: 28.4595, lng: 77.0266 },
  gurugram: { lat: 28.4595, lng: 77.0266 },
  'golf course road': { lat: 28.4595, lng: 77.0966 },
  'dlf cyber city': { lat: 28.4905, lng: 77.0911 },
  noida: { lat: 28.5355, lng: 77.3910 },
  pune: { lat: 18.5204, lng: 73.8567 },
  'koregaon park': { lat: 18.5362, lng: 73.8939 },
  hinjewadi: { lat: 18.5913, lng: 73.7389 },
  baner: { lat: 18.5590, lng: 73.7792 },
  coimbatore: { lat: 11.0168, lng: 76.9558 },
  'rs puram': { lat: 11.0084, lng: 76.9472 },
  kochi: { lat: 9.9312, lng: 76.2673 },
  'marine drive': { lat: 9.9816, lng: 76.2753 },
  kakkanad: { lat: 10.0159, lng: 76.3419 },
  vijayawada: { lat: 16.5062, lng: 80.6480 },
  'benz circle': { lat: 16.5015, lng: 80.6534 },
  visakhapatnam: { lat: 17.6868, lng: 83.2185 },
  vizag: { lat: 17.6868, lng: 83.2185 },
  'mvp colony': { lat: 17.7420, lng: 83.3412 },
  tirupati: { lat: 13.6288, lng: 79.4192 },
  alipiri: { lat: 13.6515, lng: 79.3956 },
  madurai: { lat: 9.9252, lng: 78.1198 },
  'kk nagar': { lat: 9.9312, lng: 78.1485 },
  pondicherry: { lat: 11.9416, lng: 79.8083 },
  puducherry: { lat: 11.9416, lng: 79.8083 },
  'white town': { lat: 11.9328, lng: 79.8359 },
  auroville: { lat: 11.9882, lng: 79.8122 }
};

const PAGE_SIZE = 16;

export default function SearchPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const { properties, loadingProperties } = useSaved();

  // Redirect view=localities to /localities
  useEffect(() => {
    if (searchParams.get('view') === 'localities') {
      navigate('/localities', { replace: true });
    }
  }, [searchParams, navigate]);

  const [showMap, setShowMap] = useState(false);
  const [showFilterSidebar, setShowFilterSidebar] = useState(false);
  const [sort, setSort] = useState(searchParams.get('sort') || 'recommended');
  const [selectedMapId, setSelectedMapId] = useState(null);
  const [localSearch, setLocalSearch] = useState(searchParams.get('q') || '');
  const [radiusFilterInfo, setRadiusFilterInfo] = useState(null);
  const [onlyShowInCircle, setOnlyShowInCircle] = useState(false);
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  // Derive filters from URL
  const filters = useMemo(() => ({
    q: searchParams.get('q') || '',
    city: searchParams.get('city') || '',
    purpose: searchParams.get('purpose') || '',
    propertyType: searchParams.get('type') || '',
    bhk: searchParams.get('bhk') || '',
    budget: searchParams.get('budget') || '',
    status: searchParams.get('status') || '',
    verifiedOnly: searchParams.get('verified') === 'true',
    furnishing: searchParams.get('furnishing') || '',
    postedBy: searchParams.get('postedBy') || '',
    possessionStatus: searchParams.get('possessionStatus') || searchParams.get('status') || '',
    amenities: searchParams.get('amenities') ? searchParams.get('amenities').split(',') : [],
    lat: searchParams.get('lat') ? parseFloat(searchParams.get('lat')) : null,
    lng: searchParams.get('lng') ? parseFloat(searchParams.get('lng')) : null,
  }), [searchParams]);

  // Reset pagination on filter change
  useEffect(() => {
    setVisibleCount(PAGE_SIZE);
  }, [filters, sort]);

  const handleFilterChange = (key, value) => {
    const newParams = new URLSearchParams(searchParams);
    if (!value || value === '' || value === false) {
      newParams.delete(key);
    } else if (key === 'verifiedOnly') {
      if (value) newParams.set('verified', 'true');
      else newParams.delete('verified');
    } else if (key === 'amenities') {
      if (value.length === 0) newParams.delete('amenities');
      else newParams.set('amenities', value.join(','));
    } else {
      if (key === 'propertyType') newParams.set('type', value);
      else if (key === 'possessionStatus') newParams.set('status', value);
      else newParams.set(key, value);
    }
    setSearchParams(newParams);
  };

  const handleResetFilters = () => {
    setSearchParams(new URLSearchParams());
    setLocalSearch('');
    setSort('recommended');
  };

  const handleSearch = (e) => {
    e?.preventDefault();
    handleFilterChange('q', localSearch);
  };

  // Determine reference location center for distance calculation
  const referenceCoords = useMemo(() => {
    if (filters.lat && filters.lng) {
      return { lat: filters.lat, lng: filters.lng };
    }
    if (filters.q) {
      const qClean = filters.q.toLowerCase().replace(/^(properties|flats|apartments|villas|homes)\s+(near|in|at)\s+/i, '').replace(/^(near|in|at)\s+/i, '').trim();
      if (KNOWN_COORDINATES[qClean]) {
        return KNOWN_COORDINATES[qClean];
      }
      for (const [key, coords] of Object.entries(KNOWN_COORDINATES)) {
        if (qClean.includes(key) || key.includes(qClean)) {
          return coords;
        }
      }
    }
    if (filters.city) {
      const c = filters.city.toLowerCase();
      if (KNOWN_COORDINATES[c]) return KNOWN_COORDINATES[c];
    }
    return null;
  }, [filters.lat, filters.lng, filters.q, filters.city]);

  // Filter properties and calculate distance
  const filteredProps = useMemo(() => {
    let result = [...properties];

    // Natural location query extraction
    let cleanQ = (filters.q || '').trim();
    let isNearQuery = false;
    let targetNear = '';

    if (cleanQ) {
      const nearMatch = cleanQ.match(/^(?:properties\s+)?near\s+(.+)$/i) || cleanQ.match(/^in\s+(.+)$/i);
      if (nearMatch) {
        isNearQuery = true;
        targetNear = nearMatch[1].trim().toLowerCase();
      }
    }

    if (cleanQ) {
      if (isNearQuery && targetNear) {
        // Match either direct name or properties within ~28km
        const center = KNOWN_COORDINATES[targetNear];
        result = result.filter((p) => {
          const nameMatch =
            p.locality?.toLowerCase().includes(targetNear) ||
            p.city?.toLowerCase().includes(targetNear) ||
            p.state?.toLowerCase().includes(targetNear);
          if (nameMatch) return true;
          const pLat = p.latitude ?? p.mapCoords?.lat;
          const pLng = p.longitude ?? p.mapCoords?.lng;
          if (center && pLat && pLng) {
            const dist = calculateDistanceKm(center.lat, center.lng, pLat, pLng);
            return dist != null && dist <= 28;
          }
          return false;
        });
      } else {
        const q = cleanQ.toLowerCase();
        result = result.filter((p) =>
          p.locality?.toLowerCase().includes(q) ||
          p.city?.toLowerCase().includes(q) ||
          p.title?.toLowerCase().includes(q) ||
          p.state?.toLowerCase().includes(q) ||
          p.propertyType?.toLowerCase().includes(q) ||
          (p.pincode && p.pincode.includes(q)) ||
          (p.fullAddress && p.fullAddress.toLowerCase().includes(q))
        );
      }
    }

    if (filters.city) {
      result = result.filter((p) => p.city?.toLowerCase() === filters.city.toLowerCase());
    }
    if (filters.purpose) {
      result = result.filter((p) => p.purpose === filters.purpose || p.listingType === filters.purpose);
    }
    if (filters.propertyType) {
      result = result.filter((p) => p.propertyType === filters.propertyType || p.type === filters.propertyType);
    }
    if (filters.bhk) {
      const n = parseInt(filters.bhk, 10);
      result = result.filter((p) => filters.bhk === '4' ? p.bhk >= 4 : p.bhk === n);
    }
    if (filters.budget) {
      const [min, max] = filters.budget.split('-').map(Number);
      result = result.filter((p) => p.price >= min && p.price <= max);
    }
    if (filters.possessionStatus) {
      result = result.filter((p) => p.possessionStatus === filters.possessionStatus || p.status === filters.possessionStatus);
    }
    if (filters.verifiedOnly) {
      result = result.filter((p) => p.verified);
    }
    if (filters.furnishing) {
      result = result.filter((p) => p.furnishing === filters.furnishing);
    }
    if (filters.postedBy) {
      result = result.filter((p) => p.postedBy === filters.postedBy);
    }
    if (filters.amenities && filters.amenities.length > 0) {
      result = result.filter((p) =>
        filters.amenities.every((am) => p.amenities?.includes(am))
      );
    }

    // Attach distance calculation if reference location is available
    if (referenceCoords) {
      result = result.map((p) => {
        const pLat = p.latitude ?? p.mapCoords?.lat;
        const pLng = p.longitude ?? p.mapCoords?.lng;
        if (pLat && pLng) {
          const dist = calculateDistanceKm(referenceCoords.lat, referenceCoords.lng, pLat, pLng);
          return {
            ...p,
            distanceKm: dist,
            distanceText: formatDistance(dist) ? `${formatDistance(dist)} away` : null
          };
        }
        return p;
      });
    }

    if (radiusFilterInfo && onlyShowInCircle && radiusFilterInfo.matchingIds) {
      result = result.filter((p) => radiusFilterInfo.matchingIds.includes(p.id));
    }

    // Sort
    switch (sort) {
      case 'distance':
        result.sort((a, b) => (a.distanceKm ?? 9999) - (b.distanceKm ?? 9999));
        break;
      case 'price_low':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'price_high':
        result.sort((a, b) => b.price - a.price);
        break;
      case 'area_low':
        result.sort((a, b) => (a.area || 0) - (b.area || 0));
        break;
      case 'area_high':
        result.sort((a, b) => (b.area || 0) - (a.area || 0));
        break;
      case 'newest':
        result.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
        break;
      default:
        // Featured first
        result.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
        break;
    }

    return result;
  }, [properties, filters, sort, referenceCoords, radiusFilterInfo, onlyShowInCircle]);

  // Active filters count for filter toggle badge
  const activeFiltersCount = useMemo(() => {
    let count = 0;
    if (filters.city) count++;
    if (filters.purpose) count++;
    if (filters.propertyType) count++;
    if (filters.bhk) count++;
    if (filters.budget) count++;
    if (filters.verifiedOnly) count++;
    if (filters.furnishing) count++;
    if (filters.postedBy) count++;
    if (filters.possessionStatus) count++;
    if (filters.amenities && filters.amenities.length > 0) count += filters.amenities.length;
    return count;
  }, [filters]);

  // Paginated visible properties for smooth DOM rendering
  const visibleProps = useMemo(() => {
    return filteredProps.slice(0, visibleCount);
  }, [filteredProps, visibleCount]);

  const hasMore = visibleCount < filteredProps.length;

  const locationLabel = filters.q || filters.city || filters.purpose
    ? `${filters.q || filters.city || 'All'} — ${filters.purpose === 'sale' ? 'For Sale' : filters.purpose === 'rent' ? 'For Rent' : filters.purpose === 'lease' ? 'For Lease' : 'All Properties'}`
    : 'All properties across 15 cities in India';

  return (
    <>
      {/* ── STICKY SEARCH / CONTROL BAR (64–72px, sticky below header) ── */}
      <div className="search-page-control-bar">
        <div className="search-container-wide">
          <form onSubmit={handleSearch} className="search-control-bar-inner">
            {/* Search Input Field */}
            <div className="search-bar-input-group">
              <div className="search-bar-field">
                <MapPin size={16} color="var(--wood-walnut-deep)" style={{ flexShrink: 0 }} />
                <input
                  type="text"
                  placeholder="Search city, locality, pincode or property..."
                  value={localSearch}
                  onChange={(e) => setLocalSearch(e.target.value)}
                  id="search-page-input"
                  aria-label="Search properties"
                />
              </div>

              <button type="submit" className="search-bar-btn" id="search-page-search-btn">
                <Search size={15} />
                <span>Search</span>
              </button>
            </div>

            {/* Right Controls: Sort, Filters, Map View */}
            <div className="search-bar-controls-right">
              {/* Sort Dropdown */}
              <div className="search-sort-select-wrapper">
                <select
                  value={sort}
                  onChange={(e) => setSort(e.target.value)}
                  className="search-sort-select"
                  aria-label="Sort properties"
                >
                  {SORT_OPTIONS.map((o) => (
                    <option key={o.value} value={o.value}>{o.label}</option>
                  ))}
                </select>
                <ChevronDown size={14} className="search-sort-chevron" />
              </div>

              {/* Filters Toggle Button (Desktop & Mobile) */}
              <button
                type="button"
                onClick={() => setShowFilterSidebar((prev) => !prev)}
                className="btn-filter-trigger"
                id="search-filter-toggle-btn"
                aria-label="Open property filters"
              >
                <SlidersHorizontal size={14} />
                <span>Filters</span>
                {activeFiltersCount > 0 && (
                  <span className="btn-filter-badge">{activeFiltersCount}</span>
                )}
              </button>

              {/* Map View Toggle */}
              <button
                type="button"
                onClick={() => setShowMap((prev) => !prev)}
                className={`btn-map-toggle ${showMap ? 'is-active' : ''}`}
                id="search-map-toggle-btn"
                aria-label={showMap ? 'Switch to list view' : 'Switch to map view'}
              >
                {showMap ? <List size={14} /> : <Map size={14} />}
                <span>{showMap ? 'List View' : 'Map View'}</span>
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* ── MAIN MARKETPLACE CONTENT (Centered 1400px–1500px container) ── */}
      <div className="search-container-wide">
        {/* Results Heading */}
        <div className="search-results-heading-area">
          <div>
            <h1 className="search-results-title">
              {loadingProperties ? 'Loading live listings…' : `${filteredProps.length} ${filteredProps.length === 1 ? 'Property' : 'Properties'} Available`}
            </h1>
            <p className="search-results-subtitle">
              {locationLabel}
            </p>
          </div>

          {referenceCoords && (
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'rgba(138, 99, 70, 0.1)', border: '1px solid rgba(138, 99, 70, 0.25)', padding: '5px 12px', borderRadius: '20px', fontSize: '0.78rem', fontWeight: 600, color: 'var(--wood-walnut-deep)' }}>
              <Navigation size={12} />
              <span>Sorted with live distance from selected area</span>
            </div>
          )}
        </div>

        {/* Filter Chips */}
        <FilterChips filters={filters} onFilterChange={handleFilterChange} onReset={handleResetFilters} />

        {/* Movable Circle Live Results Indicator */}
        {radiusFilterInfo && (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '12px',
              padding: '10px 16px',
              background: '#F7F3ED',
              border: '1px solid var(--lokha-border)',
              borderRadius: '12px',
              marginBottom: '14px',
              flexWrap: 'wrap'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '1.1rem' }}>📍</span>
              <span style={{ fontSize: '0.86rem', fontWeight: 700, color: 'var(--wood-walnut-deep)' }}>
                Radius Filter Active: {radiusFilterInfo.count} {radiusFilterInfo.count === 1 ? 'property' : 'properties'} within {radiusFilterInfo.radiusKm} km of {radiusFilterInfo.localityName}
              </span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <button
                type="button"
                onClick={() => setOnlyShowInCircle((v) => !v)}
                style={{
                  fontSize: '0.78rem',
                  padding: '4px 10px',
                  borderRadius: '6px',
                  background: onlyShowInCircle ? 'var(--wood-walnut-deep)' : '#ffffff',
                  color: onlyShowInCircle ? '#ffffff' : 'var(--wood-walnut-deep)',
                  border: '1px solid var(--wood-walnut-deep)',
                  fontWeight: 700,
                  cursor: 'pointer'
                }}
              >
                {onlyShowInCircle ? 'Showing in circle only' : 'Filter grid by circle'}
              </button>
              <button
                type="button"
                onClick={() => {
                  setRadiusFilterInfo(null);
                  setOnlyShowInCircle(false);
                }}
                style={{
                  fontSize: '0.78rem',
                  padding: '4px 10px',
                  borderRadius: '6px',
                  background: '#F1F5F9',
                  color: '#64748B',
                  border: '1px solid #CBD5E1',
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
              >
                Clear
              </button>
            </div>
          </div>
        )}

        {/* ── MARKETPLACE LAYOUT: Sidebar (260px) + 3 Cards per row ── */}
        <div className={`search-marketplace-layout ${showMap ? 'with-map' : ''}`}>
          {/* Desktop Filter Sidebar */}
          <div className="filter-sidebar-desktop-col">
            <FilterSidebar
              filters={filters}
              onFilterChange={handleFilterChange}
              onResetFilters={handleResetFilters}
              totalResults={filteredProps.length}
            />
          </div>

          {/* Property Cards Grid (3 cards per row on desktop) */}
          <div style={{ flex: 1, minWidth: 0 }}>
            {loadingProperties ? (
              <PropertyGridSkeleton count={9} />
            ) : filteredProps.length === 0 ? (
              <EmptyState
                icon={Building2}
                title="No properties found"
                description="Try changing your filters or search location."
                actionText="Clear Filters"
                actionLink="/search"
                onAction={handleResetFilters}
              />
            ) : (
              <>
                <div className="property-marketplace-grid">
                  {visibleProps.map((p, idx) => (
                    <PropertyCard
                      key={p.id}
                      property={p}
                      showCompare={true}
                      onSelectMarker={setSelectedMapId}
                      index={idx}
                    />
                  ))}
                </div>

                {/* Pagination / Load More button */}
                {hasMore && (
                  <div style={{ textAlign: 'center', marginTop: '36px', marginBottom: '24px' }}>
                    <p style={{ fontSize: '0.85rem', color: 'var(--lokha-muted)', marginBottom: '12px', fontWeight: 500 }}>
                      Showing {visibleProps.length} of {filteredProps.length} properties
                    </p>
                    <button
                      type="button"
                      onClick={() => setVisibleCount((prev) => prev + PAGE_SIZE)}
                      className="btn btn-outline"
                      style={{ padding: '10px 28px', borderRadius: '30px', fontWeight: 700, fontSize: '0.88rem' }}
                    >
                      Load More Properties ({filteredProps.length - visibleProps.length} remaining)
                    </button>
                  </div>
                )}
              </>
            )}
          </div>

          {/* Map Panel (Desktop Split View: 55-60% Properties / 40-45% Map) */}
          {showMap && (
            <MapPanel
              properties={filteredProps}
              selectedId={selectedMapId}
              onSelectProperty={setSelectedMapId}
              onRadiusFilter={setRadiusFilterInfo}
              centerLocality={filters.q || filters.city || 'Selected Region'}
              onSearchArea={async ({ lat, lng }) => {
                try {
                  const { locality, city } = await reverseGeocode(lat, lng);
                  const searchVal = locality && locality !== 'Current Location' ? locality : city;
                  handleFilterChange('q', searchVal);
                  setLocalSearch(searchVal);
                } catch {
                  // Fallback
                }
              }}
            />
          )}
        </div>
      </div>

      {/* Mobile/Tablet Filter Drawer Modal */}
      {showFilterSidebar && (
        <div className="filter-drawer-overlay" onClick={() => setShowFilterSidebar(false)}>
          <div className="filter-drawer-panel" onClick={(e) => e.stopPropagation()}>
            <div className="filter-drawer-scroll-body">
              <FilterSidebar
                filters={filters}
                onFilterChange={handleFilterChange}
                onResetFilters={handleResetFilters}
                totalResults={filteredProps.length}
                isDrawer={true}
                onCloseDrawer={() => setShowFilterSidebar(false)}
              />
            </div>
            <div className="filter-drawer-footer">
              <button
                type="button"
                onClick={handleResetFilters}
                className="btn btn-outline btn-sm"
                style={{ flex: 1, padding: '8px 12px' }}
              >
                Reset
              </button>
              <button
                type="button"
                onClick={() => setShowFilterSidebar(false)}
                className="search-bar-btn"
                style={{ flex: 2, justifyContent: 'center' }}
              >
                Apply ({filteredProps.length})
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Comparison Floating Bar */}
      <ComparisonBar />

      {/* Responsive Filter Sidebar Display rules */}
      <style>{`
        @media (max-width: 1023px) {
          .filter-sidebar-desktop-col { display: none !important; }
        }
        @media (min-width: 1024px) {
          .filter-sidebar-desktop-col { display: block !important; }
        }
      `}</style>
    </>
  );
}
