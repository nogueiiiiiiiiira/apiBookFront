import axios from 'axios';

export const apiBiblioteca = axios.create({
    baseURL: "http://localhost:3001"
})