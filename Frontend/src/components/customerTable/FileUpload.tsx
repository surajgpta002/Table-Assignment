import React, { useState } from "react";
import axios from "axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const apiUrl = import.meta.env.VITE_API_BASE_URL;

const uploadFile = async (file: File) => {
  const formData = new FormData();
  formData.append("file", file);

  const response = await axios.post(`${apiUrl}/import`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

  return response.data;
};

const FileUpload = () => {
  const [file, setFile] = useState<File | null>(null);
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: uploadFile,
    onSuccess: (data) => {
      alert(data.message);
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
    },
    onError: (error) => {
      console.error("Upload failed", error);
      alert("Upload failed");
    },
  });

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setFile(event.target.files[0]);
    }
  };

  const handleUpload = () => {
    if (!file) {
      alert("Please select a file");
      return;
    }
    mutation.mutate(file);
  };

  return (
    <div className="import">
      <input type="file" accept=".xlsx,.xls" onChange={handleFileChange} />
      <button onClick={handleUpload} disabled={mutation.isPending}>
        {mutation.isPending ? "Wait..." : "Import"}
      </button>
    </div>
  );
};

export default FileUpload;
