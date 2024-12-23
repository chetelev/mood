"use client";

import { updatedEntry } from "@/lib/api";
import { useState } from "react";
import { useAutosave } from "react-autosave";

const Editor = ({ entry }) => {
  const [value, setValue] = useState(entry.content);
  const [isLoading, setIsLoading] = useState(false)

  useAutosave({
    data: value,
    onSave: async (_value) => {
      setIsLoading(true)
      const updated = await updatedEntry(entry.id, _value)
      setIsLoading(false)
    }
  })

  return (
    <div>
      <div className="w-full h-full">
      {isLoading && <div>...loading</div>}
        <textarea
          className="w-full h-full text-xl p-8"
          value={value}
          onChange={(e) => setValue(e.target.value)}
        ></textarea>
      </div>
    </div>
  );
};

export default Editor;
