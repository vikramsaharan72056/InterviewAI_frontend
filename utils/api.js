import axios from "axios";

export const api = axios.create({
    baseUrl: 'http://192.168.1.85:5000'
})