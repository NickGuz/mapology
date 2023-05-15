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
  json,
  compression
) => {
  return await api.post('/api/map', {
    duplicatedId: duplicatedId,
    authorId: authorId,
    title: title,
    description: description,
    tags: tags,
    json: json,
    compression: compression,
  });
};

export const deleteMap = async (mapId) => {
  return await api.delete(`/api/map/${mapId}`);
};

export const getAllMaps = async () => {
  return await api.get('/api/maps');
};
//TEST
export const getAllMapsByUserId = async (userId, page) => {
  return await api.get(`/api/maps/user/${userId}/${page}`);
};

export const duplicateMap = async (userId, mapId) => {
  return await api.post(`/api/duplicate/`, { userId, mapId });
};

export const getMapById = async (id) => {
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

export const updateMapProperty = async (id, propsData) => {
  return await api.put(`/api/map/props/${id}`, {
    data: propsData,
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

export const hasLike = async (userId, mapId) => {
  return await api.get(`/api/hasLike/${userId}/${mapId}`).catch((err) => {
    return err.response;
  });
};

export const addLike = async (userId, mapId) => {
  return await api.post(`/api/addLike`, { userId, mapId }).catch((err) => {
    return err.response;
  });
};

export const getAllMapLikes = async (mapId) => {
  return await api.get(`/api/getAllMapLikes/${mapId}`).catch((err) => {
    return err.response;
  });
};

export const deleteLike = async (userId, mapId) => {
  return await api.delete(`/api/deleteLike/${userId}/${mapId}`).catch((err) => {
    return err.response;
  });
};

export const hasDislike = async (userId, mapId) => {
  return await api.get(`/api/hasDislike/${userId}/${mapId}`).catch((err) => {
    return err.response;
  });
};

export const addDislike = async (userId, mapId) => {
  return await api.post(`/api/addDislike`, { userId, mapId }).catch((err) => {
    return err.response;
  });
};

export const getAllMapDislikes = async (mapId) => {
  return await api.get(`/api/getAllMapDislikes/${mapId}`).catch((err) => {
    return err.response;
  });
};

export const deleteDislike = async (userId, mapId) => {
  return await api
    .delete(`/api/deleteDislike/${userId}/${mapId}`)
    .catch((err) => {
      return err.response;
    });
};

export const upsertLegend = async (mapId, color, label) => {
  return await api.post('/api/legend', {
    mapId: mapId,
    color: color,
    label: label,
  });
};

export const getAllLegendsByMapId = async (mapId) => {
  return await api.get(`/api/legend/${mapId}`);
};

export const changePublish = async (mapId, published) => {
  return await api
    .post(`/api/publish`, { mapId: mapId, published: published })
    .catch((err) => {
      return err.response;
    });
};

export const getPublished = async (mapId) => {
  return await api.get(`/api/getPublished/${mapId}`).catch((err) => {
    return err.response;
  });
};

export const compress = async (json) => {
  return await api.post(`/api/compress`, { json: json }).catch((err) => {
    return err.response;
  });
};

export const addComment = async (userId, mapId, comment) => {
  return await api
    .post(`/api/addComment`, { userId: userId, mapId: mapId, comment: comment })
    .catch((err) => {
      return err.response;
    });
};

export const getComments = async (mapId) => {
  return await api.get(`/api/getComments/${mapId}`).catch((err) => {
    return err.response;
  });
};

export const deleteComment = async (id) => {
  return await api.delete(`/api/deleteComment/${id}`).catch((err) => {
    return err.response;
  });
};
