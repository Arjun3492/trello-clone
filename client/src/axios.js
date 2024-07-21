import axios from 'axios';

const axiosInstance = axios.create({
    baseURL: (process.env.REACT_APP_SERVER_URL || 'http://localhost:5000/') + '/api',
    withCredentials: true,
});

export default axiosInstance;
