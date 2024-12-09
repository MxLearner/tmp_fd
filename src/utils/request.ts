/*-------------------- axios encapsulation --------------------*/
import axios from 'axios';
import router from '../router/index';
//  let protocol = window.location.protocol;
//  let host = window.location.host;
//  axios.defaults.baseURL = protocol + "//" + host;
axios.defaults.baseURL = '/api'

/* request interceptors */
axios.interceptors.request.use(
    async config => {
        // TODO: add token to header before request is sent
        // config.headers.token = sessionStorage.getItem('token')
        return config;
    },
    error => {
        return Promise.reject(error);
    }
);

/* response interceptors */
axios.interceptors.response.use(
    response => {
        if (response.status === 200) {
            return Promise.resolve(response);
        } else {
            return Promise.reject(response);
        }},
        // code != 200
        error => {
            if (error.response.status) {
                switch (error.response.status) {
                    // 401: not logged in, redirect to login page with the current page path
                    // After successful login, return to the current page. This step requires operation on the login page
                    case 401:
                    // Prompt users for login expiration
                    // Clear local tokens and clear token objects in Vuex
                    // Jump to login page
                    
                    // 403: token expired, redirect to login page with the current page path
                    case 403: sessionStorage.clear()
                    break
                    
                    // 404: resource not found, redirect to 404 page
                    case 404: break;// Other errors, throw error prompts directly
                    default:
                }
                return Promise.reject(error.response);
            }
        }
);

/** * get method，Corresponding to get requests * @param {String} url [The requested URL address] * @param {Object} params [Parameters carried during request] */
const $get = (url: string, params: object) => {
    return new Promise(
        (resolve, reject) => {
            axios.get(url, {params: params,
        }).then(res => {
            resolve(res.data);
        }).catch(err => {
            reject(err.data)
        })});
}
/** * post method，Corresponding to post requests * @param {String} url [The requested URL address] * @param {Object} params [Parameters carried during request] */
const $post = (url: string, params: object) => {
    return new Promise((resolve, reject) => {
        axios.post(url, params) 
        // It is to serialize objects into URL form and concatenate them with '&'
        .then(res => {
            resolve(res.data);
        })
        .catch(err => {
            reject(err.data)
        })
    });
}
// Mount the get and post methods onto the Vue prototype for global use
export default {
    install: (app: any) => {
        app.config.globalProperties['$get'] = $get;
        app.config.globalProperties['$post'] = $post;
        app.config.globalProperties['$axios'] = axios;
    }
}