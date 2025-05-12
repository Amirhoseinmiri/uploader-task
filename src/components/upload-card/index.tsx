// src/components/Uploader/FileCard.tsx

import React, { useState, useEffect } from "react";
import { uploadFileWithProgress } from "../../api/uploadService";
import type { UploadFile } from "../../types";
import { useUploadStore } from "../../store/upload-store";
import Button from "../ui/button";
import { RefreshCcw, Trash } from "lucide-react";

interface FileCardProps {
  file: UploadFile;
}

const FileCard: React.FC<FileCardProps> = ({ file }) => {
  const { updateFile, removeFile } = useUploadStore();
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  useEffect(() => {
    if (file.file.type.startsWith("image/")) {
      const objectUrl = URL.createObjectURL(file.file);
      setImagePreview(objectUrl);

      return () => URL.revokeObjectURL(objectUrl);
    }

    return () => {};
  }, [file]);

  const cancelUpload = () => {
    file.abortController.abort();
    updateFile(file.id, { status: "canceled" });
  };

  const retryUpload = () => {
    const newController = new AbortController();
    updateFile(file.id, {
      status: "uploading",
      progress: 0,
      abortController: newController,
    });

    uploadFileWithProgress(
      file.file,
      (progress) => updateFile(file.id, { progress }),
      newController.signal
    )
      .then((filename) =>
        updateFile(file.id, {
          status: "success",
          uploadedFilename: filename,
        })
      )
      .catch((err) => {
        const status = err.name === "AbortError" ? "canceled" : "error";
        updateFile(file.id, { status });
      });
  };

  return (
    <div className="border rounded-md p-4 mt-4 shadow-sm bg-white flex flex-col md:flex-row items-center justify-between gap-4">
      <div className="w-full">
        <p className="font-semibold text-gray-800">{file.file.name}</p>

        {/* Image preview */}
        {imagePreview ? (
          <img
            src={imagePreview}
            alt="Preview"
            className="mt-3 max-w-xs h-[200px] rounded"
          />
        ) : (
          <div className="mt-3 text-center">
            <p className="text-gray-500">No preview available</p>
          </div>
        )}

        <div className="w-full bg-gray-200 rounded h-2 mt-2">
          <div
            className={`h-2 rounded transition-all duration-200 ${
              file.status === "error"
                ? "bg-red-500"
                : file.status === "success"
                ? "bg-green-500"
                : "bg-blue-500"
            }`}
            style={{ width: `${file.progress}%` }}
          />
        </div>

        <p className="text-sm text-gray-600 mt-2">
          {file.status === "uploading" && `Uploading: ${file.progress}%`}
          {file.status === "success" && "✅ Upload complete"}
          {file.status === "error" && "❌ Upload failed"}
          {file.status === "canceled" && "🚫 Upload canceled"}
        </p>
      </div>

      <div className="flex flex-row md:flex-col gap-2 text-sm">
        {file.status === "uploading" && (
          <Button
            onClick={cancelUpload}
            className="text-red-500 hover:underline"
          >
            Cancel
          </Button>
        )}
        {file.status === "error" && (
          <Button onClick={retryUpload} variant="primary" size="icon">
            <RefreshCcw />
          </Button>
        )}
        <Button
          onClick={() => removeFile(file.id)}
          className="text-gray-500 hover:underline"
          variant="secondary"
          size="icon"
        >
          <Trash />
        </Button>
      </div>
    </div>
  );
};

export default FileCard;
