/**
 * LOKHA Realtime Property Inquiries Service
 * Stored under /inquiries/{inquiryId} and indexed under /userInquiries/{uid}
 */

import {
  db,
  ref,
  push,
  set,
  get,
  child,
  update
} from '../firebase/config.js';

export async function sendPropertyInquiry({
  propertyId,
  propertyTitle,
  propertyOwnerUid,
  senderUid,
  senderName,
  senderEmail,
  senderPhone,
  message
}) {
  if (!propertyId || !senderName || !senderPhone) {
    throw new Error('Property, contact name, and phone number are required.');
  }

  const inquiriesRef = ref(db, 'inquiries');
  const newInquiryRef = push(inquiriesRef);
  const inquiryId = newInquiryRef.key;

  const inquiryData = {
    inquiryId,
    propertyId,
    propertyTitle: propertyTitle || 'LOKHA Property',
    propertyOwnerUid: propertyOwnerUid || null,
    senderUid: senderUid || null,
    senderName: senderName.trim(),
    senderEmail: senderEmail?.trim() || '',
    senderPhone: senderPhone.trim(),
    message: message?.trim() || 'I am interested in this property. Please contact me with more details.',
    status: 'new', // 'new' | 'contacted' | 'closed'
    createdAt: Date.now(),
    updatedAt: Date.now()
  };

  await set(newInquiryRef, inquiryData);

  // Link under user's sent inquiries if user is logged in
  if (senderUid) {
    try {
      const userInquiryRef = ref(db, `userInquiries/${senderUid}/${inquiryId}`);
      await set(userInquiryRef, inquiryData);
    } catch (err) {
      console.warn('[LOKHA Inquiries] Failed to index under userInquiries:', err);
    }
  }

  // Link under owner's received inquiries if ownerUid is present
  if (propertyOwnerUid) {
    try {
      const ownerInquiryRef = ref(db, `ownerInquiries/${propertyOwnerUid}/${inquiryId}`);
      await set(ownerInquiryRef, inquiryData);
    } catch (err) {
      console.warn('[LOKHA Inquiries] Failed to index under ownerInquiries:', err);
    }
  }

  return inquiryData;
}

export async function getUserInquiries(senderUid) {
  if (!senderUid) return [];
  try {
    const userInquiriesRef = ref(db, `userInquiries/${senderUid}`);
    const snapshot = await get(userInquiriesRef);
    if (snapshot.exists()) {
      return Object.values(snapshot.val()).sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
    }
    return [];
  } catch (err) {
    console.warn('[LOKHA Inquiries] Error loading user inquiries:', err);
    return [];
  }
}

export async function getOwnerInquiries(ownerUid) {
  if (!ownerUid) return [];
  try {
    const ownerInquiriesRef = ref(db, `ownerInquiries/${ownerUid}`);
    const snapshot = await get(ownerInquiriesRef);
    if (snapshot.exists()) {
      return Object.values(snapshot.val()).sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
    }
    return [];
  } catch (err) {
    console.warn('[LOKHA Inquiries] Error loading owner inquiries:', err);
    return [];
  }
}

export async function updateInquiryStatus(inquiryId, newStatus, ownerUid) {
  if (!inquiryId || !newStatus) return false;
  const updates = {
    status: newStatus,
    updatedAt: Date.now()
  };

  const mainRef = ref(db, `inquiries/${inquiryId}`);
  await update(mainRef, updates);

  if (ownerUid) {
    const ownerRef = ref(db, `ownerInquiries/${ownerUid}/${inquiryId}`);
    await update(ownerRef, updates);
  }

  return true;
}
