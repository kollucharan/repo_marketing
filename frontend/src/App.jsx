import { useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function App() {
  const [jobRole, setJobRole] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    if (!jobRole.trim()) {
      toast.error("Please enter a job role.");
      return;
    }
    setLoading(true);
    try {
      const response = await axios.post("http://localhost:5000/generate", { role: jobRole });
      setJobDescription(response.data.description);
    } catch (error) {
      toast.error("Error generating job description.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <h1 className="text-2xl font-bold mb-4">Job Description Generator</h1>
      <input
        type="text"
        className="border p-2 mb-2 w-80"
        placeholder="Enter job role..."
        value={jobRole}
        onChange={(e) => setJobRole(e.target.value)}
      />
      <button
        className="bg-blue-500 text-white px-4 py-2"
        onClick={handleGenerate}
        disabled={loading}
      >
        {loading ? "Generating..." : "Generate"}
      </button>
      {jobDescription && (
        <div className="mt-4 p-4 border w-80">
          <h2 className="font-bold">Generated Job Description:</h2>
          <p>{jobDescription}</p>
        </div>
      )}
      <ToastContainer />
    </div>
  );
}

