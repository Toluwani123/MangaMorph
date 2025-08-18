import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Upload, FolderOpen, FileText, Zap, Globe } from "lucide-react";
import { Link } from "react-router-dom";


const actions = [
  {
    title: "Upload New Manga",
    description: "Start a new translation project",
    icon: Upload,
    href: "/upload",
    gradient: "from-blue-500 to-blue-600",
    delay: 0
  },
  {
    title: "Browse Projects",
    description: "View all your manga projects",
    icon: FolderOpen,
    href: "/projects",
    gradient: "from-purple-500 to-purple-600",
    delay: 0.1
  },
  {
    title: "OCR Processing",
    description: "Extract text from manga pages",
    icon: FileText,
    href: "#",
    gradient: "from-green-500 to-green-600",
    delay: 0.2
  },
  {
    title: "Auto Translate",
    description: "AI-powered translation",
    icon: Globe,
    href: "#",
    gradient: "from-amber-500 to-amber-600",
    delay: 0.3
  }
];

export default function QuickActions() {
  return (
    <Card className="bg-white/60 backdrop-blur-sm border-0 shadow-lg shadow-slate-200/50">
      <CardHeader>
        <CardTitle className="text-xl font-bold text-slate-800 flex items-center gap-2">
          <Zap className="w-5 h-5 text-amber-500" />
          Quick Actions
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {actions.map((action, index) => (
            <motion.div
              key={action.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: action.delay }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Link to={action.href}>
                <Button
                  variant="ghost"
                  className="w-full h-auto p-4 text-left hover:bg-slate-100/50 group"
                >
                  <div className="flex items-start gap-3">
                    <div className={`p-2 rounded-lg bg-gradient-to-r ${action.gradient} shadow-sm`}>
                      <action.icon className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-slate-800 group-hover:text-slate-900">
                        {action.title}
                      </h3>
                      <p className="text-sm text-slate-500 mt-1">
                        {action.description}
                      </p>
                    </div>
                  </div>
                </Button>
              </Link>
            </motion.div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}