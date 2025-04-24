import { createAsset } from 'api/asset';
import CustomButton from 'compounds/button';
import CustomEditSelect from 'compounds/select-edit';
import InputBox from 'compounds/input';
import React, { useState } from 'react';
import { X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const AddAssetPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    quantity: "",
    group: null,
    files: [],
  });

  const [currentFileType, setCurrentFileType] = useState(null);
  const navigate = useNavigate();

  const handleFileChange = (e) => {
    const newFiles = Array.from(e.target.files);
    if (!currentFileType) {
      alert("Please select a file type before uploading.");
      return;
    }

    const filesWithType = newFiles.map((file) => ({
      file,
      file_type: currentFileType.value,
    }));

    setFormData(prev => ({
      ...prev,
      files: [...prev.files, ...filesWithType]
    }));

    e.target.value = null;
  };

  const removeFile = (index) => {
    const updatedFiles = [...formData.files];
    updatedFiles.splice(index, 1);
    setFormData(prev => ({ ...prev, files: updatedFiles }));
  };

  const handleCreateAsset = async () => {
    try {
      // Construct metadata object as expected by backend
      const metadata = {
        name: formData.name,
        quantity: parseInt(formData.quantity, 10),
        group: formData.group ? [formData.group.label] : [],
        fileTypes: formData.files.map(f => ({
          filename: f.file.name,
          type: f.file_type,
          typeValue: f.file_type,
        })),
        files: formData.files.map(f => ({
          filename: f.file.name,
          type: f.file_type,
          typeValue: f.file_type,
        })),
      };

      const formPayload = new FormData();
      formPayload.append('metadata', JSON.stringify(metadata));

      formData.files.forEach((fileObj, index) => {
        formPayload.append('files', fileObj.file);
      });

      const response = await createAsset(formPayload);
      alert("Asset created successfully!");

      // Reset form
      setFormData({
        name: "",
        quantity: "",
        group: null,
        files: [],
      });
      setCurrentFileType(null);

      // Navigate to GroupAssetDetail page to reflect new asset
      navigate(`/group/${formData.group.label}`);
      // if (formData.group) {
      //   navigate(`/group/${formData.group.label}`);
      // }

    } catch (error) {
      if (error.response) {
        console.error("Error response data:", error.response.data);
        console.error("Error response status:", error.response.status);
        console.error("Error response headers:", error.response.headers);
      } else {
        console.error("Error creating asset:", error.message);
      }
      alert("Failed to create asset: " + (error.response?.data?.message || error.message));
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen p-4">
      <div className="bg-white shadow-md rounded-lg p-8 w-full max-w-full">
        <h2 className="font-medium text-xl mb-6">ADD ASSET</h2>

        {/* Name Input */}
        <div className="mb-4">
          <InputBox
            label="Name"
            placeholder="Enter Name"
            value={formData.name}
            onChange={(val) => setFormData({...formData, name: val})}
          />
        </div>

        {/* Group Selection */}
        <div className="mb-4">
          <CustomEditSelect
            label="Select Group"
            value={formData.group}
            onChange={(val) => setFormData({...formData, group: val})}
            options={[
              { value: 1, label: "Infrastructure" },
              { value: 2, label: "Transport" },
              { value: 3, label: "Electronics" },
              { value: 4, label: "Laboratory" },
            ]}
            placeholder="Select a Group"
            return="target"
          />
        </div>

        {/* Quantity Input */}
        <div className="mb-4">
          <InputBox
            label="Quantity"
            placeholder="Enter Quantity"
            type="number"
            value={formData.quantity}
            onChange={(val) => setFormData({...formData, quantity: val})}
          />
        </div>

        {/* File Type Selection */}
        <div className="mb-4">
          <CustomEditSelect
            label="Select File Type"
            value={currentFileType}
            onChange={setCurrentFileType}
            options={[
              { value: "image", label: "Image" },
              { value: "aadhar", label: "Aadhar Card" },
              { value: "license", label: "Driving License" },
            ]}
            placeholder="Choose File Type"
            return="target"
          />
        </div>

        {/* File Upload */}
        <div className="mb-4">
          <label className="block font-medium mb-1">Upload File</label>
          <input 
            type="file" 
            onChange={handleFileChange} 
            className="w-full" 
            multiple
          />

          {formData.files.length > 0 && (
            <div className="mt-2 space-y-1">
              {formData.files.map((file, index) => (
                <div key={index} className="flex items-center justify-between p-2 bg-gray-100 border rounded">
                  <span className="text-sm text-gray-800">
                    {file.file.name} ({file.file_type})
                  </span>
                  <button
                    type="button"
                    onClick={() => removeFile(index)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <X size={16} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4 mt-4">
          <CustomButton
            label="Create New Asset"
            onClick={handleCreateAsset}
          />
          <button
            type="button"
            className="py-2 px-4 bg-gray-300 text-black rounded-md hover:bg-gray-400 transition"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddAssetPage;
