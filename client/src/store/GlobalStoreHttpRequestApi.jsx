import axios from "axios";
axios.defaults.withCredentials = true;

console.log("match", window.location.origin.includes(":3000"));
const dev = "http://localhost:4000";
const baseURL = window.location.origin.includes(":3000")
    ? dev
    : window.location.origin;

const api = axios.create({
    baseURL: baseURL,
});

export const createMap = async (
    duplicatedId,
    authorId,
    title,
    description,
    tags,
    json
) => {
    return await api.post("/api/map", {
        duplicatedId: duplicatedId,
        authorId: authorId,
        title: title,
        description: description,
        tags: tags,
        json: json,
    });
};

export const getAllMaps = async () => {
    return await api.get("/api/maps");
};

export const getMapById = async (id) => {
    return await api.get(`/api/map/${id}`);
};

export const updateMapTitle = async (id, title) => {
    return await api.put(`/api/map/title/${id}`, {
        title: title,
    });
};

export const updateMapDescription = async (id, desc) => {
    return await api.put(`/api/map/desc/${id}`, {
        description: desc,
    });
};

export const updateFeatureProperties = async (featureId, propsData) => {
    return await api.put(`/api/feature/props/${featureId}`, {
        data: propsData,
    });
};

export const updateFeatureGeometry = async (featureId, geoData) => {
    return await api.put(`/api/feature/geo/${featureId}`, {
        data: geoData,
    });
};

export const insertFeature = async (mapId, data) => {
    return await api.post(`/api/feature`, {
        mapId: mapId,
        data: data,
    });
};

export const deleteFeature = async (featureId) => {
    return await api.delete(`/api/feature/${featureId}`);
};
