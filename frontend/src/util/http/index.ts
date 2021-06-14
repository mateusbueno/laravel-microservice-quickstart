import axios from 'axios';

export const httpVideo = axios.create({
    baseURL: process.env.REACT_APP_MICRO_VIDEO_API_URL
});

export function addGlobalRequestInterceptor() {

}

export function removeGlobalRequestInterceptor() {
    
}

export function addGlobalResponseInterceptor() {

}

export function removeGlobalResponseInterceptor() {
    
}