import axios from "axios";

const API_BASE_URL = "http://localhost:8080/api";

/**
 * Uploads a new asset along with its files.
 * @param {FormData} formData – multipart form data containing 'metadata' and file blobs.
 * @returns {Promise<AxiosResponse>} the server response
 */
export const createAsset = async (formData) => {
  return axios.post(
    `${API_BASE_URL}/assets`,
    formData,
    { headers: { "Content-Type": "multipart/form-data" } }
  );
};

/**
 * Fetches a single asset by group and asset name.
 * @param {string} groupName – name of the group (e.g. "electronics")
 * @param {string} assetName – name of the asset
 * @returns {Promise<object>} the complete asset object with files
 */
export const getAsset = async (groupName, assetName) => {
  const { data } = await axios.get(
    `${API_BASE_URL}/assets/${groupName}/${assetName}`
  );
  
  // Transform the backend response to match frontend expectations
  return {
    ...data,
    group: data.Group && data.Group.length > 0 ? data.Group[0] : '', // Take first group if available
    files: data.Files ? data.Files.map(file => ({
      name: file.Filename.split('/').pop(),
      type: file.Type,
      url: file.Filename,
      typeValue: file.TypeValue
    })) : []
  };
};

/**
 * Fetches all assets in the given group.
 * @param {string} groupName – name of the group (e.g. "Electronics")
 * @returns {Promise<object[]>} array of asset objects
 */
export const getAssetsByGroup = async (groupName) => {
  const { data } = await axios.get(
    `${API_BASE_URL}/assets/group/${encodeURIComponent(groupName)}`
  );
  
  // Transform each asset to match frontend expectations
  return data.assets.map(asset => ({
    ...asset,
    group: asset.Group && asset.Group.length > 0 ? asset.Group[0] : '' // Take first group if available
  }));
};

/**
 * Downloads a file from the server.
 * @param {string} filePath – the file path (e.g. "/uploads/filename.ext")
 * @returns {Promise<AxiosResponse>} the file response
 */
export const downloadFile = async (filePath) => {
  return axios.get(`${API_BASE_URL}${filePath}`, {
    responseType: 'blob' // Important for file downloads
  });
};

/**
 * Deletes an asset by its ID.
 * @param {number|string} id – the asset's database ID
 * @returns {Promise<AxiosResponse>} the server response
 */
export const deleteAsset = async (id) => {
  return axios.delete(`${API_BASE_URL}/assets/${id}`);
};