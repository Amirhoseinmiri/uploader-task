import { create } from "zustand";
import type { UploadFile } from "../types";

interface UploadState {
  files: UploadFile[];
  addFile: (file: UploadFile) => void;
  updateFile: (id: string, data: Partial<UploadFile>) => void;
  removeFile: (id: string) => void;
  reset: () => void;
}

export const useUploadStore = create<UploadState>((set) => ({
  files: [],

  addFile: (file) =>
    set((state) => ({
      files: [...state.files, file],
    })),

  updateFile: (id, data) =>
    set((state) => ({
      files: state.files.map((f) => (f.id === id ? { ...f, ...data } : f)),
    })),

  removeFile: (id) =>
    set((state) => ({
      files: state.files.filter((f) => f.id !== id),
    })),

  reset: () => set({ files: [] }),
}));
