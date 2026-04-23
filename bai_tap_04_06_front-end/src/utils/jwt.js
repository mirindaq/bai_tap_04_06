const base64UrlDecode = (input) => {
  const normalized = input.replace(/-/g, '+').replace(/_/g, '/');
  const padded = normalized + '='.repeat((4 - (normalized.length % 4)) % 4);
  return atob(padded);
};

export const getUserIdFromToken = (accessToken) => {
  if (!accessToken) {
    return null;
  }

  try {
    const parts = accessToken.split('.');
    if (parts.length < 2) {
      return null;
    }

    const payloadJson = base64UrlDecode(parts[1]);
    const payload = JSON.parse(payloadJson);
    const rawUserId = payload?.uid ?? payload?.sub;
    const userId = Number(rawUserId);
    return Number.isFinite(userId) && userId > 0 ? userId : null;
  } catch {
    return null;
  }
};
