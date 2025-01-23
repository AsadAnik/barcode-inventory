import axios from 'axios';

const apiClient = axios.create({
    baseURL: `${process.env.NEXT_PUBLIC_API_URL}`,
});

/**
 * ADDING ACCESS TOKEN TO HEADER
 * Intercepts the request and adds the access token to the headers
 */
apiClient.interceptors.request.use((config) => {
    const token = localStorage.getItem('accessToken');

    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
});

/**
 * REFRESHING ACCESS TOKEN
 * Intercepts the response and refreshes the access token if it is expired
 */
apiClient.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true; // Mark this request as retried

            try {
                const refreshToken = document.cookie
                    .split('; ')
                    .find((row) => row.startsWith('refreshToken='))
                    ?.split('=')[1];

                const { data } = await axios.post('/api/auth/refresh', { refreshToken });
                localStorage.setItem('accessToken', data.accessToken);
                originalRequest.headers.Authorization = `Bearer ${data.accessToken}`;
                return apiClient(originalRequest); // Retry original request

            } catch (err) {
                console.error('Failed to refresh token', err);
                // Optional: Redirect to login page if token refresh fails
                window.location.href = '/auth/login';
            }
        }

        return Promise.reject(error);
    }
);

export default apiClient;
