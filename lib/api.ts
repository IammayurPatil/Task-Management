
export const apiFetch = async (endpoint: string, options: any = {}) => {
  const token = typeof window !== 'undefined' ? localStorage.getItem('tf_token') : null;
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
    Authorization: token ? `Bearer ${token}` : ''
  };

  const res = await fetch(endpoint, {
    ...options,
    headers,
  });

  const contentType = res.headers.get('content-type') || '';
  const data = contentType.includes('application/json') ? await res.json() : await res.text();

  if (!res.ok) {
    if (res.status === 401 && typeof window !== 'undefined' && token) {
      window.dispatchEvent(new CustomEvent('auth-expired'));
    }
    const message = (data && data.error) ? data.error : 'API Error';
    throw new Error(message);
  }

  return data;
};
