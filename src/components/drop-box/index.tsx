import React from "react";
import { useDropzone } from "react-dropzone";
import { useUploadStore } from "../../store/upload-store";
import { uploadFileWithProgress } from "../../api/uploadService";
import { v4 as uuidv4 } from "uuid";
import FileCard from "../upload-card";
import type { UploadFile } from "../../types";

const DropBox: React.FC = () => {
  const { addFile, updateFile, files } = useUploadStore();

  const handleUpload = (
    file: File,
    id: string,
    abortController: AbortController
  ) => {
    uploadFileWithProgress(
      file,
      (progress) => updateFile(id, { progress }),
      abortController.signal
    )
      .then((filename) =>
        updateFile(id, {
          status: "success",
          uploadedFilename: filename,
        })
      )
      .catch((error) => {
        const status = error.name === "AbortError" ? "canceled" : "error";
        updateFile(id, { status });
        console.error("Upload error:", error.message);
      });
  };

  const onDrop = (acceptedFiles: File[]) => {
    acceptedFiles.forEach((file) => {
      const id = uuidv4();
      const abortController = new AbortController();

      const newFile: UploadFile = {
        id,
        file,
        progress: 0,
        status: "uploading",
        abortController,
      };

      addFile(newFile);
      handleUpload(file, id, abortController);
    });
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple: true,
    accept: {
      "image/*": [],
      "application/pdf": [],
    },
    maxSize: 10 * 1024 * 1024, // 10 MB
  });

  return (
    <div className="w-full max-w-3xl mx-auto h-screen flex flex-col gap-6">
      {files.length > 0 && (
        <div className="space-y-4">
          {files.map((file) => (
            <FileCard key={file.id} file={file} />
          ))}
        </div>
      )}
      <div
        {...getRootProps()}
        className={`border-2 border-dashed flex flex-col items-center justify-center gap-4 m-auto p-8 rounded-lg text-center transition ${
          isDragActive ? "bg-blue-100 border-blue-400" : "border-gray-300"
        }`}
      >
        <input {...getInputProps()} />

        <div className="rounded-2xl bg-black shadow max-w-fit">
          <img src="/images/Mask.png" className="w-10 h-10" alt="box" />
        </div>

        <img src="/images/box.png" alt="" className="w-[70%] h-auto" />
        <p className="text-3xl">File Uploader</p>

        <p className="text-gray-600">
          {isDragActive
            ? "Drop the files here ..."
            : "Drag and drop files here, or click to select"}
        </p>
        <p className="text-sm text-gray-400 mt-1">
          Accepted: JPG, PNG, PDF (max 10MB)
        </p>
      </div>
    </div>
  );
};

export default DropBox;
