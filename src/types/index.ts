// src/types/uploadTypes.ts

export interface UploadResponse {
  success: boolean;
  message: string;
  data: {
    filename: string;
  };
}

export interface UploadFile {
  id: string;
  file: File;
  progress: number;
  status: "uploading" | "success" | "error" | "canceled";
  abortController: AbortController;
  uploadedFilename?: string;
}
