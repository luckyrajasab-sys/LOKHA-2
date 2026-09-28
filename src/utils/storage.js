const KEYS = {
  SAVED_PROPERTIES: 'lokha_saved_properties',
  COMPARE_PROPERTIES: 'lokha_compare_properties',
  SCHEDULED_VISITS: 'lokha_scheduled_visits',
  USER_PROFILE: 'lokha_user_profile',
  CUSTOM_LISTINGS: 'lokha_custom_listings',
  RECENT_SEARCHES: 'lokha_recent_searches'
};

export function getFromStorage(key, defaultValue) {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (e) {
    console.error(`Error reading ${key} from storage`, e);
    return defaultValue;
  }
}

export function saveToStorage(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.error(`Error saving ${key} to storage`, e);
  }
}

export { KEYS };
