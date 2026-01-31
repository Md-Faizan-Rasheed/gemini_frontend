import { useState, useEffect } from "react";

export const useJobData = (id) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!id) return;

    const fetchJob = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(
          `https://vecelbdfastapi-o38rr4nb4-faizs-projects-96be4be2.vercel.app/jobs/${id}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const result = await response.json();
        setData({
          title: result?.title || "",
          description: result?.description || "",
          questions: result?.questions || [],
          numberOfQuestions: result?.questions?.length || 3,
        });
      } catch (err) {
        console.error("Fetch job error:", err);
        setError("Failed to load job details");
      } finally {
        setLoading(false);
      }
    };

    fetchJob();
  }, [id]);

  return { data, loading, error };
};