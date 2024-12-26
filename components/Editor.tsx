"use client";

import { updatedEntry } from "@/lib/api";
import { useState } from "react";
import { useAutosave } from "react-autosave";

const Editor = ({ entry }) => {
  const [value, setValue] = useState(entry.content);
  const [isLoading, setIsLoading] = useState(false);
  const [analysis, setAnalysis] = useState(entry.analysis);

  const { mood, summary, subject, color, negative } = analysis;
  const analysisData = [
    { name: "Subject", value: subject },
    { name: "Summary", value: summary },
    { name: "Mood", value: mood },
    { name: "Negative", value: negative.toString() },
  ];

  useAutosave({
    data: value,
    onSave: async (_value) => {
      setIsLoading(true);
      const data = await updatedEntry(entry.id, _value);
      setAnalysis(data.analysis)
      setIsLoading(false);
    },
  });

  return (
    <div className="w-full h-full grid grid-cols-3">
      {isLoading && <div className="absolute">...loading</div>}
      <textarea
        className="w-full h-full text-xl p-8 col-span-2"
        value={value}
        onChange={(e) => setValue(e.target.value)}
      ></textarea>

      <div className="border-l border-black/10">
        <div style={{ backgroundColor: color }} className="px-6 py-10">
          <h2 className="text-2xl">Analysis</h2>
        </div>
        <div>
          <ul>
            {analysisData.map((item) => (
              <li
                className="px-2 py-4 flex items-center justify-between border-t border-black/10"
                key={item.name}
              >
                <span className="text-lg font-semibold">{item.name}</span>
                <span>{item.value}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Editor;
