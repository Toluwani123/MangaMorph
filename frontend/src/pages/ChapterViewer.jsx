import React, { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { motion, AnimatePresence } from 'framer-motion';
import api from "../api";

import { fetchPages, fetchPageDetail } from '@/libs/utils'
import PageList from '@/components/PageList' // ensure this exists/exports default

import MangaPageViewer from '@/components/MangaPageViewer'
// import TextBubbleEditor from '@/components/TextBubbleEditor'



const fadeUp = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.25, ease: 'easeOut' } },
  exit: { opacity: 0, y: 12, transition: { duration: 0.2 } }
};

const slideInLeft = {
  initial: { opacity: 0, x: -20 },
  animate: { opacity: 1, x: 0, transition: { duration: 0.25, ease: 'easeOut' } },
  exit: { opacity: 0, x: -20, transition: { duration: 0.2 } }
};

const slideInRight = {
  initial: { opacity: 0, x: 20 },
  animate: { opacity: 1, x: 0, transition: { duration: 0.25, ease: 'easeOut' } },
  exit: { opacity: 0, x: 20, transition: { duration: 0.2 } }
};

function ChapterViewer() {
  const { chapterId } = useParams()
  const [pages, setPages] = useState([]);
  const [currentPageId, setCurrentPageId] = useState(null);
  const [pageData, setPageData] = useState(null);
  const [zoom, setZoom] = useState(100);
  const [mode, setMode] = useState('view');
  const [isLoadingPages, setIsLoadingPages] = useState(true);
  const [isLoadingPage, setIsLoadingPage] = useState(false);
  const [displayMode, setDisplayMode] = useState('pins'); // 'pins' or 'overlays'
  const [title, setTitle] = useState("");

  const fetchTitle = () => {
    api.get(`/chapters/${chapterId}/`)
      .then(response => {
        
        setTitle(response.data.title);
        console.log("Fetched title:", response.data);
        // Do something with the title, e.g., set it in state
      })
      .catch(console.error);
  };
  useEffect(() => {
    let mounted = true;
    setIsLoadingPages(true);
    fetchTitle();
    fetchPages(chapterId)
      .then(data => {
        if (!mounted) return;
        setPages(data);
        if (data.length > 0 && currentPageId === null) {
          setCurrentPageId(data[0].id);
        }
      })
      .finally(() => mounted && setIsLoadingPages(false))
      .catch(console.error);

    return () => { mounted = false; }
  }, [chapterId]);

  useEffect(() => {
    if (!currentPageId) return;
    let mounted = true;
    setIsLoadingPage(true);
    fetchPageDetail(chapterId, currentPageId)
      .then((data) => mounted && setPageData(data))
      .finally(() => mounted && setIsLoadingPage(false))
      .catch(console.error);
    return () => { mounted = false; }
  }, [chapterId, currentPageId]);

  const handleSaveBubble = () => {
    // implement save behavior if you have an editor component
  };
  function decodeHtml(s) {
    const el = document.createElement("textarea");
    el.innerHTML = s ?? "";
    return el.value;
    }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white flex flex-col">
      <motion.header
        variants={fadeUp}
        initial="initial"
        animate="animate"
        className="border-b bg-white/70 backdrop-blur-sm"
      >
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link to="/dashboard" className="font-semibold text-slate-800 hover:text-slate-900">
            Back to Dashboard
          </Link>
          <div className="flex items-center gap-2">
            <Button
              className="px-3 py-1 border rounded bg-white/70 hover:bg-white"
              onClick={() => setMode((m) => (m === "view" ? "edit" : "view"))}
            >
              {mode === "view" ? "Edit[Coming Soon]" : "Preview"}
            </Button>
            <Button
              className="px-3 py-1 border rounded bg-white/70 hover:bg-white"
              onClick={() => setZoom((z) => Math.max(25, z - 25))}
            >
              -
            </Button>
            <span className="w-12 text-center text-sm text-gray-700">{zoom}%</span>
            <Button
              className="px-3 py-1 border rounded bg-white/70 hover:bg-white"
              onClick={() => setZoom((z) => Math.min(200, z + 25))}
            >
              +
            </Button>
          </div>
        </div>
      </motion.header>

      <div className="flex-1 flex h-[calc(100vh-57px)]">
        <AnimatePresence initial={false}>
          <motion.aside
            key="left-pane"
            variants={slideInLeft}
            initial="initial"
            animate="animate"
            exit="exit"
            className="w-64 border-r bg-white/60 backdrop-blur-sm p-4 overflow-y-auto shadow-sm"
          >
            <h3 className="font-semibold mb-3 text-slate-800">
              Pages {isLoadingPages ? '' : `(${pages.length})`}
            </h3>

            

            {isLoadingPages ? (
              <div className="space-y-2">
                {[...Array(6)].map((_, i) => (
                  <Skeleton key={i} className="h-8 w-full rounded-md" />
                ))}
              </div>
            ) : (
              <PageList
                pages={pages}
                currentPageId={currentPageId}
                onSelect={(id) => setCurrentPageId(id)}
              />
            )}
          </motion.aside>
        </AnimatePresence>

        <motion.main
          variants={fadeUp}
          initial="initial"
          animate="animate"
          className="flex-1 p-4 overflow-auto"
        >
          <motion.div
            layout
            className="bg-white/60 backdrop-blur-sm rounded-xl shadow-lg shadow-slate-200/50 border border-slate-200/50 p-3"
          >
            <AnimatePresence mode="wait">
              {isLoadingPage ? (
                <motion.div
                  key="viewer-skeleton"
                  variants={fadeUp}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  className="h-[70vh] grid place-items-center"
                >
                  <div className="w-full max-w-3xl space-y-3">
                    <Skeleton className="h-6 w-48" />
                    <Skeleton className="h-[60vh] w-full rounded-lg" />
                  </div>
                </motion.div>
              ) : pageData ? (
                <motion.div
                  key={currentPageId}
                  variants={fadeUp}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                >
                  {/* Replace this block with your MangaPageViewer if available */}
                  <MangaPageViewer
                        imageUrl={pageData.original_image}
                        imageNaturalWidth={pageData.width}
                        imageNaturalHeight={pageData.height}
                        textBoxes={pageData.text_blocks.map(tb => ({
                            id: String(tb.id),
                            // keep % values, the viewer will handle them
                            x: tb.x, y: tb.y, w: tb.width, h: tb.height,
                            text: decodeHtml(tb.translated_text || ""),
                        }))}
                        zoom={zoom}
                        coordUnits="percent"   // <<< NEW
                        displayMode={displayMode}
                    />
                </motion.div>
              ) : (
                <motion.div
                  key="viewer-empty"
                  variants={fadeUp}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  className="h-[60vh] grid place-items-center text-gray-500"
                >
                  Select a page…
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </motion.main>

        <AnimatePresence initial={false}>
          <motion.aside
            key={`right-pane-${mode}`}
            variants={slideInRight}
            initial="initial"
            animate="animate"
            exit="exit"
            className="w-80 border-l bg-white/60 backdrop-blur-sm p-4 shadow-sm"
          >
            <h3 className="font-semibold mb-3 text-slate-800">Editor</h3>
            {/* Replace with your TextBubbleEditor component if available */}
            {pageData ? (
              <div className="space-y-3">
                <div>
                    Title: <span className="font-medium">{title}</span>
                </div>
                <div className="text-sm text-slate-600">
                  Mode: <span className="font-medium">{mode}</span>
                </div>
                
                <Button
                className="bg-gray-300 text-gray-500 cursor-not-allowed relative"
                onClick={null}
                >
                    Save Changes
                    <span className="absolute top-full mt-1 text-xs text-gray-400">Coming soon</span>
                </Button>
                <div></div>

                <button className="px-3 py-1 border rounded"
                    onClick={() => setDisplayMode(m => m === "pins" ? "overlays" : "pins")}>
                    {displayMode === "pins" ? "Show Overlays" : "Show Pins"}
                </button>
              </div>
            ) : (
              <div className="text-sm text-slate-500">No page selected</div>
            )}
          </motion.aside>
        </AnimatePresence>
      </div>
    </div>
  )
}

export default ChapterViewer