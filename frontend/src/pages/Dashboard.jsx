import React, {useState, useEffect} from "react";
import { motion } from "framer-motion";
import { FileText, Zap, Eye, Globe, TrendingUp } from "lucide-react";

import QuickActions from "../components/dashboard/QuickActions";
import RecentProjects from "../components/dashboard/RecentProjects";
import StatsCard from "../components/dashboard/StatsCard";
import api from "../api";

export default function Dashboard() {
    const [projects, setProjects] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchProjects = async () => {
            try {
                const response = await api.get("/chapters/");
                setProjects(response.data);
            } catch (error) {
                console.error("Error fetching projects:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchProjects();
    }, []);

    const stats = {
        totalProjects: projects.length,
        activeProjects: projects.filter(p => ['processing', 'editing'].includes(p.status)).length,
        completedProjects: projects.filter(p => p.status === 'published' || p.status === 'ready').length,
        totalPages: projects.reduce((sum, p) => sum + (p.total_pages || 0), 0)
    };



    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
            <div className="px-6 py-8 max-w-7xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-8"
                >
                    <h1 className="text-4xl font-bold text-slate-800 mb-2">
                        Welcome to MangaMorph
                    </h1>
                    <p className="text-lg text-slate-600">
                        AI-powered manga translation studio for professional results
                    </p>
                </motion.div>
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
                >
                    <StatsCard
                        title="Total Projects"
                        value={stats.totalProjects}
                        icon={FileText}
                        gradient="bg-gradient-to-r from-blue-500 to-blue-600"
                        trend="All time"
                    />
                    <StatsCard
                        title="Active Projects"
                        value={stats.activeProjects}
                        icon={Zap}
                        gradient="bg-gradient-to-r from-amber-500 to-amber-600"
                        trend="In progress"
                    />
                    <StatsCard
                        title="Completed"
                        value={stats.completedProjects}
                        icon={Eye}
                        gradient="bg-gradient-to-r from-green-500 to-green-600"
                        trend="Published"
                    />
                    <StatsCard
                        title="Total Pages"
                        value={stats.totalPages}
                        icon={TrendingUp}
                        gradient="bg-gradient-to-r from-purple-500 to-purple-600"
                        trend="Across all projects"
                    />
                </motion.div>

                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Recent Projects */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 }}
                        className="lg:col-span-2"
                    >
                        <RecentProjects projects={projects} isLoading={isLoading} />
                    </motion.div>

                    {/* Quick Actions */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3 }}
                    >
                        <QuickActions />
                    </motion.div>
                </div>
                {!isLoading && projects.length === 0 && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        className="mt-12 text-center"
                    >
                        <div className="max-w-2xl mx-auto">
                        <div className="w-16 h-16 bg-gradient-to-r from-slate-800 to-amber-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                            <Globe className="w-8 h-8 text-white" />
                        </div>
                        <h2 className="text-2xl font-bold text-slate-800 mb-4">
                            Ready to Transform Manga?
                        </h2>
                        <p className="text-slate-600 mb-8 text-lg leading-relaxed">
                            Upload your first manga file and let our AI handle the heavy lifting. 
                            From OCR text extraction to professional translation and typesetting - 
                            everything you need for professional manga localization.
                        </p>
                        <div className="p-6 bg-gradient-to-r from-slate-50 to-amber-50 rounded-2xl border border-slate-200/50">
                            <h3 className="font-semibold text-slate-800 mb-2">Supported Formats</h3>
                            <p className="text-slate-600 text-sm">
                            ZIP, CBZ files with high-resolution manga pages
                            </p>
                        </div>
                        </div>
                    </motion.div>
                )}

            </div>

        </div>
    );
}

