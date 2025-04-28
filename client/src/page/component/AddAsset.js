import CustomButton from "compounds/button";
import CustomEditSelect from "compounds/select-edit";
import InputBox from "compounds/input";
import React, { useState } from "react";
import { X } from "lucide-react";

const AddAssetPage = () => {
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
          <CustomEditSelect
            label="Select Group"
            isMulti={true}
            return="target"
            value={formData.group}
            onChange={(val) => onChange("group", val || [])}
            options={[
              { value: "INFRASTRUCTURE", label: "Infrastructure" },
              { value: "TRANSPORT", label: "Transport" },
              { value: "ELECTRONICS", label: "Electronics" },
              { value: "LABORATORY", label: "Laboratory" },
              { value: "SPORTS", label: "Sports" },
            ]}
            placeholder="Select a Group"
            width="100%"
            margin={5}
          />
        </div>

        <div className="mb-4">
          <InputBox
            label="Quantity"
            placeholder="Enter Quantity"
            type="number"
            value={formData.quantity}
            onChange={(val) => onChange("quantity", val)}
            className="w-full"
          />
        </div>

        <div className="mb-4">
          <CustomEditSelect
            label="Select File Type"
            isMulti={false}
            return="target"
            value={currentFileType}
            onChange={(val) => setCurrentFileType(val)}
            options={[
              { value: "image", label: "Image" },
              { value: "aadhar", label: "Aadhar Card" },
              { value: "license", label: "Driving License" },
            ]}
            placeholder="Choose File Type"
            width="100%"
            margin={5}
          />
        </div>

        <div className="mb-4">
          <label className="block font-medium mb-1">Upload File</label>
          <input type="file" onChange={handleFileChange} className="w-full" />
          {formData.files.length > 0 && (
            <div className="mt-2 space-y-1">
              {formData.files.map((f, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-2 bg-gray-100 border rounded"
                >
                  <span className="text-sm text-gray-800">
                    {f.file.name} ({f.type})
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

        <div className="flex gap-4 mt-4">
          <CustomButton
            danger={0}
            smallFont={0}
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
