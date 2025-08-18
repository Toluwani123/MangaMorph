import React from "react";
import { Card, CardHeader, CardTitle } from "../ui/card";
import { motion } from "framer-motion";


export default function StatsCard({ title, value, icon: Icon, gradient, trend }) {
    return (
        <motion.div whileHover={{ scale: 1.02 }} transition={{type: "spring", stiffness: 300, damping: 30}}>
            <Card className="relative overflow-hidden bg-white/60 backdrop-blur-sm border-0 shadow-lg shadow-slate-200/50">
                <div className={`absolute top-0 right-0 w-24 h-24 transform translate-x-6 -translate-y-6 ${gradient} rounded-full opacity-20`}/>
                <CardHeader className="p-6">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-sm font-medium text-slate-500 mb-2">{title}</p>
                            <CardTitle className="text-3xl font-bold text-slate-800">
                                {value}
                            </CardTitle>
                        </div>
                        <div className={`p-3 rounded-xl ${gradient} bg-opacity-15 shadow-sm`}>
                            <Icon className="w-6 h-6 text-white" />
                        </div>
                    </div>
                    {trend && (
                        <div className="mt-4 text-sm text-slate-600">
                            <span className="font-medium">{trend}</span>
                        </div>
                    )}
                </CardHeader>


            </Card>

        </motion.div>

    );

}
