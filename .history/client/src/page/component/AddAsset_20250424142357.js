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
