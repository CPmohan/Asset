import axios from 'axios';

const API_URL = 'http://localhost:8080/api';

export const createAsset = async (assetData) => {
  try {
    // Convert files to server format
    const files = assetData.files.map(file => ({
      name: file.file.name,
      type: file.type,
      url: URL.createObjectURL(file.file) // Or upload to storage first
    }));

    const response = await axios.post(`${API_URL}/assets`, {
      name: assetData.name,
      group: assetData.group.map(g => g.label).join(','), // or handle multiple groups
      quantity: parseInt(assetData.quantity),
      files
    });
    return response.data;
  } catch (error) {
    console.error('Error creating asset:', error);
    throw error;
  }
};

export const getAllAssets = async () => {
  try {
    const response = await axios.get(`${API_URL}/assets`);
    return response.data;
  } catch (error) {
    console.error('Error fetching assets:', error);
    throw error;
  }
};

export const getAssetsByGroup = async (group) => {
  try {
    const response = await axios.get(`${API_URL}/assets/group/${group}`);
    return response.data.assets;
  } catch (error) {
    console.error('Error fetching group assets:', error);
    throw error;
  }
};

export const getAssetByName = async (group, name) => {
  try {
    const response = await axios.get(`${API_URL}/assets/${group}/${name}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching asset:', error);
    throw error;
  }
};