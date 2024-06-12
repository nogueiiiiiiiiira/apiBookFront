import axios from 'axios';

export const apiBiblioteca = axios.create({
    baseURL: "http://localhost:3001"
})

export const apiRMCharacters = axios.create({
    baseURL: "https://rickandmortyapi.com/api"
})

export const apiBooks = axios.create({
    baseURL: "https://www.googleapis.com/books/v1/volumes?q=searchTerm"
})