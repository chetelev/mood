"use client";

import { askQuestion } from "@/lib/api";
import { useState } from "react";

const Question = () => {
  const [value, setValue] = useState("");
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState();

  const onChange = (e) => {
    setValue(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const answer = await askQuestion(value);

    setResponse(answer);
    setValue("");
    setLoading(false);
  };
  
  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input
          className="border border-black/20 px-4 py-6 text-lg"
          type="text"
          onChange={onChange}
        />
        <button
          disabled={loading}
          type="submit"
          className="bg-blue-400 px-4 py-2 rounded-lg"
        >
          Ask
        </button>
      </form>

      {loading && <div>Loading</div>}
      {response && <div>{response}</div>}
    </div>
  );
};

export default Question;
