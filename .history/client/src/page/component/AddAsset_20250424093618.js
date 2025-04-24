import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { X } from "lucide-react";

import { createAsset } from "api/asset";
import CustomButton from "compounds/button";
import CustomEditSelect from "compounds/select-edit";
import InputBox from "compounds/input";

const AddAssetPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    quantity: "",
    group: [],
    fileTypes: [],
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
      type: currentFileType.label,
      typeValue: currentFileType.value,
    }));

    const updatedFiles = [...formData.files, ...filesWithType];
    const updatedTypes = formData.fileTypes.some(
      (t) => t.value === currentFileType.value
    )
      ? formData.fileTypes
      : [...formData.fileTypes, currentFileType];

    setFormData((prev) => ({
      ...prev,
      files: updatedFiles,
      fileTypes: updatedTypes,
    }));

    e.target.value = null;
    setCurrentFileType(null);
  };

  const removeFile = (index) => {
    const updatedFiles = [...formData.files];
    updatedFiles.splice(index, 1);

    const remainingTypes = updatedFiles.map((f) => f.file_type);
    const updatedTypes = formData.fileTypes.filter((t) =>
      remainingTypes.includes(t.value)
    );

    setFormData((prev) => ({
      ...prev,
      files: updatedFiles,
      fileTypes: updatedTypes,
    }));
  };

  const handleCreateAsset = async () => {
    const expectedTypes = formData.fileTypes.map((t) => t.value);
    const uploadedTypes = formData.files.map((f) => f.file_type);

    const missing = expectedTypes.filter(
      (type) => !uploadedTypes.includes(type)
    );

    if (missing.length > 0) {
      alert(`Please upload files for: ${missing.join(", ")}`);
      return;
    }

    const metadata = {
      name: formData.name,
      quantity: parseInt(formData.quantity, 10),
      group: formData.group.map((g) => g.label),
      fileTypes: formData.fileTypes,
      files: formData.files.map((f) => ({
        filename: f.file.name,
        type: f.type,
        typeValue: f.typeValue,
      })),
    };

    const formPayload = new FormData();
    formPayload.append("metadata", JSON.stringify(metadata));
    formData.files.forEach((fObj) => formPayload.append("files", fObj.file));

    try {
      await createAsset(formPayload);
      alert("Asset created successfully!");

      const groups = formData.group.map((g) => g.label);
      setFormData({ name: "", quantity: "", group: [], fileTypes: [], files: [] });
      setCurrentFileType(null);

      if (groups.length === 1) {
        navigate(`/group/${groups[0]}`);
      } else {
        navigate("/");
      }
    } catch (error) {
      console.error("Create asset failed:", error.response?.data || error.message);
      alert("Failed to create asset: " + (error.response?.data || error.message));
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen p-4">
      <div className="bg-white shadow-md rounded-lg p-8 max-w-2xl mx-auto">
        <h2 className="text-xl font-medium mb-6">ADD ASSET</h2>

        {/* Name */}
        <div className="mb-4">
          <InputBox
            label="Name"
            placeholder="Enter Name"
            value={formData.name}
            onChange={(val) => setFormData({ ...formData, name: val })}
          />
        </div>

        {/* Group */}
        <div className="mb-4">
          <CustomEditSelect
            label="Select Group"
            isMulti={true}
            return="target"
            value={formData.group}
            onChange={(val) => setFormData({ ...formData, group: val || [] })}
            options={[
              { value: 1, label: "Infrastructure" },
              { value: 2, label: "Transport" },
              { value: 3, label: "Electronics" },
              { value: 4, label: "Laboratory" },
            ]}
            placeholder="Select a Group"
          />
        </div>

        {/* Quantity */}
        <div className="mb-4">
          <InputBox
            label="Quantity"
            type="number"
            placeholder="Enter Quantity"
            value={formData.quantity}
            onChange={(val) => setFormData({ ...formData, quantity: val })}
          />
        </div>

        {/* File Type */}
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
            multiple
            onChange={handleFileChange}
            className="w-full"
          />
          {formData.files.length > 0 && (
            <div className="mt-2 space-y-2">
              {formData.files.map((f, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between p-2 bg-gray-100 border rounded"
                >
                  <span className="text-sm">
                    {f.file.name} ({f.type})
                  </span>
                  <button
                    type="button"
                    onClick={() => removeFile(i)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <X size={16} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex gap-4 mt-6">
          <CustomButton label="Create New Asset" onClick={handleCreateAsset} />
          <button
            type="button"
            className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
            onClick={() => navigate("/")}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddAssetPage;
