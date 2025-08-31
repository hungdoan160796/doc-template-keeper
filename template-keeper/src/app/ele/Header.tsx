import React from "react";

export default function Header() {
    return  <aside className="flex flex-row justify-between gap-4 w-[100%]">
        <h1 className="text-2xl md:text-3xl font-extrabold text-center md:text-left">Template Keeper</h1>
        <div className="flex flex-row gap-4">
          <button>Template</button>
          <button>Notes</button>
        </div>
      </aside>
}