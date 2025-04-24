import CustomButton from "compounds/button";
import CustomEditSelect from "compounds/select-edit";
import InputBox from "compounds/input";
import React, { useState } from "react";
import { X } from "lucide-react";
import { useNavigate } from "react-router-dom";

const AddAssetPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    quantity: "",
    group: [],
    fileTypes: [],
    files: [],
  });

  const [currentFileType, setCurrentFileType] = useState(null);

  function onChange(field, value) {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  }

  function handleFileChange(e) {
    const newFiles = Array.from(e.target.files);
    if (!currentFileType) {
      alert("Please select a file type before uploading.");
      return;
    }

    const filesWithType = newFiles.map((file) => ({
      file,
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
  }

  function removeFile(index) {
    const updatedFiles = [...formData.files];
    updatedFiles.splice(index, 1);

    const remainingTypes = updatedFiles.map((f) => f.typeValue);
    const updatedTypes = formData.fileTypes.filter((t) =>
      remainingTypes.includes(t.value)
    );

    setFormData((prev) => ({
      ...prev,
      files: updatedFiles,
      fileTypes: updatedTypes,
    }));
  }

  async function handleCreateAsset() {
    // Validation: Ensure that all required fields are filled
    if (!formData.name || formData.name.trim() === "") {
      alert("Please enter a name for the asset.");
      return;
    }
    if (!formData.quantity || formData.quantity <= 0) {
      alert("Please enter a valid quantity.");
      return;
    }
    if (formData.group.length === 0) {
      alert("Please select at least one group.");
      return;
    }
    if (formData.fileTypes.length === 0) {
      alert("Please select at least one file type.");
      return;
    }

    const expectedTypes = formData.fileTypes.map((t) => t.value);
    const uploadedTypes = formData.files.map((f) => f.typeValue);

    const missing = expectedTypes.filter((type) => !uploadedTypes.includes(type));

    if (missing.length > 0) {
      alert(`Please upload files for: ${missing.join(", ")}`);
      return;
    }

    const data = new FormData();

    const metadata = {
      name: formData.name,
      quantity: parseInt(formData.quantity),
      group: formData.group.map((g) => g.value),
      fileTypes: formData.fileTypes,
      files: formData.files.map((f) => ({
        filename: f.file.name,
        type: f.type,
        typeValue: f.typeValue,
      })),
    };

    data.append("metadata", JSON.stringify(metadata));

    formData.files.forEach((f) => {
      data.append("files", f.file);
    });

    try {
      const response = await fetch("http://localhost:8080/api/assets", {
        method: "POST",
        body: data,
      });

      if (!response.ok) throw new Error("Failed to create asset");

      alert("Asset created successfully!");
      console.log(await response.text());

      // ✅ Reset the form after successful asset creation
      setFormData({
        name: "",
        quantity: "",
        group: [],
        fileTypes: [],
        files: [],
      });
      setCurrentFileType(null);

      // Navigate to the asset detail page to view uploaded files
      if (formData.group.length > 0) {
        const firstGroup = formData.group[0].value || formData.group[0];
        navigate(`/assets/${firstGroup}/${formData.name}`);
      }
    } catch (err) {
      console.error("Error submitting asset:", err);
      alert("There was a problem creating the asset.");
    }
  }

  return (
    <div className="bg-gray-100 min-h-screen p-4">
      <div className="bg-white shadow-md rounded-lg p-8 w-full max-w-full">
        <h2 className="font-medium text-xl mb-6">ADD ASSET</h2>

        <div className="mb-4">
          <InputBox
            label="Name"
            placeholder="Enter Name"
            type="text"
            value={formData.name}
            onChange={(val) => onChange("name", val)}
            className="w-full"
          />
        </div>

        <div className="mb-4">
