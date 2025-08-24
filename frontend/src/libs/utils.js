import { clsx } from "clsx";
import { twMerge } from "tailwind-merge"
import api from "@/api";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}



export async function fetchPages(chapterId) {
  const response = await api.get(`/chapters/${chapterId}/pages`)
  if (response.status !== 200) {
    throw new Error("Failed to fetch pages")
  }
  return response.data;
}

export async function fetchPageDetail(chapterId, pageId) {
  const response = await api.get(`/chapters/${chapterId}/pages/${pageId}`)
  if (response.status !== 200) {
    throw new Error("Failed to fetch page detail")
  }
  console.log("Fetched page detail:", response.data);
  return response.data;
}
