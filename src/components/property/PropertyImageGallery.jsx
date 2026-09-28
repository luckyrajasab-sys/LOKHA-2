import React, { useState } from 'react';
import { Camera, ChevronLeft, ChevronRight, X } from 'lucide-react';

export default function PropertyImageGallery({ images = [], title = 'Property' }) {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  const displayImages = images.length > 0 ? images : [
    'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80'
  ];

  const openLightbox = (index) => {
    setCurrentIndex(index);
    setLightboxOpen(true);
  };

  const nextImage = () => {
    setCurrentIndex((prev) => (prev + 1) % displayImages.length);
  };

  const prevImage = () => {
    setCurrentIndex((prev) => (prev - 1 + displayImages.length) % displayImages.length);
  };

  return (
    <>
      {/* Desktop/Tablet Grid Gallery */}
      <div className="detail-gallery">
        {/* Main hero photo */}
        <div className="gallery-item gallery-main-img" onClick={() => openLightbox(0)}>
          <img 
            src={displayImages[0]} 
            alt={`${title} - view 1`} 
            onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80'; }}
          />
        </div>

        {/* Secondary thumbnails */}
        {displayImages.slice(1, 5).map((img, idx) => (
          <div key={idx} className="gallery-item" onClick={() => openLightbox(idx + 1)}>
            <img 
              src={img} 
              alt={`${title} - view ${idx + 2}`} 
              onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80'; }}
            />
          </div>
        ))}

        {/* View All Button */}
        <button 
          type="button"
          className="gallery-view-all-btn"
          onClick={() => openLightbox(0)}
          aria-label="View all photos"
        >
          <Camera size={18} />
          <span>View all {displayImages.length} photos</span>
        </button>
      </div>

      {/* Fullscreen Lightbox Modal */}
      {lightboxOpen && (
        <div 
          className="modal-overlay" 
          style={{ background: 'rgba(0, 0, 0, 0.92)', zIndex: 3000 }}
          onClick={() => setLightboxOpen(false)}
        >
          <div 
            style={{ position: 'relative', width: '90%', maxWidth: '1000px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close button */}
            <button 
              type="button"
              onClick={() => setLightboxOpen(false)}
              style={{
                position: 'absolute',
                top: '-45px',
                right: '0',
                color: '#FFFFFF',
                background: 'rgba(255, 255, 255, 0.2)',
                borderRadius: '50%',
                width: '36px',
                height: '36px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
              aria-label="Close photos"
            >
              <X size={20} />
            </button>

            {/* Main image */}
            <div style={{ position: 'relative', width: '100%', maxHeight: '78vh', display: 'flex', justifyContent: 'center' }}>
              <img 
                src={displayImages[currentIndex]} 
                alt={`${title} - ${currentIndex + 1}`}
                style={{ maxHeight: '75vh', maxWidth: '100%', objectFit: 'contain', borderRadius: 'var(--radius-lg)' }}
              />

              {displayImages.length > 1 && (
                <>
                  <button 
                    type="button"
                    onClick={prevImage}
                    style={{
                      position: 'absolute',
                      left: '10px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      background: 'rgba(0,0,0,0.6)',
                      color: '#FFF',
                      borderRadius: '50%',
                      width: '44px',
                      height: '44px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                    aria-label="Previous image"
                  >
                    <ChevronLeft size={24} />
                  </button>
                  <button 
                    type="button"
                    onClick={nextImage}
                    style={{
                      position: 'absolute',
                      right: '10px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      background: 'rgba(0,0,0,0.6)',
                      color: '#FFF',
                      borderRadius: '50%',
                      width: '44px',
                      height: '44px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                    aria-label="Next image"
                  >
                    <ChevronRight size={24} />
                  </button>
                </>
              )}
            </div>

            {/* Counter */}
            <div style={{ color: '#E2E8F0', marginTop: '12px', fontSize: '0.9rem', fontWeight: 600 }}>
              {currentIndex + 1} / {displayImages.length}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
