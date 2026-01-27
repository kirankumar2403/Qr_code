export function redirectToGoogleOAuth() {
  const clientId = process.env.REACT_APP_GOOGLE_CLIENT_ID;
  const redirectUri = process.env.REACT_APP_GOOGLE_REDIRECT_URI;
  const scope = encodeURIComponent('openid email profile');
  const responseType = 'code';
  const includeGranted = 'true';
  const prompt = 'select_account'; // shows account chooser (all mails)

  if (!clientId || !redirectUri) {
    alert('Google OAuth not configured. Please set REACT_APP_GOOGLE_CLIENT_ID and REACT_APP_GOOGLE_REDIRECT_URI in your .env file.');
    return;
  }

  // Lightweight state to mitigate CSRF; store for verification after redirect (implementation TBD)
  const state = Math.random().toString(36).slice(2);
  sessionStorage.setItem('oauth_state', state);

  const url = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=${responseType}&scope=${scope}&include_granted_scopes=${includeGranted}&prompt=${prompt}&state=${state}`;

  window.location.assign(url);
}
