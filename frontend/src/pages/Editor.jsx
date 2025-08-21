import React from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Edit3, 
  FileText, 
  Globe, 
  Zap, 
  Settings,
  ArrowRight,
  Construction 
} from "lucide-react";

export default function Editor() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-r from-slate-800 to-amber-600 rounded-xl flex items-center justify-center">
              <Edit3 className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-slate-800">Translation Editor</h1>
              <p className="text-slate-600">Professional manga text editing and typesetting</p>
            </div>
          </div>
          
          <Badge className="bg-amber-100 text-amber-800 border-amber-200">
            <Construction className="w-3 h-3 mr-1" />
            Coming Soon
          </Badge>
        </motion.div>

        {/* Feature Preview Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="bg-white/60 backdrop-blur-sm border-0 shadow-lg shadow-slate-200/50 h-full">
              <CardHeader>
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mb-2">
                  <FileText className="w-5 h-5 text-blue-600" />
                </div>
                <CardTitle className="text-lg text-slate-800">Text Recognition</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-600 text-sm">
                  Advanced OCR with speech bubble detection and text extraction from manga pages
                </p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="bg-white/60 backdrop-blur-sm border-0 shadow-lg shadow-slate-200/50 h-full">
              <CardHeader>
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center mb-2">
                  <Globe className="w-5 h-5 text-green-600" />
                </div>
                <CardTitle className="text-lg text-slate-800">Smart Translation</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-600 text-sm">
                  Context-aware translation with manga terminology and cultural adaptation
                </p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="bg-white/60 backdrop-blur-sm border-0 shadow-lg shadow-slate-200/50 h-full">
              <CardHeader>
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center mb-2">
                  <Settings className="w-5 h-5 text-purple-600" />
                </div>
                <CardTitle className="text-lg text-slate-800">Professional Typesetting</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-600 text-sm">
                  Intelligent text positioning, font matching, and speech bubble preservation
                </p>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Main Editor Preview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl shadow-slate-200/50">
            <CardHeader>
              <CardTitle className="text-xl text-slate-800 flex items-center gap-2">
                <Zap className="w-5 h-5 text-amber-500" />
                Visual Editor Interface
              </CardTitle>
              <p className="text-slate-600">
                Advanced editing tools for precise manga translation work
              </p>
            </CardHeader>
            <CardContent>
              <div className="bg-gradient-to-br from-slate-100 to-slate-200 rounded-xl p-12 text-center">
                <div className="max-w-md mx-auto">
                  <div className="w-24 h-24 bg-gradient-to-r from-slate-400 to-slate-500 rounded-2xl flex items-center justify-center mx-auto mb-6 opacity-50">
                    <Edit3 className="w-12 h-12 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-600 mb-3">
                    Editor Coming Soon
                  </h3>
                  <p className="text-slate-500 mb-6">
                    We're building a powerful visual editor with real-time preview, 
                    text positioning tools, and collaborative features.
                  </p>
                  <div className="space-y-3 text-sm text-left bg-white/50 rounded-lg p-4">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="text-slate-600">Drag & drop text positioning</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="text-slate-600">Real-time translation preview</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="text-slate-600">Font & style customization</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
                      <span className="text-slate-600">Speech bubble detection</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
                      <span className="text-slate-600">Batch processing tools</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="text-center mt-8"
        >
          <Button 
            variant="outline" 
            className="mr-4 text-slate-600 hover:text-slate-800"
            disabled
          >
            <Settings className="w-4 h-4 mr-2" />
            Configure Editor
          </Button>
          <Button 
            className="bg-gradient-to-r from-slate-800 to-amber-600 hover:from-slate-900 hover:to-amber-700"
            disabled
          >
            Start Editing
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </motion.div>
      </div>
    </div>
  );
}