import axios from "axios";
const API = axios.create({
    baseURL: "http://localhost:9999"
});
API.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("token");
        const publicUrls = ["/api/auth/login", "/api/auth/register"];
        const isPublicRequest = publicUrls.some(url =>
            config.url?.includes(url)
        );
        // Plain token string concatenation blocks multi-line breakage bugs completely
        if (token && !isPublicRequest) {
            config.headers.Authorization = 'Bearer ' + token;
        }
        return config;
    },
    (error) => Promise.reject(error)
);
export default API;