import fileDownload from 'js-file-download';
import axios from 'axios';
axios.defaults.withCredentials = true;

const dev = 'http://localhost:4000';
const baseURL = window.location.origin.includes(':3000')
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
  return await api.post('/api/map', {
    duplicatedId: duplicatedId,
    authorId: authorId,
    title: title,
    description: description,
    tags: tags,
    json: json,
  });
};

export const deleteMap = async (mapId) => {
  return await api.delete(`/api/map/${mapId}`);
};

export const getAllMaps = async () => {
  return await api.get('/api/maps');
};
//TEST
export const getAllMapsByUserId = async (userId) => {
  return await api.get(`/api/maps/user/${userId}`);
};

export const duplicateMap = async (userId, mapId) => {
  return await api.post(`/api/duplicate/`, { userId, mapId });
};

export const getMapById = async (id) => {
  console.log('getMapById request api');
  return await api.get(`/api/map/${id}`);
};

export const getAllTags = async () => {
  return await api.get(`/api/tags`);
};

export const getTagsByMapId = async (id) => {
  return await api.get(`/api/tags/${id}`);
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

export const updateAllFeatures = async (mapId, json) => {
  return await api.put(`/api/feature/all/${mapId}`, {
    data: json,
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

export const downloadMapAsGeoJSON = async (mapId, filename) => {
  let res = await api.get(`/api/downloadgeo/${mapId}`, {
    responseType: 'blob',
  });

  fileDownload(res.data, filename);
};

export const downloadMapAsShapefile = async (mapId, filename) => {
  let res = await api.get(`/api/downloadshp/${mapId}`, {
    responseType: 'blob',
  });

  fileDownload(res.data, filename);
};

export const searchMaps = async (searchTerm, searchTags, sortType) => {
  let tagsStr;
  if (searchTags.length > 0) {
    tagsStr = searchTags.join('&');
  } else {
    tagsStr = '';
  }

  return await api.get(`/api/search/map/${searchTerm}/${tagsStr}/${sortType}`);
};

export const getThumbnail = async (mapId) => {
  return await api.get(`/api/thumbnail/${mapId}`); //, {
  // responseType: 'blob',
  // });
};

export const insertThumbnail = async (mapId, blob) => {
  return await api.post(`/api/thumbnail/${mapId}`, {
    data: blob,
  });
};

export const upsertLegend = async (
  mapId,
  color,
  label,
) => {
  return await api.post('/api/legend', {
    mapId: mapId,
    color: color,
    label: label,
  });
};
