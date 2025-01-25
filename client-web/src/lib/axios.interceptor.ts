import axios from 'axios';


// Create Axios instance
const apiClient = axios.create({
  baseURL: `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api'}`,
  withCredentials: true, // Ensure credentials (cookies) are sent with every request
});

// Intercept request to add access token to headers
apiClient.interceptors.request.use(async (config) => {
  console.log('Cookies:', document.cookie); // Debug cookies

  const token = document.cookie
    .split('; ')
    .find((row) => row.startsWith('accessToken='))
    ?.split('=')[1];

  console.log('Access Token:', token); // Debug extracted token


  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// Intercept response to refresh the access token if expired
apiClient.interceptors.response.use(
  (response) => response, // Pass through successful responses
  async (error) => {
    const originalRequest = error.config;

    // Check if we received a 401 (Unauthorized) error and handle it
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true; // Mark this request as retried

      try {
        // Retrieve the refresh token from cookies
        const refreshToken = document.cookie
          .split('; ')
          .find((row) => row.startsWith('refreshToken='))
          ?.split('=')[1];

        if (refreshToken) {
          // Request the new access token using the refresh token
          const { data } = await axios.post('/api/auth/refresh', { refreshToken }, { withCredentials: true });

          // Set the new access token as a cookie
          document.cookie = `accessToken=${data.accessToken}; Path=/; HttpOnly; Secure; Max-Age=900;`;

          // Retry the original request with the new access token
          originalRequest.headers.Authorization = `Bearer ${data.accessToken}`;
          return apiClient(originalRequest); // Retry the original request
        }
      } catch (err) {
        console.error('Failed to refresh token', err);
        // Optional: Redirect to login page if token refresh fails
        window.location.href = '/login';
      }
    }

    // Pass any errors on to be handled
    return Promise.reject(error);
  }
);

export default apiClient;
