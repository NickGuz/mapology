import axios from 'axios'
axios.defaults.withCredentials = true;

console.log('match', window.location.origin.includes(":3000"));
const dev = 'http://localhost:4000';
const baseURL = window.location.origin.includes(":3000") ? dev : window.location.origin;

const api = axios.create({
    baseURL: baseURL
});

export const createMap = async (duplicatedId, authorId, title, description, tags, json) => {
    return await api.post('/api/map', {
        duplicatedId: duplicatedId,
        authorId: authorId,
        title: title,
        description: description,
        tags: tags,
        json: json
    });
}

export const getAllMaps = async () => {
    return await api.get('/api/maps');
}

