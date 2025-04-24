import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api';

export const createAsset = async (formData) => {
  return axios.post(${API_BASE_URL}/assets, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

export const getAssetById = async (id) => {
  return axios.get(${API_BASE_URL}/assets/${id});
};

export const getAssetsByGroup = async (groupName) => {
  const response = await axios.get(${API_BASE_URL}/assets/group/${groupName});
  console.log("Assets fetched for group:", response.data); // Log the response data
  return response;
};