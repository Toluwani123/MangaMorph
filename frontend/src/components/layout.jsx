import React, {useEffect} from "react";
import {Link, useLocation, Outlet} from "react-router-dom";
import { Home, Upload, FolderOpen, Edit3, FileText, Zap } from "lucide-react";
import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarHeader, SidebarFooter, SidebarProvider, SidebarTrigger } from "./ui/sidebar";
import api from "@/api";
import { Button } from "./ui/button";

const navigation = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: Home,
  },
  {
    title: "Upload",
    url: "/upload",
    icon: Upload,
  },
  {
    title: "Projects",
    url: "/projects",
    icon: FolderOpen,
  },
  {
    title: "Edit",
    url: "/edit",
    icon: Edit3,
  },
  

];

export default function Layout() {
    const location = useLocation();
    const [user, setUser] = React.useState(null);

    useEffect(() => {
        api.get("/accounts/profile/")
            .then(response => setUser(response.data))
            .catch(console.error);
    }, []);

    return (
        <SidebarProvider>
            <div className="min-h-screen flex w-full bg-gradient-to-br from-slate-50 to-slate-100">
                <style>
                    {`
                        :root {
                        --primary: 30 41 59;
                        --primary-foreground: 248 250 252;
                        --secondary: 241 245 249;
                        --secondary-foreground: 15 23 42;
                        --accent: 245 158 11;
                        --accent-foreground: 255 255 255;
                        --destructive: 239 68 68;
                        --destructive-foreground: 255 255 255;
                        --border: 226 232 240;
                        --input: 241 245 249;
                        --ring: 30 41 59;
                        --background: 255 255 255;
                        --foreground: 15 23 42;
                        --muted: 241 245 249;
                        --muted-foreground: 100 116 139;
                        }
                    `}
                </style>
                <Sidebar className="border-r border-slate-200/60 bg-white/80 backdrop-blur-xl">
                    <SidebarHeader className="border-b border-slate-200/60 p-6">
                        <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-r from-slate-800 to-amber-600 rounded-xl flex items-center justify-center shadow-lg">
                            <Zap className="w-5 h-5 text-white" />
                        </div>
                        <div>
                            <h2 className="font-bold text-slate-800 text-lg">MangaMorph</h2>
                            <p className="text-xs text-slate-500 font-medium">AI Translation Studio</p>
                        </div>
                        </div>
                    </SidebarHeader>
                    <SidebarContent className="p-3">
                        <SidebarGroup>
                            <SidebarGroupLabel className="text-xs font-semibold text-slate-500 uppercase tracking-wider px-3 py-3">
                                Workspace
                            </SidebarGroupLabel>
                            <SidebarGroupContent>
                                <SidebarMenu className="space-y-1">
                                    {navigation.map((item) => (
                                        <SidebarMenuItem key={item.title} >
                                            <SidebarMenuButton asChild className={"hover:bg-slate-100/80 hover:text-slate-900 transition-all duration-200 rounded-lg px-3 py-2.5 " + (location.pathname === item.url ? "bg-slate-100 text-slate-900" : "text-slate-600")}>
                                                <Link to={item.url} className="flex items-center gap-3">
                                                    <item.icon className="w-4 h-4" />
                                                    <span className="font-medium">{item.title}</span>
                                                </Link>
                                            </SidebarMenuButton>
                                        </SidebarMenuItem>
                                    ))}
                                </SidebarMenu>

                            </SidebarGroupContent>

                        </SidebarGroup>
                        <SidebarGroup>
                            <SidebarGroupLabel className="text-xs font-semibold text-slate-500 uppercase tracking-wider px-3 py-3">
                                Quick Actions
                            </SidebarGroupLabel>
                            <SidebarGroupContent>
                                <div className="px-3 py-2 space-y-3">
                                <div className="p-4 rounded-xl bg-gradient-to-r from-amber-50 to-amber-100/50 border border-amber-200/50">
                                    <div className="flex items-center gap-2 text-sm text-amber-800 mb-1">
                                    <FileText className="w-4 h-4" />
                                    <span className="font-medium">Processing Queue</span>
                                    </div>
                                    <p className="text-xs text-amber-600">0 projects in queue</p>
                                </div>
                                </div>
                            </SidebarGroupContent>
                        </SidebarGroup>

                    </SidebarContent>
                    <SidebarFooter className="border-t border-slate-200/60 p-4">
                        <div className="relative group w-full">
                            <div className="flex items-center gap-3 cursor-default">
                                    <div className="w-8 h-8 bg-gradient-to-r from-slate-600 to-slate-700 rounded-full flex items-center justify-center">
                                        <span className="text-white font-semibold text-sm">
                                            {user?.username}
                                        </span>
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="font-semibold text-slate-800 text-sm truncate">{user?.first_name} {user?.last_name}</p>
                                        <p className="text-xs text-slate-500 truncate">{user?.email}</p>
                                    </div>
                                    <div><Button variant="outline" className="w-full"><Link to="/logout">Logout</Link></Button></div>
                            </div>
                        </div>
                    </SidebarFooter>

                </Sidebar>
                <main className="flex-1 flex flex-col">
                    <header className="bg-white/80 backdrop-blur-xl border-b border-slate-200/60 px-6 py-4 md:hidden">
                        <div className="flex items-center gap-4">
                        <SidebarTrigger className="hover:bg-slate-100 p-2 rounded-lg transition-colors duration-200" />
                        <h1 className="text-xl font-bold text-slate-800">MangaMorph AI</h1>
                        </div>
                    </header>

                    <div className="flex-1 overflow-auto">
                        <Outlet />
                    </div>
                </main>

            </div>


        </SidebarProvider>
    )
}