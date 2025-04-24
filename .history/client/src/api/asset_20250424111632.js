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
 * Fetches a single asset by its ID.
 * @param {number|string} id – the asset’s database ID
 * @returns {Promise<AxiosResponse>} the server response
 */
export const getAssetById = async (id) => {
  return axios.get(`${API_BASE_URL}/assets/${id}`);
};

/**
 * Fetches all assets in the given group.
 * Unwraps the server’s { assets, total_assets } payload and returns just the array.
 * @param {string} groupName – name of the group (e.g. "Electronics")
 * @returns {Promise<object[]>} array of asset objects
 */
export const getAssetsByGroup = async (groupName) => {
  const { data } = await axios.get(
    `${API_BASE_URL}/assets/group/${groupName}`
  );
  // data = { assets: [...], total_assets: N }
  console.log("Assets fetched for group:", data.assets);
  return data.assets;
};

// In your asset-detail.js
axios.get(`/api/assets/${groupName}/${assetName}`)
  .then((res) => {
    const assetData = res.data;
    // Transform files to match frontend expectations
    const transformedAsset = {
      ...assetData,
      files: assetData.Files.map(file => ({
        name: file.Filename.split('/').pop(), // Just the filename
        type: file.Type,
        url: file.Filename // Full path including /uploads/
      }))
    };
    setAsset(transformedAsset);
  })
  .catch((err) => {
    console.error("Failed to fetch asset:", err);
  });