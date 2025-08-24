import React, { useRef } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Upload, FileArchive, Zap, CheckCircle } from "lucide-react";

export default function FileUpload({
  onFileSelect,
  dragActive,
  onDragEnter,
  onDragLeave,
  onDragOver,
  onDrop,
}) {
  const fileInputRef = useRef(null);

  const handleBrowseClick = () => {
    fileInputRef.current?.click();
  };

  const features = [
    "ZIP & CBZ file support",
    "High-resolution page extraction",
    "Automated OCR processing",
    "Multi-language detection",
  ];

  return (
    <div
      className={`relative transition-all duration-300 rounded-2xl border-2 border-dashed p-8 ${
        dragActive
          ? "border-amber-400 bg-gradient-to-br from-amber-50 to-amber-100/50 scale-105"
          : "border-slate-300 bg-white/80 backdrop-blur-sm hover:border-slate-400 hover:bg-white/90"
      }`}
      onDragEnter={onDragEnter}
      onDragLeave={onDragLeave}
      onDragOver={onDragOver}
      onDrop={onDrop}
    >
      <input
        ref={fileInputRef}
        type="file"
        accept=".zip,.cbz"
        onChange={onFileSelect}
        className="hidden"
      />

      <div className="text-center">
      <motion.div
        animate={dragActive ? { scale: 1.1 } : { scale: 1 }}
        className={`w-20 h-20 mx-auto mb-6 rounded-2xl flex items-center justify-center ${
          dragActive
            ? "bg-gradient-to-r from-amber-500 to-amber-600 shadow-lg"
            : "bg-gradient-to-r from-slate-600 to-slate-700 shadow-md"
        }`}
      >
        {dragActive ? (
          <Zap className="w-10 h-10 text-white animate-pulse" />
        ) : (
          <FileArchive className="w-10 h-10 text-white" />
        )}
      </motion.div>

      <h3 className="text-2xl font-bold text-slate-800 mb-3">
        {dragActive ? "Drop your manga here!" : "Upload Your Manga"}
      </h3>

      <p className="text-slate-600 mb-6 max-w-md mx-auto leading-relaxed">
        Drag and drop your ZIP or CBZ file here, or click to browse. Our AI will
        automatically extract and process your manga pages.
      </p>

      <Button
        onClick={handleBrowseClick}
        className="bg-gradient-to-r from-slate-800 to-amber-600 hover:from-slate-900 hover:to-amber-700 text-white px-8 py-3 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
      >
        <Upload className="w-5 h-5 mr-2" />
        Choose File
      </Button>

      <div className="mt-8 grid grid-cols-2 gap-4 max-w-md mx-auto">
        {features.map((feature, index) => (
          <motion.div
            key={feature}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="flex items-center gap-2 text-sm text-slate-600"
          >
            <CheckCircle className="w-4 h-4 text-green-500" />
            <span>{feature}</span>
          </motion.div>
        ))}
      </div>

      <p className="text-xs text-slate-400 mt-6">
        Supported: ZIP, CBZ • Max size: 250MB
      </p>
      <p className="text-xs text-slate-400 mt-6" >Files have to be png or jpg images.</p>
        
      
      </div>
    </div>
  );
}
