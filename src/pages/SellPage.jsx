import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  CheckCircle2, ChevronRight, ChevronLeft, Upload,
  Home, Building2, MapPin, IndianRupee, User, Phone,
  Shield, X, Plus, Zap, FileText, Users, Calendar, AlertCircle, Sparkles
} from 'lucide-react';
import { useSaved } from '../context/SavedContext';
import { useAuth } from '../context/AuthContext';
import { InstagramVerifiedIcon, VerifiedBadge } from '../components/common/VerifiedBadge';

const STEPS = [
  { id: 1, label: 'Property Details', icon: Home },
  { id: 2, label: 'Location', icon: MapPin },
  { id: 3, label: 'Photos', icon: Upload },
  { id: 4, label: 'Verification & Badge', icon: Shield },
  { id: 5, label: 'Contact', icon: Phone },
  { id: 6, label: 'Review & Publish', icon: CheckCircle2 },
];

import { searchLocations } from '../services/locationService';

const PROPERTY_TYPES = [
  'Apartment', 'Villa', 'Independent House', 'Plot / Land',
  'Commercial Property', 'Office', 'Shop', 'PG', 'Hostel', 'Hotel'
];
const FURNISHING_OPTS = ['Fully-Furnished', 'Semi-Furnished', 'Unfurnished'];
const AMENITIES_OPTS = ['Swimming Pool', 'Gym', 'Security', 'Power Backup', 'Clubhouse', "Children's Play Area", 'Lift', 'Parking', 'Garden', 'EV Charging'];
const FAMILY_RELATIONS = ['Father', 'Mother', 'Spouse', 'Brother', 'Sister', 'Son', 'Daughter', 'Legal Guardian'];
const FAMILY_PROOFS = ['Family Card / Ration Card', 'Birth Certificate', 'Marriage Certificate', 'Government Relationship ID / Legal Heir'];
const EB_BOARDS = [
  'TANGEDCO (Tamil Nadu)',
  'BESCOM (Karnataka)',
  'MSEDCL (Maharashtra)',
  'Tata Power (Delhi / Mumbai)',
  'BSES Rajdhani / Yamuna (Delhi)',
  'TSSPDCL (Telangana)',
  'WBSEDCL (West Bengal)',
  'Other State Electricity Board'
];

function FormField({ label, children, error, required, hint }) {
  return (
    <div className="form-field">
      <label className="form-label">
        {label} {required && <span style={{ color: 'var(--color-error, #dc2626)' }}>*</span>}
      </label>
      {hint && <p style={{ fontSize: '0.78rem', color: 'var(--lokha-muted, #7C6B5E)', margin: '-2px 0 6px' }}>{hint}</p>}
      {children}
      {error && (
        <span className="form-field-error">
          <X size={12} /> {error}
        </span>
      )}
    </div>
  );
}

export default function SellPage() {
  const navigate = useNavigate();
  const { addCustomProperty } = useSaved();
  const { user } = useAuth();

  const [step, setStep] = useState(1);
  const [errors, setErrors] = useState({});

  const [formData, setFormData] = useState({
    title: '',
    propertyType: 'Apartment',
    purpose: 'sale', // 'sale' | 'rent' | 'lease'
    bhk: '3',
    bathrooms: '2',
    area: '',
    price: '',
    leaseDuration: '3 Years',
    furnishing: 'Unfurnished',
    possessionStatus: 'Ready to Move',
    status: 'Available',
    description: '',
    selectedAmenities: [],
    // Location
    country: 'India',
    address: '',
    locality: '',
    city: '',
    state: '',
    pincode: '',
    latitude: '',
    longitude: '',
    // Photos
    photos: [],
    customImageUrl: '',
    // Verification
    verificationMethod: 'online', // 'online' | 'offline'
    ownershipType: 'self', // 'self' | 'family'
    familyRelation: 'Father',
    familyMemberName: '',
    familyProofType: 'Family Card / Ration Card',
    familyProofFileName: 'Family_Ration_Card_Verified.pdf',
    // Mandatory EB Bill
    ebConsumerNumber: '04-281-992-10',
    ebBoardName: 'TANGEDCO (Tamil Nadu)',
    ebName: user?.name || 'Vishwa',
    ebBillFileName: 'Electricity_EB_Bill_Latest.pdf',
    propertyTaxFileName: 'Property_Tax_Receipt.pdf',
    // Offline verification
    offlineDate: '',
    offlineSlot: 'Morning (9:00 AM - 12:00 PM)',
    offlineContactPerson: user?.name || '',
    // Contact
    ownerType: 'owner',
    ownerName: user?.name || '',
    ownerPhone: user?.mobile || '',
    ownerEmail: user?.email || '',
  });

  const update = (key, value) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => ({ ...prev, [key]: undefined }));
  };

  const toggleAmenity = (am) => {
    update(
      'selectedAmenities',
      formData.selectedAmenities.includes(am)
        ? formData.selectedAmenities.filter((a) => a !== am)
        : [...formData.selectedAmenities, am]
    );
  };

  const validate = () => {
    const e = {};
    if (step === 1) {
      if (!formData.area) e.area = 'Area is required';
      if (!formData.price) e.price = formData.purpose === 'rent' ? 'Rent is required' : formData.purpose === 'lease' ? 'Lease amount is required' : 'Price is required';
    }
    if (step === 2) {
      if (!formData.locality) e.locality = 'Locality is required';
      if (!formData.city) e.city = 'City is required';
      if (!formData.state) e.state = 'State is required';
    }
    if (step === 4) {
      if (formData.verificationMethod === 'online') {
        if (!formData.ebConsumerNumber) e.ebConsumerNumber = 'Mandatory EB consumer number required';
        if (formData.ownershipType === 'family') {
          if (!formData.familyMemberName) e.familyMemberName = 'Family member name is required';
        }
      } else {
        if (!formData.offlineDate) e.offlineDate = 'Please select a preferred inspection date';
      }
    }
    if (step === 5) {
      if (!formData.ownerName) e.ownerName = 'Name is required';
      if (!formData.ownerPhone) e.ownerPhone = 'Phone is required';
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleNext = () => {
    if (validate()) setStep((s) => Math.min(s + 1, 6));
  };

  const handleBack = () => setStep((s) => Math.max(s - 1, 1));

  const handlePhotoUpload = (e) => {
    const files = Array.from(e.target.files || []);
    const previews = files.map((file) => ({
      name: file.name,
      url: URL.createObjectURL(file)
    }));
    update('photos', [...formData.photos, ...previews]);
  };

  const handleAddImageUrl = () => {
    if (!formData.customImageUrl || !formData.customImageUrl.trim()) return;
    const url = formData.customImageUrl.trim();
    update('photos', [...formData.photos, { name: 'Image ' + (formData.photos.length + 1), url }]);
    update('customImageUrl', '');
  };

  const handleAutoCoordinates = async () => {
    const query = `${formData.locality || ''} ${formData.city || ''}`.trim();
    if (!query) {
      alert('Please fill in city and locality first.');
      return;
    }
    try {
      const results = await searchLocations(query);
      if (results && results.length > 0) {
        update('latitude', String(results[0].lat));
        update('longitude', String(results[0].lng));
      } else {
        alert('Could not find coordinates for this area. You can enter them manually.');
      }
    } catch {
      alert('Error fetching coordinates.');
    }
  };

  const handlePublish = () => {
    if (!validate()) return;
    const newId = `lokha-user-${Date.now()}`;
    const lat = parseFloat(formData.latitude) || 12.9716;
    const lng = parseFloat(formData.longitude) || 77.5946;

    const propertyImages = formData.photos.length > 0
      ? formData.photos.map((p) => p.url)
      : ['https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80'];

    const title = formData.title?.trim() || `${formData.bhk ? formData.bhk + ' BHK ' : ''}${formData.propertyType} in ${formData.locality}`;

    addCustomProperty({
      id: newId,
      title,
      type: formData.propertyType,
      propertyType: formData.propertyType,
      listingType: formData.purpose,
      purpose: formData.purpose,
      leaseDuration: formData.purpose === 'lease' ? formData.leaseDuration : null,
      price: parseFloat(formData.price) || 0,
      maintenance: Math.round((parseFloat(formData.area) || 1000) * 2),
      bedrooms: parseInt(formData.bhk, 10) || 0,
      bhk: parseInt(formData.bhk, 10) || 0,
      bathrooms: parseInt(formData.bathrooms, 10) || 2,
      parking: 1,
      area: parseFloat(formData.area) || 0,
      possessionStatus: formData.possessionStatus,
      status: formData.status || 'Available',
      postedBy: formData.ownerType === 'owner' ? 'Owner' : 'Agent',
      postedTime: 'Just now',
      verified: true,
      verificationMethod: formData.verificationMethod,
      verificationDetails: {
        ownershipType: formData.ownershipType,
        familyRelation: formData.ownershipType === 'family' ? formData.familyRelation : null,
        familyMemberName: formData.ownershipType === 'family' ? formData.familyMemberName : null,
        ebConsumerNumber: formData.ebConsumerNumber,
        ebBoardName: formData.ebBoardName,
        offlineDate: formData.verificationMethod === 'offline' ? formData.offlineDate : null
      },
      featured: false,
      furnishing: formData.furnishing,
      latitude: lat,
      longitude: lng,
      mapCoords: {
        lat,
        lng,
        x: 50,
        y: 50
      },
      location: {
        country: formData.country || 'India',
        state: formData.state,
        city: formData.city,
        locality: formData.locality,
        fullAddress: formData.address || `${formData.locality}, ${formData.city}`,
        pincode: formData.pincode,
        latitude: lat,
        longitude: lng
      },
      country: formData.country || 'India',
      state: formData.state,
      city: formData.city,
      locality: formData.locality,
      fullAddress: formData.address || `${formData.locality}, ${formData.city}`,
      pincode: formData.pincode,
      images: propertyImages,
      overview: formData.description || `${title} for ${formData.purpose.toUpperCase()} in ${formData.locality}, ${formData.city}. Verified under LOKHA trust seal.`,
      amenities: formData.selectedAmenities,
      nearby: [],
      priceTrend: [],
      owner: {
        name: formData.ownerName || 'Verified Owner',
        type: formData.ownerType === 'owner' ? 'Verified Owner' : 'Agent',
        photo: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80',
        phone: formData.ownerPhone,
        responseTime: 'Responds within 30 minutes'
      },
      agent: {
        name: formData.ownerName || 'Verified Owner',
        type: formData.ownerType === 'owner' ? 'Verified Owner' : 'Agent',
        photo: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80',
        phone: formData.ownerPhone,
        responseTime: 'Responds within 30 minutes'
      },
      isSeed: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });
    navigate('/dashboard');
  };

  return (
    <div className="sell-page-wrapper">
      <div className="container sell-container">
        {/* Header */}
        <div style={{ marginBottom: '32px', textAlign: 'center' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'rgba(0, 149, 246, 0.1)', border: '1px solid rgba(0, 149, 246, 0.25)', padding: '5px 14px', borderRadius: '20px', color: '#0077D7', fontSize: '0.82rem', fontWeight: 700, marginBottom: '12px' }}>
            <InstagramVerifiedIcon size={16} />
            <span>Official LOKHA Trust & Verification System</span>
          </div>
          <h1 style={{ fontSize: '2.2rem', marginBottom: '8px', fontFamily: 'var(--font-serif)' }}>List Your Property</h1>
          <p style={{ color: 'var(--color-text-secondary)', maxWidth: '580px', margin: '0 auto' }}>
            List your property for Sale, Rent, or Lease. Complete mandatory EB bill verification to earn the verified trust badge.
          </p>
        </div>

        {/* Stepper */}
        <div className="form-stepper">
          {STEPS.map((s) => (
            <div key={s.id} className={`stepper-step ${step === s.id ? 'active' : ''} ${step > s.id ? 'completed' : ''}`}>
              <div className="step-circle">
                {step > s.id ? <CheckCircle2 size={18} /> : <s.icon size={17} />}
              </div>
              <span className="step-label">{s.label}</span>
            </div>
          ))}
        </div>

        {/* Form Card */}
        <div className="form-card">
          {/* ── STEP 1: Property Details (Sale, Rent, Lease) ──────────────────── */}
          {step === 1 && (
            <>
              <h2 className="form-step-title">Property Details</h2>
              <p className="form-step-subtitle">Select whether you are selling, renting, or leasing</p>

              {/* Purpose Toggle: Sale, Rent, Lease */}
              <FormField label="Listing Purpose" required>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
                  <button
                    type="button"
                    className={`radio-card ${formData.purpose === 'sale' ? 'active' : ''}`}
                    onClick={() => update('purpose', 'sale')}
                    style={{ textAlign: 'center', padding: '16px 12px' }}
                  >
                    <span style={{ fontSize: '1.25rem', display: 'block', marginBottom: '4px' }}>🏷️</span>
                    <strong style={{ display: 'block', fontSize: '0.95rem' }}>For Sale</strong>
                    <span style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)' }}>Full property ownership transfer</span>
                  </button>

                  <button
                    type="button"
                    className={`radio-card ${formData.purpose === 'rent' ? 'active' : ''}`}
                    onClick={() => update('purpose', 'rent')}
                    style={{ textAlign: 'center', padding: '16px 12px' }}
                  >
                    <span style={{ fontSize: '1.25rem', display: 'block', marginBottom: '4px' }}>🏠</span>
                    <strong style={{ display: 'block', fontSize: '0.95rem' }}>For Rent</strong>
                    <span style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)' }}>Monthly rental agreement</span>
                  </button>

                  <button
                    type="button"
                    className={`radio-card ${formData.purpose === 'lease' ? 'active' : ''}`}
                    onClick={() => update('purpose', 'lease')}
                    style={{ textAlign: 'center', padding: '16px 12px' }}
                  >
                    <span style={{ fontSize: '1.25rem', display: 'block', marginBottom: '4px' }}>📜</span>
                    <strong style={{ display: 'block', fontSize: '0.95rem' }}>For Lease</strong>
                    <span style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)' }}>Long-term fixed tenure lease</span>
                  </button>
                </div>
              </FormField>

              {/* Property Type */}
              <FormField label="Property Type">
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  {PROPERTY_TYPES.map((t) => (
                    <button key={t} type="button" className={`filter-pill ${formData.propertyType === t ? 'active' : ''}`} onClick={() => update('propertyType', t)}>
                      {t}
                    </button>
                  ))}
                </div>
              </FormField>

              <div className="form-grid-2">
                {/* BHK */}
                <FormField label="Bedrooms (BHK)">
                  <div style={{ display: 'flex', gap: '8px' }}>
                    {['1', '2', '3', '4', '5+'].map((b) => (
                      <button key={b} type="button" className={`filter-pill ${formData.bhk === b ? 'active' : ''}`} onClick={() => update('bhk', b)} style={{ flex: 1 }}>
                        {b}
                      </button>
                    ))}
                  </div>
                </FormField>

                {/* Area */}
                <FormField label="Super Built-up Area (sq ft)" error={errors.area} required>
                  <input type="number" className="form-input" placeholder="e.g. 1650" value={formData.area} onChange={(e) => update('area', e.target.value)} />
                </FormField>
              </div>

              <div className="form-grid-2">
                {/* Price / Rent / Lease Amount */}
                <FormField
                  label={
                    formData.purpose === 'rent'
                      ? 'Expected Rent (₹ / month)'
                      : formData.purpose === 'lease'
                      ? 'Total Lease Amount (₹)'
                      : 'Expected Selling Price (₹)'
                  }
                  error={errors.price}
                  required
                >
                  <input
                    type="number"
                    className="form-input"
                    placeholder={
                      formData.purpose === 'rent'
                        ? 'e.g. 35000'
                        : formData.purpose === 'lease'
                        ? 'e.g. 2500000'
                        : 'e.g. 8500000'
                    }
                    value={formData.price}
                    onChange={(e) => update('price', e.target.value)}
                  />
                </FormField>

                {/* If Lease: Tenure / Duration */}
                {formData.purpose === 'lease' ? (
                  <FormField label="Lease Tenure Duration">
                    <select className="form-select" value={formData.leaseDuration} onChange={(e) => update('leaseDuration', e.target.value)}>
                      {['1 Year', '2 Years', '3 Years', '5 Years', '9 Years (Commercial)'].map((d) => (
                        <option key={d} value={d}>{d}</option>
                      ))}
                    </select>
                  </FormField>
                ) : (
                  /* Furnishing */
                  <FormField label="Furnishing Status">
                    <select className="form-select" value={formData.furnishing} onChange={(e) => update('furnishing', e.target.value)}>
                      {FURNISHING_OPTS.map((f) => <option key={f}>{f}</option>)}
                    </select>
                  </FormField>
                )}
              </div>

              {/* Possession Status */}
              <FormField label="Possession Status">
                <div className="radio-cards-row">
                  {['Ready to Move', 'Under Construction'].map((s) => (
                    <button key={s} type="button" className={`radio-card ${formData.possessionStatus === s ? 'active' : ''}`} onClick={() => update('possessionStatus', s)}>
                      {s}
                    </button>
                  ))}
                </div>
              </FormField>

              {/* Description */}
              <FormField label="Property Description">
                <textarea className="form-textarea" rows={3} placeholder="Describe the property — highlights, ventilation, nearby metro, special interior woodwork…" value={formData.description} onChange={(e) => update('description', e.target.value)} />
              </FormField>

              {/* Amenities */}
              <FormField label="Amenities Available">
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  {AMENITIES_OPTS.map((am) => (
                    <button key={am} type="button" className={`filter-pill ${formData.selectedAmenities.includes(am) ? 'active' : ''}`} onClick={() => toggleAmenity(am)}>
                      {am}
                    </button>
                  ))}
                </div>
              </FormField>
            </>
          )}

          {/* ── STEP 2: Location ──────────────────────── */}
          {step === 2 && (
            <>
              <h2 className="form-step-title">Property Location</h2>
              <p className="form-step-subtitle">Specify precise address for verification and buyers</p>

              <FormField label="Full Address" required>
                <textarea className="form-textarea" rows={2} placeholder="House / Flat No., Door No., Building Name, Street / Cross" value={formData.address} onChange={(e) => update('address', e.target.value)} />
              </FormField>

              <div className="form-grid-2">
                <FormField label="Locality / Neighbourhood" error={errors.locality} required>
                  <input type="text" className="form-input" placeholder="e.g. Indiranagar" value={formData.locality} onChange={(e) => update('locality', e.target.value)} />
                </FormField>
                <FormField label="City" error={errors.city} required>
                  <input type="text" className="form-input" placeholder="e.g. Bengaluru" value={formData.city} onChange={(e) => update('city', e.target.value)} />
                </FormField>
              </div>
              <div className="form-grid-2">
                <FormField label="State" error={errors.state} required>
                  <input type="text" className="form-input" placeholder="e.g. Karnataka" value={formData.state} onChange={(e) => update('state', e.target.value)} />
                </FormField>
                <FormField label="PIN Code">
                  <input type="text" className="form-input" placeholder="e.g. 560038" value={formData.pincode} onChange={(e) => update('pincode', e.target.value)} maxLength={6} />
                </FormField>
              </div>

              {/* Geographic Coordinates for Map Integration */}
              <div style={{ marginTop: '16px', padding: '16px', background: '#F8FAFC', borderRadius: '12px', border: '1px solid #E2E8F0' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px', flexWrap: 'wrap', gap: '8px' }}>
                  <div style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--color-primary-navy)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <MapPin size={16} color="var(--color-cta-teal)" />
                    <span>Map Coordinates (Latitude & Longitude)</span>
                  </div>
                  <button
                    type="button"
                    onClick={handleAutoCoordinates}
                    className="btn btn-outline btn-sm"
                    style={{ fontSize: '0.78rem', display: 'flex', alignItems: 'center', gap: '5px' }}
                  >
                    <Sparkles size={13} color="#B8956A" /> Auto-Detect from Locality
                  </button>
                </div>
                <div className="form-grid-2">
                  <FormField label="Latitude">
                    <input
                      type="text"
                      className="form-input"
                      placeholder="e.g. 12.9716"
                      value={formData.latitude}
                      onChange={(e) => update('latitude', e.target.value)}
                    />
                  </FormField>
                  <FormField label="Longitude">
                    <input
                      type="text"
                      className="form-input"
                      placeholder="e.g. 77.5946"
                      value={formData.longitude}
                      onChange={(e) => update('longitude', e.target.value)}
                    />
                  </FormField>
                </div>
                <p style={{ fontSize: '0.76rem', color: '#64748B', margin: '4px 0 0' }}>
                  Coordinates are used to plot your listing on the interactive radar map and calculate nearby distances for buyers.
                </p>
              </div>
            </>
          )}

          {/* ── STEP 3: Photos ──────────────────────────── */}
          {step === 3 && (
            <>
              <h2 className="form-step-title">Add Property Photos</h2>
              <p className="form-step-subtitle">High-quality photos boost inquiries by 5× on LOKHA</p>

              {/* Paste Direct Image URL Option */}
              <div style={{ marginBottom: '18px', padding: '14px', background: '#F8FAFC', borderRadius: '12px', border: '1px solid #E2E8F0' }}>
                <label style={{ display: 'block', fontSize: '0.86rem', fontWeight: 600, color: 'var(--color-primary-navy)', marginBottom: '6px' }}>
                  Paste Photo URL (Unsplash or Hosted Web Image)
                </label>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <input
                    type="url"
                    className="form-input"
                    placeholder="https://images.unsplash.com/..."
                    value={formData.customImageUrl}
                    onChange={(e) => update('customImageUrl', e.target.value)}
                    style={{ flex: 1 }}
                  />
                  <button
                    type="button"
                    onClick={handleAddImageUrl}
                    className="btn btn-cta-teal"
                    style={{ padding: '0 16px', whiteSpace: 'nowrap' }}
                  >
                    <Plus size={16} /> Add Photo URL
                  </button>
                </div>
              </div>

              <label htmlFor="photo-upload" className="dropzone-container">
                <div className="dropzone-icon">
                  <Upload size={26} />
                </div>
                <h4 style={{ color: 'var(--color-primary-navy)', marginBottom: '6px' }}>
                  Or drag & drop property photos from your device
                </h4>
                <p style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)' }}>
                  Upload photos of exterior facade, living rooms, bedrooms, kitchen, and bathroom.
                </p>
                <span className="btn btn-cta-teal btn-sm" style={{ marginTop: '12px', pointerEvents: 'none' }}>
                  Browse Files
                </span>
                <input id="photo-upload" type="file" multiple accept="image/*" style={{ display: 'none' }} onChange={handlePhotoUpload} />
              </label>

              {formData.photos.length > 0 && (
                <div className="upload-thumbnails-grid">
                  {formData.photos.map((photo, idx) => (
                    <div key={idx} className="upload-thumbnail-card">
                      <img src={photo.url} alt={photo.name} />
                      <div className="thumb-actions">
                        <button
                          type="button"
                          className="thumb-btn"
                          onClick={() => update('photos', formData.photos.filter((_, i) => i !== idx))}
                          aria-label="Remove photo"
                        >
                          <X size={13} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}

          {/* ── STEP 4: Verification & Badge (Online or Offline) ────────── */}
          {step === 4 && (
            <>
              {/* Instagram-style Verified Badge Showcase */}
              <div
                style={{
                  background: 'linear-gradient(135deg, rgba(0, 149, 246, 0.08) 0%, rgba(0, 149, 246, 0.02) 100%)',
                  border: '1.5px solid rgba(0, 149, 246, 0.28)',
                  borderRadius: '16px',
                  padding: '24px',
                  marginBottom: '28px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '18px',
                  boxShadow: '0 4px 18px rgba(0, 149, 246, 0.08)'
                }}
              >
                <div style={{ flexShrink: 0 }}>
                  <InstagramVerifiedIcon size={42} />
                </div>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                    <h3 style={{ margin: 0, fontSize: '1.2rem', color: '#0077D7', fontFamily: 'var(--font-heading)' }}>
                      Earn the LOKHA Verified Trust Badge
                    </h3>
                    <span style={{ background: '#0095F6', color: '#FFFFFF', fontSize: '0.72rem', padding: '2px 8px', borderRadius: '12px', fontWeight: 700 }}>
                      Instagram-Style Badge
                    </span>
                  </div>
                  <p style={{ margin: 0, fontSize: '0.86rem', color: 'var(--color-text-secondary)', lineHeight: 1.5 }}>
                    Complete online document verification (or request physical agent inspection) to verify property ownership via <strong>mandatory EB Bill</strong> and unlock the official blue verified badge on your listing.
                  </p>
                </div>
              </div>

              <h2 className="form-step-title">Choose Verification Mode</h2>
              <p className="form-step-subtitle">Select Online instant verification or Offline agent visit</p>

              {/* Toggle Online vs Offline */}
              <FormField label="Verification Method" required>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '24px' }}>
                  <button
                    type="button"
                    className={`radio-card ${formData.verificationMethod === 'online' ? 'active' : ''}`}
                    onClick={() => update('verificationMethod', 'online')}
                    style={{ padding: '18px', display: 'flex', flexDirection: 'column', alignItems: 'flex-start', textAlign: 'left', border: formData.verificationMethod === 'online' ? '2px solid #0095F6' : undefined }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                      <Zap size={20} color="#0095F6" />
                      <strong style={{ fontSize: '1rem', color: 'var(--color-text-main)' }}>Online Verification</strong>
                      <span style={{ fontSize: '0.7rem', background: 'rgba(0,149,246,0.15)', color: '#0077D7', padding: '2px 6px', borderRadius: '4px', fontWeight: 700 }}>Instant</span>
                    </div>
                    <span style={{ fontSize: '0.82rem', color: 'var(--color-text-secondary)', lineHeight: 1.4 }}>
                      Verify ownership digitally via mandatory EB bill and family card or government proof. Verified badge awarded immediately.
                    </span>
                  </button>

                  <button
                    type="button"
                    className={`radio-card ${formData.verificationMethod === 'offline' ? 'active' : ''}`}
                    onClick={() => update('verificationMethod', 'offline')}
                    style={{ padding: '18px', display: 'flex', flexDirection: 'column', alignItems: 'flex-start', textAlign: 'left', border: formData.verificationMethod === 'offline' ? '2px solid #0095F6' : undefined }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                      <Building2 size={20} color="var(--lokha-wood)" />
                      <strong style={{ fontSize: '1rem', color: 'var(--color-text-main)' }}>Offline Verification</strong>
                      <span style={{ fontSize: '0.7rem', background: '#F7EEDB', color: 'var(--lokha-wood)', padding: '2px 6px', borderRadius: '4px', fontWeight: 700 }}>Agent Visit</span>
                    </div>
                    <span style={{ fontSize: '0.82rem', color: 'var(--color-text-secondary)', lineHeight: 1.4 }}>
                      Schedule a physical field inspection. An authorized LOKHA agent visits the property to inspect EB meter and original paper deeds.
                    </span>
                  </button>
                </div>
              </FormField>

              {/* ── SUB-FLOW A: ONLINE VERIFICATION ── */}
              {formData.verificationMethod === 'online' && (
                <div style={{ background: '#FBF9F6', borderRadius: '14px', border: '1px solid var(--lokha-border, #E8DFD5)', padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  <div>
                    <h3 style={{ fontSize: '1.05rem', margin: '0 0 6px', color: 'var(--lokha-primary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Users size={18} color="var(--lokha-wood)" />
                      1. Property Ownership Status
                    </h3>
                    <p style={{ fontSize: '0.84rem', color: 'var(--color-text-secondary)', margin: '0 0 12px' }}>
                      Is the property owned directly by you, or in the name of a family member?
                    </p>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                      <button
                        type="button"
                        className={`radio-card ${formData.ownershipType === 'self' ? 'active' : ''}`}
                        onClick={() => update('ownershipType', 'self')}
                        style={{ padding: '12px 16px', display: 'flex', alignItems: 'center', gap: '10px' }}
                      >
                        <User size={18} />
                        <div>
                          <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>Owned by Me (Self)</div>
                          <div style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)' }}>EB bill and title match my name</div>
                        </div>
                      </button>

                      <button
                        type="button"
                        className={`radio-card ${formData.ownershipType === 'family' ? 'active' : ''}`}
                        onClick={() => update('ownershipType', 'family')}
                        style={{ padding: '12px 16px', display: 'flex', alignItems: 'center', gap: '10px' }}
                      >
                        <Users size={18} />
                        <div>
                          <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>Owned by Family Member</div>
                          <div style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)' }}>Father, Mother, Spouse, Sibling</div>
                        </div>
                      </button>
                    </div>
                  </div>

                  {/* If Family Member Owned: Relationship Proof */}
                  {formData.ownershipType === 'family' && (
                    <div style={{ background: '#FFFFFF', padding: '18px', borderRadius: '10px', border: '1px solid #E2E8F0' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--lokha-wood)', fontWeight: 700, fontSize: '0.9rem', marginBottom: '12px' }}>
                        <FileText size={16} />
                        <span>Family Relationship Verification (Mandatory)</span>
                      </div>

                      <div className="form-grid-2">
                        <FormField label="Relationship with Owner" required>
                          <select className="form-select" value={formData.familyRelation} onChange={(e) => update('familyRelation', e.target.value)}>
                            {FAMILY_RELATIONS.map((r) => <option key={r} value={r}>{r}</option>)}
                          </select>
                        </FormField>

                        <FormField label="Family Member Full Name" error={errors.familyMemberName} required>
                          <input type="text" className="form-input" placeholder="e.g. Ramesh Kumar" value={formData.familyMemberName} onChange={(e) => update('familyMemberName', e.target.value)} />
                        </FormField>
                      </div>

                      <FormField label="Government Relationship Proof Document" hint="Upload Family Card (Ration Card), Birth Certificate, or Govt ID showing relation" required>
                        <div style={{ display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap' }}>
                          <select className="form-select" style={{ flex: 1 }} value={formData.familyProofType} onChange={(e) => update('familyProofType', e.target.value)}>
                            {FAMILY_PROOFS.map((p) => <option key={p} value={p}>{p}</option>)}
                          </select>
                          <label className="btn btn-outline btn-sm" style={{ cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                            <Upload size={14} /> Attach Family Card / Govt Proof
                            <input type="file" accept=".pdf,image/*" style={{ display: 'none' }} onChange={(e) => {
                              if (e.target.files?.[0]) update('familyProofFileName', e.target.files[0].name);
                            }} />
                          </label>
                        </div>
                        {formData.familyProofFileName && (
                          <div style={{ marginTop: '8px', fontSize: '0.8rem', color: '#0077D7', display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <CheckCircle2 size={14} color="#0095F6" />
                            <span>Document Attached: <strong>{formData.familyProofFileName}</strong> (Verified valid)</span>
                          </div>
                        )}
                      </FormField>
                    </div>
                  )}

                  {/* Mandatory EB (Electricity) Bill Verification */}
                  <div style={{ background: '#FFFFFF', padding: '18px', borderRadius: '10px', border: '1.5px solid #0095F6' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px', flexWrap: 'wrap' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: 'rgba(0, 149, 246, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <Zap size={16} color="#0095F6" />
                        </div>
                        <div>
                          <strong style={{ fontSize: '0.95rem', color: 'var(--color-text-main)' }}>2. Mandatory Electricity (EB) Bill Verification</strong>
                          <span style={{ marginLeft: '8px', background: '#DC2626', color: '#FFFFFF', fontSize: '0.68rem', padding: '2px 6px', borderRadius: '4px', fontWeight: 700 }}>Mandatory</span>
                        </div>
                      </div>
                      <span style={{ fontSize: '0.78rem', color: 'var(--color-text-secondary)' }}>Matches physical meter & address</span>
                    </div>

                    <p style={{ fontSize: '0.82rem', color: 'var(--color-text-secondary)', margin: '0 0 14px', lineHeight: 1.5 }}>
                      The Electricity Board (EB) bill must be in the name of the <strong>user</strong> or <strong>family member</strong>. This confirms physical residence and legal occupancy to activate the verified badge.
                    </p>

                    <div className="form-grid-2">
                      <FormField label="EB Consumer / Service Connection No." error={errors.ebConsumerNumber} required>
                        <input type="text" className="form-input" placeholder="e.g. 04-281-992-10" value={formData.ebConsumerNumber} onChange={(e) => update('ebConsumerNumber', e.target.value)} />
                      </FormField>

                      <FormField label="Electricity Board / Provider" required>
                        <select className="form-select" value={formData.ebBoardName} onChange={(e) => update('ebBoardName', e.target.value)}>
                          {EB_BOARDS.map((b) => <option key={b} value={b}>{b}</option>)}
                        </select>
                      </FormField>
                    </div>

                    <div className="form-grid-2">
                      <FormField label="Consumer Name on EB Bill" hint="Must match applicant name or declared family member" required>
                        <input type="text" className="form-input" placeholder="e.g. Vishwa / Ramesh Kumar" value={formData.ebName} onChange={(e) => update('ebName', e.target.value)} />
                      </FormField>

                      <FormField label="Upload Latest EB Bill (PDF / Photo)" required>
                        <label className="btn btn-outline" style={{ width: '100%', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', height: '42px' }}>
                          <Upload size={15} /> Upload EB Bill File
                          <input type="file" accept=".pdf,image/*" style={{ display: 'none' }} onChange={(e) => {
                            if (e.target.files?.[0]) update('ebBillFileName', e.target.files[0].name);
                          }} />
                        </label>
                      </FormField>
                    </div>

                    {formData.ebBillFileName && (
                      <div style={{ marginTop: '10px', padding: '10px 14px', background: 'rgba(0, 149, 246, 0.08)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.84rem', color: '#0077D7' }}>
                          <InstagramVerifiedIcon size={18} />
                          <span>EB Bill Document Verified: <strong>{formData.ebBillFileName}</strong></span>
                        </div>
                        <span style={{ fontSize: '0.75rem', color: '#16A34A', fontWeight: 700 }}>✓ Verified Match</span>
                      </div>
                    )}
                  </div>

                  {/* Supporting Document (Optional) */}
                  <div style={{ background: '#FFFFFF', padding: '16px', borderRadius: '10px', border: '1px solid #E2E8F0' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px' }}>
                      <div>
                        <strong style={{ fontSize: '0.9rem', color: 'var(--color-text-main)' }}>3. Property Tax / Title Deed (Optional Supporting)</strong>
                        <p style={{ margin: '2px 0 0', fontSize: '0.78rem', color: 'var(--color-text-secondary)' }}>
                          Latest property tax receipt, Khata, or Sale Deed for expedited VIP trust ranking.
                        </p>
                      </div>
                      <label className="btn btn-outline btn-sm" style={{ cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                        <Upload size={13} /> Attach Tax Slip
                        <input type="file" accept=".pdf,image/*" style={{ display: 'none' }} onChange={(e) => {
                          if (e.target.files?.[0]) update('propertyTaxFileName', e.target.files[0].name);
                        }} />
                      </label>
                    </div>
                  </div>

                  {/* Verified Badge Reward Box */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 18px', background: 'linear-gradient(90deg, #F0F9FF 0%, #FFFFFF 100%)', borderRadius: '10px', border: '1px solid #BAE6FD' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <InstagramVerifiedIcon size={24} />
                      <div>
                        <div style={{ fontSize: '0.9rem', fontWeight: 700, color: '#0284C7' }}>LOKHA Verified Trust Badge Ready</div>
                        <div style={{ fontSize: '0.78rem', color: 'var(--color-text-secondary)' }}>Will be prominently stamped on your listing card and details page</div>
                      </div>
                    </div>
                    <VerifiedBadge size="default" />
                  </div>
                </div>
              )}

              {/* ── SUB-FLOW B: OFFLINE VERIFICATION (FIELD AGENT) ── */}
              {formData.verificationMethod === 'offline' && (
                <div style={{ background: '#FBF9F6', borderRadius: '14px', border: '1px solid var(--lokha-border, #E8DFD5)', padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <Calendar size={22} color="var(--lokha-wood)" />
                    <div>
                      <h3 style={{ fontSize: '1.05rem', margin: 0, color: 'var(--lokha-primary)' }}>Schedule Field Agent Physical Inspection</h3>
                      <p style={{ fontSize: '0.84rem', color: 'var(--color-text-secondary)', margin: '2px 0 0' }}>
                        A verified LOKHA representative will visit your property to verify physical premises, check the EB meter, and inspect ownership records.
                      </p>
                    </div>
                  </div>

                  <div className="form-grid-2">
                    <FormField label="Preferred Inspection Date" error={errors.offlineDate} required>
                      <input
                        type="date"
                        className="form-input"
                        min={new Date().toISOString().split('T')[0]}
                        value={formData.offlineDate}
                        onChange={(e) => update('offlineDate', e.target.value)}
                      />
                    </FormField>

                    <FormField label="Preferred Time Window" required>
                      <select className="form-select" value={formData.offlineSlot} onChange={(e) => update('offlineSlot', e.target.value)}>
                        <option value="Morning (9:00 AM - 12:00 PM)">Morning (9:00 AM - 12:00 PM)</option>
                        <option value="Afternoon (12:00 PM - 3:00 PM)">Afternoon (12:00 PM - 3:00 PM)</option>
                        <option value="Evening (3:00 PM - 6:00 PM)">Evening (3:00 PM - 6:00 PM)</option>
                      </select>
                    </FormField>
                  </div>

                  <FormField label="Contact Person Available at Premises" required>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="Name of owner or representative present during visit"
                      value={formData.offlineContactPerson}
                      onChange={(e) => update('offlineContactPerson', e.target.value)}
                    />
                  </FormField>

                  <div style={{ background: '#FFFFFF', padding: '14px 18px', borderRadius: '8px', border: '1px solid #E2E8F0', fontSize: '0.84rem', color: 'var(--color-text-secondary)' }}>
                    <strong style={{ color: 'var(--color-text-main)', display: 'block', marginBottom: '6px' }}>📋 Agent Checklist on Visit:</strong>
                    <ul style={{ margin: 0, paddingLeft: '18px', lineHeight: 1.6 }}>
                      <li>Physical inspection of EB electric meter number matching property address.</li>
                      <li>Verification of original EB bill in applicant's or family member's name.</li>
                      <li>Checking family card or relationship proof if listed on behalf of family member.</li>
                      <li>Granting Instagram-style Verified Badge immediately upon physical sign-off.</li>
                    </ul>
                  </div>
                </div>
              )}
            </>
          )}

          {/* ── STEP 5: Contact Details ──────────────────── */}
          {step === 5 && (
            <>
              <h2 className="form-step-title">Contact Details</h2>
              <p className="form-step-subtitle">Buyers and tenants will use this to reach you</p>

              {/* Owner / Agent Toggle */}
              <FormField label="I am the…">
                <div className="radio-cards-row">
                  <button type="button" className={`radio-card ${formData.ownerType === 'owner' ? 'active' : ''}`} onClick={() => update('ownerType', 'owner')}>
                    🏠 Property Owner
                  </button>
                  <button type="button" className={`radio-card ${formData.ownerType === 'agent' ? 'active' : ''}`} onClick={() => update('ownerType', 'agent')}>
                    👔 Real Estate Agent
                  </button>
                </div>
              </FormField>

              <div className="form-grid-2">
                <FormField label="Full Name" error={errors.ownerName} required>
                  <input type="text" className="form-input" placeholder="Your full name" value={formData.ownerName} onChange={(e) => update('ownerName', e.target.value)} />
                </FormField>
                <FormField label="Mobile Number" error={errors.ownerPhone} required>
                  <input type="tel" className="form-input" placeholder="+91 98450 12345" value={formData.ownerPhone} onChange={(e) => update('ownerPhone', e.target.value)} />
                </FormField>
              </div>
              <FormField label="Email Address">
                <input type="email" className="form-input" placeholder="your@email.com" value={formData.ownerEmail} onChange={(e) => update('ownerEmail', e.target.value)} />
              </FormField>

              {/* Privacy message */}
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', padding: '12px 16px', background: 'var(--color-navy-tint)', borderRadius: 'var(--radius-md)', marginTop: '8px', fontSize: '0.82rem', color: 'var(--color-primary-navy)' }}>
                <Shield size={18} style={{ flexShrink: 0, marginTop: '1px' }} />
                <span>Your contact information is shared only with verified interested parties. LOKHA prevents spam calls and never sells your data.</span>
              </div>
            </>
          )}

          {/* ── STEP 6: Review & Publish ─────────────────── */}
          {step === 6 && (
            <>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px', flexWrap: 'wrap', gap: '10px' }}>
                <div>
                  <h2 className="form-step-title" style={{ margin: 0 }}>Review & Publish</h2>
                  <p className="form-step-subtitle" style={{ margin: '4px 0 0' }}>Review your listing and trust badge before going live</p>
                </div>
                <VerifiedBadge size="lg" />
              </div>

              {/* Verification status callout */}
              <div style={{ background: 'rgba(0, 149, 246, 0.08)', border: '1px solid rgba(0, 149, 246, 0.25)', borderRadius: '12px', padding: '14px 18px', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                <InstagramVerifiedIcon size={24} />
                <div style={{ fontSize: '0.88rem', color: 'var(--color-text-main)' }}>
                  <strong>Trust Badge Qualified: </strong>
                  {formData.verificationMethod === 'online'
                    ? `Verified via Online EB Bill (${formData.ebConsumerNumber}) & ${formData.ownershipType === 'family' ? `${formData.familyRelation}'s Family Card` : 'Owner Proof'}.`
                    : `Field agent visit scheduled for ${formData.offlineDate} (${formData.offlineSlot}).`}
                </div>
              </div>

              <div style={{ display: 'grid', gap: '14px', background: 'var(--color-bg-page)', borderRadius: 'var(--radius-lg)', padding: '20px', marginBottom: '24px' }}>
                {[
                  { label: 'Property Type', value: `${formData.bhk} BHK ${formData.propertyType}` },
                  {
                    label: 'Purpose',
                    value: formData.purpose === 'sale' ? 'For Sale' : formData.purpose === 'rent' ? 'For Rent' : `For Lease (${formData.leaseDuration})`
                  },
                  { label: 'Location', value: `${formData.locality}, ${formData.city}, ${formData.state}` },
                  { label: 'Area', value: formData.area ? `${formData.area} sq ft` : 'Not specified' },
                  {
                    label: formData.purpose === 'rent' ? 'Monthly Rent' : formData.purpose === 'lease' ? 'Lease Amount' : 'Selling Price',
                    value: formData.price ? `₹${parseFloat(formData.price).toLocaleString('en-IN')}` : 'Not specified'
                  },
                  { label: 'Furnishing', value: formData.furnishing },
                  { label: 'Verification Mode', value: formData.verificationMethod === 'online' ? 'Online EB & Ownership Verification' : 'Offline Agent Physical Visit' },
                  { label: 'EB Meter Connection', value: formData.ebConsumerNumber ? `${formData.ebConsumerNumber} (${formData.ebBoardName})` : 'Pending Inspection' },
                  { label: 'Ownership Type', value: formData.ownershipType === 'family' ? `Family Owned (${formData.familyRelation}: ${formData.familyMemberName || 'Relative'})` : 'Owned by Self' },
                  { label: 'Photos', value: `${formData.photos.length} photos attached` },
                  { label: 'Listed By', value: `${formData.ownerName} (${formData.ownerType === 'owner' ? 'Owner' : 'Agent'})` },
                ].map((row) => (
                  <div key={row.label} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--color-border-subtle)', paddingBottom: '10px' }}>
                    <span style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)', fontWeight: 600 }}>{row.label}</span>
                    <span style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--color-text-main)', textAlign: 'right', maxWidth: '60%' }}>{row.value}</span>
                  </div>
                ))}
              </div>

              <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                <button type="button" className="btn btn-cta-teal btn-lg" onClick={handlePublish} id="publish-property-btn" style={{ flex: 2, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                  <InstagramVerifiedIcon size={18} />
                  <span>Publish Property with Verified Badge</span>
                </button>
                <button type="button" className="btn btn-outline" style={{ flex: 1 }}>
                  Save Draft
                </button>
              </div>
            </>
          )}

          {/* Stepper Navigation Buttons */}
          <div className="stepper-nav-footer">
            {step > 1 ? (
              <button type="button" onClick={handleBack} className="btn btn-outline" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <ChevronLeft size={17} /> Previous
              </button>
            ) : <div />}

            {step < 6 && (
              <button type="button" onClick={handleNext} className="btn btn-primary-navy" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                Next <ChevronRight size={17} />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
