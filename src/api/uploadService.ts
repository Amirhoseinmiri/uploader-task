// src/services/uploadService.ts

import type { UploadResponse } from "../types";
import axiosInstance from "./config";

export const uploadFileWithProgress = (
  file: File,
  onProgress: (progress: number) => void,
  signal: AbortSignal
): Promise<string> => {
  return new Promise((resolve, reject) => {
    const formData = new FormData();
    formData.append("file", file);

    axiosInstance
      .post<UploadResponse>("/upload", formData, {
        signal,
        onUploadProgress: (event) => {
          if (event.total) {
            const percent = Math.round((event.loaded * 100) / event.total);
            onProgress(percent);
          }
        },
      })
      .then((res) => {
        const { data } = res;
        if (data.success && data.data?.filename) {
          resolve(data.data.filename);
        } else {
          reject(new Error(data.message || "Upload failed"));
        }
      })
      .catch((error) => reject(error));
  });
};
