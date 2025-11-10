import axios from "axios";

export const auddApi = {
  recognizeSong: async (audioFile: File) => {
    const formData = new FormData();
    formData.append("file", audioFile, audioFile.name);

    const response = await axios.post("/api/audd", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return response.data;
  },
};
