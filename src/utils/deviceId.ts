// Generate or retrieve persistent device ID for backend cart and visitor tracking
export function getDeviceId(): string {
  const STORAGE_KEY = 'nad_device_id';
  let deviceId = localStorage.getItem(STORAGE_KEY);
  if (!deviceId) {
    deviceId = `dev_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
    localStorage.setItem(STORAGE_KEY, deviceId);
  }
  return deviceId;
}
