import React from 'react'
import { Upload, BookOpen, Languages, Edit3, Share2 } from 'lucide-react'
import { Button } from '../components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Link } from 'react-router-dom'

function Home() {
  return (
    <div className='min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50'>
        <header className="border-b bg-white/80 backdrop-blur-sm">
            <div className="container mx-auto px-4 py-4 flex items-center justify-between">
            <div className="flex items-center space-x-2">
                <BookOpen className="h-8 w-8 text-purple-600" />
                <h1 className="text-2xl font-bold text-gray-900">MangaMorph AI</h1>
            </div>
            <div className="flex items-center space-x-4">
                <Link to="/login">
                    <Button variant="ghost">Sign In</Button>
                </Link>
                <Link to="/dashboard">
                    <Button>Dashboard</Button>
                </Link>
            </div>
            </div>
        </header>
        <section className="container mx-auto px-4 py-16 text-center">
            <div className="max-w-4xl mx-auto">
            <h2 className="text-5xl font-bold text-gray-900 mb-6">Transform Manga with AI-Powered Translation</h2>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
                Upload your manga files, let AI handle OCR and translation, then edit and publish with our intuitive web
                editor.
            </p>
            <Link to="/upload">
                <Button size="lg" className="text-lg px-8 py-4">
                <Upload className="mr-2 h-5 w-5" />
                    Start Translating
                </Button>
            </Link>
            </div>
        </section>
        <section className="container mx-auto px-4 py-16">
            <h3 className="text-3xl font-bold text-center mb-12">How It Works</h3>
            <div className="grid md:grid-cols-4 gap-8">
            <Card className="text-center">
                <CardHeader>
                <Upload className="h-12 w-12 text-purple-600 mx-auto mb-4" />
                <CardTitle>Upload</CardTitle>
                </CardHeader>
                <CardContent>
                <CardDescription>Upload ZIP or CBZ files up to 250MB. Automatic page ordering included.</CardDescription>
                </CardContent>
            </Card>

            <Card className="text-center">
                <CardHeader>
                <Languages className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                <CardTitle>AI Processing</CardTitle>
                </CardHeader>
                <CardContent>
                <CardDescription>
                    Google Vision OCR extracts text, then Google Translate provides accurate translations.
                </CardDescription>
                </CardContent>
            </Card>

            <Card className="text-center">
                <CardHeader>
                <Edit3 className="h-12 w-12 text-green-600 mx-auto mb-4" />
                <CardTitle>Edit</CardTitle>
                </CardHeader>
                <CardContent>
                <CardDescription>WYSIWYG editor with side-by-side JP/EN view and precise text placement.</CardDescription>
                </CardContent>
            </Card>

            <Card className="text-center">
                <CardHeader>
                <Share2 className="h-12 w-12 text-orange-600 mx-auto mb-4" />
                <CardTitle>Publish</CardTitle>
                </CardHeader>
                <CardContent>
                <CardDescription>Web reader with page swipe, zoom, and shareable chapter URLs.</CardDescription>
                </CardContent>
            </Card>
            </div>
        </section>
        <section className="bg-purple-600 text-white py-16">
            <div className="container mx-auto px-4 text-center">
            <h3 className="text-3xl font-bold mb-4">Ready to Get Started?</h3>
            <p className="text-xl mb-8 opacity-90">Join the future of manga translation with AI-powered tools.</p>
            <Link href="/upload">
                <Button size="lg" variant="secondary" className="text-lg px-8 py-4">
                Upload Your First Manga
                </Button>
            </Link>
            </div>
        </section>

        <footer className="bg-gray-900 text-white py-8">
            <div className="container mx-auto px-4 text-center">
            <p>&copy; 2025 MangaMorph AI. All rights reserved.</p>
            </div>
        </footer>



    </div>
  )
}

export default Home