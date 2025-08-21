import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { motion } from "framer-motion";
import { Settings, Zap, ArrowRight } from "lucide-react";

const languages = [
  { value: "ja", label: "Japanese 🇯🇵", flag: "🇯🇵" },
  { value: "ko", label: "Korean 🇰🇷", flag: "🇰🇷" },
  { value: "zh", label: "Chinese 🇨🇳", flag: "🇨🇳" },
  { value: "en", label: "English 🇺🇸", flag: "🇺🇸" },
  { value: "es", label: "Spanish 🇪🇸", flag: "🇪🇸" },
  { value: "fr", label: "French 🇫🇷", flag: "🇫🇷" },
  { value: "de", label: "German 🇩🇪", flag: "🇩🇪" },
  { value: "other", label: "Other", flag: "🌐" },
];

export default function ProjectSetupForm({ fileName, onSubmit, isProcessing }) {
  const [formData, setFormData] = useState({
    title: fileName?.replace(/\.(zip|cbz)$/i, "") || "",
    original_language: "ja",
    target_language: "en",
    genre: "",
    notes: "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl shadow-slate-200/50">
        <CardHeader className="pb-4">
          <CardTitle className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <Settings className="w-5 h-5 text-amber-500" />
            Project Setup
          </CardTitle>
          <p className="text-sm text-slate-600">
            Configure your manga translation project settings
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title" className="text-slate-700 font-medium">
                Project Title *
              </Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => handleChange("title", e.target.value)}
                placeholder="Enter manga title"
                className="bg-white/80 border-slate-300 focus:border-amber-500 focus:ring-amber-500"
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label className="text-slate-700 font-medium">
                  Original Language *
                </Label>
                <Select
                  value={formData.original_language}
                  onValueChange={(value) =>
                    handleChange("original_language", value)
                  }
                >
                  <SelectTrigger className="bg-white/80 border-slate-300 focus:border-amber-500">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {languages.map((lang) => (
                      <SelectItem key={lang.value} value={lang.value}>
                        {lang.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="text-slate-700 font-medium">
                  Target Language *
                </Label>
                <Select
                  value={formData.target_language}
                  onValueChange={(value) =>
                    handleChange("target_language", value)
                  }
                >
                  <SelectTrigger className="bg-white/80 border-slate-300 focus:border-amber-500">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {languages.map((lang) => (
                      <SelectItem key={lang.value} value={lang.value}>
                        {lang.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="p-4 bg-gradient-to-r from-slate-50 to-amber-50 rounded-xl border border-slate-200/50">
              <div className="flex items-center justify-center gap-4 text-lg">
                <span className="flex items-center gap-2 font-medium text-slate-700">
                  {languages.find((l) => l.value === formData.original_language)
                    ?.flag}
                  {
                    languages
                      .find((l) => l.value === formData.original_language)
                      ?.label.split(" ")[0]
                  }
                </span>
                <ArrowRight className="w-5 h-5 text-amber-600" />
                <span className="flex items-center gap-2 font-medium text-slate-700">
                  {languages.find((l) => l.value === formData.target_language)
                    ?.flag}
                  {
                    languages
                      .find((l) => l.value === formData.target_language)
                      ?.label.split(" ")[0]
                  }
                </span>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="genre" className="text-slate-700 font-medium">
                Genre (Optional)
              </Label>
              <Input
                id="genre"
                value={formData.genre}
                onChange={(e) => handleChange("genre", e.target.value)}
                placeholder="e.g. Action, Romance, Comedy"
                className="bg-white/80 border-slate-300 focus:border-amber-500 focus:ring-amber-500"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes" className="text-slate-700 font-medium">
                Project Notes (Optional)
              </Label>
              <Textarea
                id="notes"
                value={formData.notes}
                onChange={(e) => handleChange("notes", e.target.value)}
                placeholder="Any specific translation instructions or notes"
                className="bg-white/80 border-slate-300 focus:border-amber-500 focus:ring-amber-500 h-24 resize-none"
              />
            </div>

            <Button
              type="submit"
              disabled={isProcessing || !formData.title.trim()}
              className="w-full bg-gradient-to-r from-slate-800 to-amber-600 hover:from-slate-900 hover:to-amber-700 text-white py-3 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
            >
              {isProcessing ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Creating Project...
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Zap className="w-5 h-5" />
                  Create Translation Project
                </div>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </motion.div>
  );
}
