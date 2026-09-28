import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { getFromStorage, saveToStorage, KEYS } from '../utils/storage';
import { useToast } from './ToastContext';
import { useAuth } from './AuthContext';
import {
  subscribeToProperties,
  addProperty,
  updateProperty,
  markPropertyStatus,
  deleteProperty,
  seedPropertiesDatabase,
  getDatabaseStats
} from '../services/firebaseService';
import {
  subscribeToUserSavedProperties,
  saveUserProperty,
  removeUserProperty
} from '../services/savedPropertyService';

const SavedContext = createContext(null);

const DEFAULT_VISITS = [
  {
    id: 'vis-1',
    propertyId: 'lokha-che-001',
    propertyTitle: 'Anna Nagar 2 BHK Sunlit Modern Flat',
    locality: 'Anna Nagar, Chennai',
    date: '2026-10-02',
    timeSlot: '11:00 AM - 12:00 PM',
    agentName: 'Aditi Deshmukh (Partner Agent)',
    status: 'Confirmed'
  },
  {
    id: 'vis-2',
    propertyId: 'lokha-blr-001',
    propertyTitle: 'Whitefield 3 BHK High-Rise Residence',
    locality: 'Whitefield, Bengaluru',
    date: '2026-10-05',
    timeSlot: '04:00 PM - 05:00 PM',
    agentName: 'Ramesh Sundaram (Owner)',
    status: 'Upcoming'
  }
];

export function SavedProvider({ children }) {
  const { showToast } = useToast();
  const { user } = useAuth();

  // Real-time properties from Firebase
  const [properties, setProperties] = useState([]);
  const [loadingProperties, setLoadingProperties] = useState(true);
  const [dbStats, setDbStats] = useState(() => getDatabaseStats());
  const [isSeeding, setIsSeeding] = useState(false);

  // Saved properties IDs
  const [savedIds, setSavedIds] = useState(() => {
    return getFromStorage(KEYS.SAVED_PROPERTIES, ['lokha-che-001', 'lokha-blr-001', 'lokha-hyd-001']);
  });

  // Compare properties IDs
  const [compareIds, setCompareIds] = useState(() => {
    return getFromStorage(KEYS.COMPARE_PROPERTIES, ['lokha-che-001', 'lokha-blr-001']);
  });

  // Scheduled Visits
  const [scheduledVisits, setScheduledVisits] = useState(() => {
    return getFromStorage(KEYS.SCHEDULED_VISITS, DEFAULT_VISITS);
  });

  // Subscribe to real-time property changes from Firebase
  useEffect(() => {
    setLoadingProperties(true);
    const unsubscribe = subscribeToProperties((updatedProps) => {
      setProperties(updatedProps);
      setLoadingProperties(false);
      setDbStats(getDatabaseStats());
    });

    return () => {
      if (typeof unsubscribe === 'function') unsubscribe();
    };
  }, []);

  useEffect(() => {
    saveToStorage(KEYS.SAVED_PROPERTIES, savedIds);
  }, [savedIds]);

  useEffect(() => {
    saveToStorage(KEYS.COMPARE_PROPERTIES, compareIds);
  }, [compareIds]);

  useEffect(() => {
    saveToStorage(KEYS.SCHEDULED_VISITS, scheduledVisits);
  }, [scheduledVisits]);

  // Subscribe to user saved properties from Firebase when logged in
  useEffect(() => {
    if (!user?.uid) return;
    const unsubscribe = subscribeToUserSavedProperties(user.uid, (remoteIds) => {
      if (Array.isArray(remoteIds) && remoteIds.length > 0) {
        setSavedIds(remoteIds);
      }
    });

    return () => {
      if (typeof unsubscribe === 'function') unsubscribe();
    };
  }, [user?.uid]);

  const toggleSave = useCallback((propertyId) => {
    setSavedIds((prev) => {
      const isSaved = prev.includes(propertyId);
      if (isSaved) {
        showToast('Removed from Saved Homes', 'info');
        if (user?.uid) {
          removeUserProperty(user.uid, propertyId).catch((err) => console.warn('Remove error:', err));
        }
        return prev.filter((id) => id !== propertyId);
      } else {
        showToast('Added to Saved Homes', 'heart');
        if (user?.uid) {
          saveUserProperty(user.uid, propertyId).catch((err) => console.warn('Save error:', err));
        }
        return [...prev, propertyId];
      }
    });
  }, [showToast, user?.uid]);

  const isSaved = useCallback((propertyId) => savedIds.includes(propertyId), [savedIds]);

  const toggleCompare = useCallback((propertyId) => {
    setCompareIds((prev) => {
      if (prev.includes(propertyId)) {
        showToast('Removed from comparison', 'info');
        return prev.filter((id) => id !== propertyId);
      } else {
        if (prev.length >= 4) {
          showToast('You can compare up to 4 properties at once', 'error');
          return prev;
        }
        showToast('Added to comparison', 'success');
        return [...prev, propertyId];
      }
    });
  }, [showToast]);

  const clearCompare = useCallback(() => {
    setCompareIds([]);
  }, []);

  // Add custom property to Firebase
  const addCustomProperty = useCallback(async (newProp) => {
    try {
      const created = await addProperty(newProp);
      showToast('Property published successfully to live marketplace!', 'success');
      return created;
    } catch (err) {
      console.error('Error adding property:', err);
      showToast('Failed to publish property: ' + err.message, 'error');
      throw err;
    }
  }, [showToast]);

  // Update property status (e.g. 'Sold' | 'Rented' | 'Available')
  const updatePropertyStatus = useCallback(async (propertyId, status) => {
    try {
      await markPropertyStatus(propertyId, status);
      showToast(`Property marked as ${status}`, 'success');
    } catch (err) {
      console.error('Error updating status:', err);
      showToast('Failed to update status', 'error');
    }
  }, [showToast]);

  // Delete property from Firebase
  const deletePropertyItem = useCallback(async (propertyId) => {
    try {
      await deleteProperty(propertyId);
      showToast('Property deleted successfully', 'info');
    } catch (err) {
      console.error('Error deleting property:', err);
      showToast('Failed to delete property', 'error');
    }
  }, [showToast]);

  // Reseed or regenerate demo database
  const reseedDatabase = useCallback(async (force = true) => {
    setIsSeeding(true);
    try {
      const res = await seedPropertiesDatabase(force);
      showToast(res.message, 'success');
      setDbStats(getDatabaseStats());
    } catch (err) {
      console.error('Error reseeding database:', err);
      showToast('Error seeding database: ' + err.message, 'error');
    } finally {
      setIsSeeding(false);
    }
  }, [showToast]);

  const addScheduledVisit = useCallback((visit) => {
    const newVisit = {
      id: 'vis-' + Date.now(),
      ...visit,
      status: 'Confirmed'
    };
    setScheduledVisits((prev) => [newVisit, ...prev]);
    showToast('Site visit scheduled successfully!', 'success');
  }, [showToast]);

  return (
    <SavedContext.Provider
      value={{
        properties,
        loadingProperties,
        dbStats,
        isSeeding,
        savedIds,
        toggleSave,
        isSaved,
        compareIds,
        toggleCompare,
        clearCompare,
        scheduledVisits,
        addScheduledVisit,
        addCustomProperty,
        updatePropertyStatus,
        deletePropertyItem,
        reseedDatabase
      }}
    >
      {children}
    </SavedContext.Provider>
  );
}

export function useSaved() {
  const context = useContext(SavedContext);
  if (!context) {
    throw new Error('useSaved must be used within a SavedProvider');
  }
  return context;
}

