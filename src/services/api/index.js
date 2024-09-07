import axios from "axios";
import NProgress from "nprogress";
import Swal from "sweetalert2";
import config from "../../config.js";
import {useSettingsStore} from "../../store/index.js";

NProgress.configure({
    showSpinner: true,
    trickleRate: 0.02,
    trickleSpeed: 400,
    easing: "ease",
    speed: 200,
});

const request = axios.create({
    baseURL: config.API_ROOT,
    params: {},
});

const refreshToken = async () => {
    try {
        const refreshToken = useSettingsStore.getState().refreshToken;
        const response = await axios.post(`${config.API_ROOT}/api/refresh-token`, {}, {
            headers: {
                'Authorization': `Bearer ${refreshToken}`
            }
        });
        const newToken = response?.data?.accessToken;
        const newRefreshToken = response?.data?.refreshToken;
        useSettingsStore.getState().setToken(newToken);
        useSettingsStore.getState().setRefreshToken(newRefreshToken);

        NProgress.done(true);

        return newToken;
    } catch (error) {
        console.error("Error refreshing token:", error);
        return null;
    }
};

request.interceptors.request.use(
    (requestConfig) => {
        NProgress.inc();
        const token = useSettingsStore.getState().token;
        requestConfig.headers["Accept-Language"] = useSettingsStore.getState().lang || config.DEFAULT_APP_LANG;
        if (token) requestConfig.headers.Authorization = `Bearer ${token}`;
        return requestConfig;
    },
    (error) => {
        NProgress.done(true);
        return Promise.reject(error);
    }
);

request.interceptors.response.use(
    (response) => {
        NProgress.done(true);
        return response;
    },
    async (error) => {
        const statusCode = error.response ? error.response.status : null;
        if (statusCode === 401) {
            const originalRequest = error.config;
            const newToken = await refreshToken();
            if (newToken) {
                originalRequest.headers.Authorization = `Bearer ${newToken}`;
                return axios(originalRequest);
            } else {
                Swal.fire({
                    position: "center",
                    icon: "error",
                    backdrop: "rgba(0,0,0,0.9)",
                    background: "none",
                    title: "Tokeningiz faol emas. Iltimos tizimga qayta kiring !!!",
                    showConfirmButton: true,
                    showCancelButton: false,
                    confirmButtonColor: "#d33",
                    cancelButtonColor: "#13D6D1",
                    confirmButtonText: "Chiqish",
                    customClass: {
                        title: "title-color",
                    },
                }).then(() => {
                    window.localStorage.clear();
                    window.location.reload();
                });
            }
        }
        NProgress.done(true);
        return Promise.reject(error);
    }
);

export { request };