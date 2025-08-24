import React, { useState, useEffect } from "react";
import { chaptersApi } from "@/components/OrderChapters";
import { motion, AnimatePresence } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { 
  Search, 
  Filter, 
  Plus, 
  Eye, 
  Edit3, 
  Calendar, 
  Globe,
  FileText,
  Zap 
} from "lucide-react";

import { Link } from "react-router-dom";


const statusColors = {
  uploading: "bg-blue-100 text-blue-800 border-blue-200",
  processing: "bg-amber-100 text-amber-800 border-amber-200",
  ready: "bg-green-100 text-green-800 border-green-200",
  published: "bg-emerald-100 text-emerald-800 border-emerald-200",
  error: "bg-red-100 text-red-800 border-red-200"
};

const languageIcons = {
  ja: "🇯🇵",
  ko: "🇰🇷",
  zh: "🇨🇳",
  en: "🇺🇸",
  es: "🇪🇸",
  fr: "🇫🇷",
  de: "🇩🇪"
};


export default function Projects() {
  const [projects, setProjects] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    setIsLoading(true);
    try {
      const data = await chaptersApi.list("-created_at");
      setProjects(data);
    } catch (error) {
      console.error("Error loading projects:", error);
    }
    setIsLoading(false);
  };

  const filteredProjects = projects.filter(project => {
    const matchesSearch = project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         project.genre?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || project.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const statusCounts = {
        all: projects.length,
        uploading: projects.filter(p => p.status === "uploading").length,
        processing: projects.filter(p => p.status === "processing").length,
        ready: projects.filter(p => p.status === "ready").length,
        published: projects.filter(p => p.status === "published").length,
        error: projects.filter(p => p.status === "error").length
    };


  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array(6).fill(0).map((_, i) => (
              <div key={i} className="bg-white/60 backdrop-blur-sm rounded-xl p-6 animate-pulse">
                <div className="h-4 bg-slate-200 rounded mb-4"></div>
                <div className="h-3 bg-slate-200 rounded mb-2"></div>
                <div className="h-3 bg-slate-200 rounded w-2/3"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8"
        >
          <div>
            <h1 className="text-3xl font-bold text-slate-800">Translation Projects</h1>
            <p className="text-slate-600 mt-1">Manage your manga translation workflow</p>
          </div>
          <Link to="/upload">
            <Button className="bg-gradient-to-r from-slate-800 to-amber-600 hover:from-slate-900 hover:to-amber-700 shadow-lg">
              <Plus className="w-4 h-4 mr-2" />
              New Project
            </Button>
          </Link>
        </motion.div>

        {/* Search and Filter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white/80 backdrop-blur-sm rounded-xl p-6 mb-8 shadow-sm"
        >
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
              <Input
                placeholder="Search projects..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-white/80 border-slate-300"
              />
            </div>
            <div className="flex gap-2 flex-wrap">
              {Object.entries(statusCounts).map(([status, count]) => (
                <Button
                  key={status}
                  variant={statusFilter === status ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setStatusFilter(status)}
                  className={statusFilter === status ? 
                    "bg-gradient-to-r from-slate-800 to-amber-600 text-white" : 
                    "text-slate-600 hover:text-slate-800"
                  }
                >
                  {status === 'all' ? 'All' : status.replace(/_/g, ' ')} ({count})
                </Button>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Projects Grid */}
        <AnimatePresence>
          {filteredProjects.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-16"
            >
              <FileText className="w-16 h-16 text-slate-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-slate-600 mb-2">
                {searchTerm || statusFilter !== 'all' ? 'No projects found' : 'No projects yet'}
              </h3>
              <p className="text-slate-500 mb-6">
                {searchTerm || statusFilter !== 'all' ? 
                  'Try adjusting your search or filter criteria' :
                  'Start your first manga translation project'
                }
              </p>
              {!searchTerm && statusFilter === 'all' && (
                <Link to="/upload">
                  <Button className="bg-gradient-to-r from-slate-800 to-amber-600 hover:from-slate-900 hover:to-amber-700">
                    <Plus className="w-4 h-4 mr-2" />
                    Upload First Manga
                  </Button>
                </Link>
              )}
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {filteredProjects.map((project, index) => (
                <motion.div
                  key={project.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ scale: 1.02 }}
                  className="group"
                >
                  <Card className="bg-white/60 backdrop-blur-sm border-0 shadow-lg shadow-slate-200/50 hover:shadow-xl transition-all duration-300">
                    <CardContent className="p-6">
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex-1 min-w-0">
                          <h3 className="font-bold text-slate-800 text-lg mb-2 truncate">
                            {project.title}
                          </h3>
                          <div className="flex items-center gap-2 text-sm text-slate-500 mb-3">
                            <Calendar className="w-3 h-3" />
                            {new Date(project.created_at).toLocaleDateString()}
                          </div>
                        </div>
                        <Badge className={`${statusColors[project.status]} border font-medium ml-2`}>
                          {project.status.replace(/_/g, ' ')}
                        </Badge>
                      </div>

                      {/* Language Translation */}
                      <div className="flex items-center justify-center gap-3 mb-4 p-3 bg-slate-50/50 rounded-lg">
                        <span className="flex items-center gap-1 text-sm font-medium text-slate-700">
                          {languageIcons[project.source_language]}
                          {project.source_language}
                        </span>
                        <Globe className="w-4 h-4 text-amber-600" />
                        <span className="flex items-center gap-1 text-sm font-medium text-slate-700">
                          {languageIcons[project.target_language]}
                          {project.target_language}
                        </span>
                      </div>

                      {/* Progress */}
                      <div className="mb-4">
                        <div className="flex justify-between text-sm text-slate-600 mb-1">
                          <span>Progress</span>
                          <span>{project.completion_percentage || 0}%</span>
                        </div>
                        <Progress 
                          value={project.completion_percentage || 0} 
                          className="h-2 bg-slate-200"
                        />
                      </div>

                      {/* Metadata */}
                      <div className="space-y-2 mb-4 text-sm text-slate-600">
                        {project.total_pages && (
                          <div className="flex items-center gap-2">
                            <FileText className="w-3 h-3" />
                            <span>{project.total_pages} pages</span>
                          </div>
                        )}
                        {project.genre && (
                          <div className="flex items-center gap-2">
                            <Zap className="w-3 h-3" />
                            <span>{project.genre}</span>
                          </div>
                        )}
                      </div>

                      {/* Actions */}
                      <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                        <Button size="sm" variant="ghost" className="flex-1 text-slate-600 hover:text-slate-800" >
                          <Link to={`/chapter/${project.id}`}>
                            <Eye className="w-3 h-3 mr-1" />
                            View
                          </Link>
                        </Button>
                        <Button size="sm" variant="ghost" className="flex-1 text-slate-600 hover:text-slate-800">
                          <Edit3 className="w-3 h-3 mr-1" />
                          Edit
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}