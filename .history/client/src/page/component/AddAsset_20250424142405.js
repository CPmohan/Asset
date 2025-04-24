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
