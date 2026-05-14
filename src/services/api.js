import axios from 'axios';

const API = axios.create({
    baseURL: window.location.hostname === 'localhost' 
        ? 'http://localhost:5000/api' 
        : 'https://backend-2-yza9.onrender.com/api'
});

// Attach token to every request if available
API.interceptors.request.use((config) => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user?.token) {
        config.headers.Authorization = `Bearer ${user.token}`;
    }
    return config;
});

// Auth
export const registerUser = (formData) => API.post('/auth/register', formData);
export const loginUser = (formData) => API.post('/auth/login', formData);
export const getMe = () => API.get('/auth/me');
export const updateProfile = (data) => API.put('/auth/profile', data);
export const getStats = () => API.get('/auth/stats');
export const forgotPassword = (email) => API.post('/auth/forgotpassword', { email });
export const resetPassword = (token, password) => API.put(`/auth/resetpassword/${token}`, { password });

// Internships
export const getInternships = () => API.get('/internships');
export const getInternship = (id) => API.get(`/internships/${id}`);
export const createInternship = (data) => API.post('/internships', data);

// Applications
export const applyToInternship = (data) => API.post('/applications', data);
export const getMyApplications = () => API.get('/applications/my');

export default API;
