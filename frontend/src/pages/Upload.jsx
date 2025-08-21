import React, { useState, useCallback } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowLeft, FileText } from "lucide-react";
import { useNavigate } from "react-router-dom";
import api from "@/api";

import FileUpload from "../components/upload/FileUpload";
import ProjectSetupForm from "../components/upload/ProjectSetupForm";


export default function Upload() {
  const navigate = useNavigate();
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [error, setError] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const handleDrag = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDragEnter = useCallback(
    (e) => {
      handleDrag(e);
      setDragActive(true);
    },
    [handleDrag]
  );

  const handleDragLeave = useCallback(
    (e) => {
      handleDrag(e);
      setDragActive(false);
    },
    [handleDrag]
  );

  const handleDragOver = useCallback(
    (e) => {
      handleDrag(e);
      setDragActive(true);
    },
    [handleDrag]
  );

  const handleDrop = useCallback(
    (e) => {
      handleDrag(e);
      setDragActive(false);
      const files = Array.from(e.dataTransfer.files);
      const validFile = files.find(
        (file) =>
          file.type === "application/zip" ||
          file.name.toLowerCase().endsWith(".zip") ||
          file.name.toLowerCase().endsWith(".cbz")
      );
      if (validFile) setSelectedFile(validFile);
      else setError("Please upload a ZIP or CBZ file");
    },
    [handleDrag]
  );

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) setSelectedFile(file);
  };

  const handleProjectSubmit = async (projectData) => {
    if (!selectedFile) return;
    setIsUploading(true);
    setError("");
    setUploadProgress(0);

    const formData = new FormData();
    formData.append("title", projectData.title);
    if (projectData.notes)
      formData.append("description", projectData.notes);
    formData.append("source_language", projectData.original_language);
    formData.append("target_language", projectData.target_language);
    formData.append("original_file", selectedFile);

    try {
      await api.post("/chapters/", formData, {
        headers: { "Content-Type": "multipart/form-data" },
        onUploadProgress: (evt) => {
          if (evt.total) {
            const percent = Math.round((evt.loaded * 100) / evt.total);
            setUploadProgress(percent);
          }
        },
      });
      navigate("/dashboard");
    } catch (err) {
      setError("Failed to create project. Please try again.");
      setIsUploading(false);
    }
  };

  const resetUpload = () => {
    setSelectedFile(null);
    setUploadProgress(0);
    setIsUploading(false);
    setError("");
  };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
            <div className="max-w-4xl mx-auto">
                <div className="flex items-center gap-4 mb-8">
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => navigate("/dashboard")}
                    className="hover:bg-white/80"
                >
                    <ArrowLeft className="w-5 h-5" />
                </Button>
                <div>
                    <h1 className="text-3xl font-bold text-slate-800">Upload Manga</h1>
                    <p className="text-slate-600 mt-1">
                    Start a new translation project
                    </p>
                </div>
                </div>

                {error && <div className="mb-6 text-red-600">{error}</div>}

                {!selectedFile && (
                <FileUpload
                    onFileSelect={handleFileSelect}
                    dragActive={dragActive}
                    onDragEnter={handleDragEnter}
                    onDragLeave={handleDragLeave}
                    onDragOver={handleDragOver}
                    onDrop={handleDrop}
                />
                )}

                {selectedFile && !isUploading && (
                <ProjectSetupForm
                    fileName={selectedFile.name}
                    onSubmit={handleProjectSubmit}
                    isProcessing={isUploading}
                />
                )}

                {isUploading && (
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 text-center shadow-xl shadow-slate-200/50">
                    <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="w-16 h-16 bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4"
                    >
                    <FileText className="w-8 h-8 text-white" />
                    </motion.div>
                    <h3 className="text-xl font-bold text-slate-800 mb-2">
                    Uploading File
                    </h3>
                    <p className="text-slate-600 mb-6">{selectedFile.name}</p>
                    <div className="max-w-xs mx-auto">
                    <div className="bg-slate-200 rounded-full h-2 overflow-hidden">
                        <motion.div
                        className="h-full bg-gradient-to-r from-blue-500 to-blue-600"
                        initial={{ width: 0 }}
                        animate={{ width: `${uploadProgress}%` }}
                        transition={{ duration: 0.3 }}
                        />
                    </div>
                    <p className="text-sm text-slate-500 mt-2">
                        {uploadProgress}% complete
                    </p>
                    </div>
                </div>
                )}

                {selectedFile && !isUploading && (
                <div className="flex justify-center mt-6">
                    <Button
                    variant="ghost"
                    onClick={resetUpload}
                    className="text-slate-600 hover:text-slate-800"
                    >
                    Upload Different File
                    </Button>
                </div>
                )}
            </div>
        </div>
    );
}