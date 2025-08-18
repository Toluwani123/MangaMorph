import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { motion, AnimatePresence } from "framer-motion";
import { FileText, Edit3, Eye, Calendar, Globe } from "lucide-react";
import { Link } from "react-router-dom";

const statusColors = {
  uploaded: "bg-blue-100 text-blue-800 border-blue-200",
  processing: "bg-amber-100 text-amber-800 border-amber-200",
  published: "bg-emerald-100 text-emerald-800 border-emerald-200"
};

const languageIcons = {
  japanese: "🇯🇵",

  english: "🇺🇸",

};

export default function RecentProjects({ projects, isLoading }) {
    if (isLoading) {
        return (
            <Card className="bg-white/60 backdrop-blur-sm border-0 shadow-lg shadow-slate-200/50">
                <CardHeader>
                <CardTitle className="text-xl font-bold text-slate-800">Recent Projects</CardTitle>
                </CardHeader>
                <CardContent>
                <div className="space-y-4">
                    {Array(3).fill(0).map((_, i) => (
                    <div key={i} className="p-4 rounded-xl bg-slate-100/50 animate-pulse">
                        <div className="h-4 bg-slate-200 rounded mb-2"></div>
                        <div className="h-3 bg-slate-200 rounded w-2/3"></div>
                    </div>
                    ))}
                </div>
                </CardContent>
            </Card>
        );

    }

    return (
        <Card className="bg-white/60 backdrop-blur-sm border-0 shadow-lg shadow-slate-200/50">
            <CardHeader>
                <div className="flex justify-between items-center">
                    <CardTitle className="text-xl font-bold text-slate-800">Recent Projects</CardTitle>
                    <Link to="/dashboard/projects">
                        <Button variant="ghost" size="sm" className="text-slate-600 hover:text-slate-800">
                        View All
                        </Button>
                    </Link>
                </div>
            </CardHeader>
            <CardContent>
                <AnimatePresence>
                    {projects.length === 0 ? (
                        <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-center py-8"
                        >
                            <FileText className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                            <p className="text-slate-500">No projects yet</p>
                            <p className="text-sm text-slate-400 mb-4">Start by uploading your first manga</p>
                            <Link to="/upload">
                                <Button className="bg-gradient-to-r from-slate-800 to-amber-600 hover:from-slate-900 hover:to-amber-700">
                                Upload Manga
                                </Button>
                            </Link>
                        </motion.div>
                    ) : (
                        <div className="space-y-4">
                        {projects.slice(0, 5).map((project, index) => (
                            <motion.div
                            key={project.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="group p-4 rounded-xl bg-slate-50/50 hover:bg-slate-100/50 transition-all duration-200 border border-slate-200/50"
                            >
                            <div className="flex justify-between items-start mb-3">
                                <div>
                                <h3 className="font-semibold text-slate-800 mb-1">{project.title}</h3>
                                <div className="flex items-center gap-3 text-sm text-slate-500">
                                    <div className="flex items-center gap-1">
                                    <Calendar className="w-3 h-3" />
                                    {new Date(project.created_at).toLocaleDateString()}
                                    </div>
                                    <div className="flex items-center gap-1">
                                    <Globe className="w-3 h-3" />
                                    <span>{languageIcons[project.original_language]} → {languageIcons[project.target_language]}</span>
                                    </div>
                                </div>
                                </div>
                                <Badge className={`${statusColors[project.status]} border font-medium`}>
                                {project.status.replace(/_/g, ' ')}
                                </Badge>
                            </div>
                            
                            <div className="mb-3">
                                <div className="flex justify-between text-sm text-slate-600 mb-1">
                                <span>Progress</span>
                                <span>{project.completion_percentage}%</span>
                                </div>
                                <Progress 
                                value={project.completion_percentage} 
                                className="h-2 bg-slate-200"
                                />
                            </div>

                            <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                                <Button size="sm" variant="ghost" className="text-slate-600 hover:text-slate-800">
                                <Eye className="w-3 h-3 mr-1" />
                                View
                                </Button>
                                <Button size="sm" variant="ghost" className="text-slate-600 hover:text-slate-800">
                                <Edit3 className="w-3 h-3 mr-1" />
                                Edit
                                </Button>
                            </div>
                            </motion.div>
                        ))}
                        </div>
                    )}
                </AnimatePresence>
            </CardContent>

        </Card>

    )
}
