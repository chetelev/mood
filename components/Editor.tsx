"use client";

import { useState } from "react";

const Editor = ({ entry }) => {
  const [value, setValue] = useState(entry.content);

  return (
    <div>
      <div className="w-full h-full">
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
