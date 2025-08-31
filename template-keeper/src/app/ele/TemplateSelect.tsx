"use client";
import React, { useMemo, useRef, useState, useEffect } from "react";
import CategorySelect from "./CategorySelect";
import { useContext } from "react";
import { TemplateContext, CategoryContext, SearchContext, SetActiveIDX } from "../../boards/Template";
import { DataType, Data } from "../../boards/Template";
import { deleteAllTemplates, deleteTemplate } from "../backend/deletingTemplates";
import loadTemplates from "../backend/loadingTemplates";

export default function TemplateSelect() {
  const { template, setTemplate } = useContext(TemplateContext);
  const { category, setCategory } = useContext(CategoryContext);
  const { searchTerm, setSearchTerm } = useContext(SearchContext);
  const { activeIdx, setActiveIdx } = useContext(SetActiveIDX);
  const { data, setData } = useContext(Data);
  if (!data) return <div>Loading...</div>;

  // Normalize to {id,label,sub}
  const lowercased = data;
  const categorized = lowercased.filter(t => category === "-" || t.category === category);
  const listRef = useRef<HTMLDivElement | null>(null);

  const filtered = useMemo(() => {
    const q = searchTerm.trim().toLowerCase();
    if (!q) return categorized;
    return categorized.filter((it) => it.label.toLowerCase().includes(q));
  }, [categorized, searchTerm]);

  // Reset highlight when searchTerm changes
  useEffect(() => setActiveIdx(0), [searchTerm]);

  // Keep active item visible in the scroll box

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!filtered.length) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIdx(Math.min(activeIdx + 1, filtered.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIdx(Math.max(activeIdx - 1, 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      setTemplate(filtered[activeIdx].label);
    }
  };

  return (
    <CategoryContext.Provider value={{ category, setCategory }}>

      <div className="flex flex-col gap-2 w-[40%] h-[100%] border-2 border-amber-500">
        <CategorySelect />
        <div className="w-full max-w-md">
          {/* Search bar */}
          <div className="relative">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Search..."
              className="w-full border rounded px-3 py-2"
              role="combobox"
              aria-expanded="true"
              aria-controls="searchable-listbox"
            />
            {searchTerm && (
              <button
                type="button"
                onClick={() => setSearchTerm("")}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-sm"
                aria-label="Clear search"
              >
                ✕
              </button>
            )}
          </div>

          {/* Scrollable list */}
          <div
            ref={listRef}
            id="searchable-listbox"
            role="listbox"
            tabIndex={-1}
            className={`mt-2 border max-h-[40vh] rounded overflow-auto`}
          >
            {filtered.length === 0 ? (
              <div className="p-3 text-sm text-gray-500">No results</div>
            ) : (
              filtered.map((item, idx) => (
                <div
                  key={item.id}
                  data-idx={idx}
                  role="option"
                  aria-selected={idx === activeIdx}
                  onMouseEnter={() => setActiveIdx(idx)}
                  onClick={() => setTemplate(item.label)}
                  className={`flex flex-row justify-between px-3 py-2 cursor-pointer ${idx === activeIdx ? "bg-gray-100" : ""
                    }`}
                >
                  <div className="font-medium">{highlight(item.label, searchTerm)}</div>
                  <button
                    type="button"
                    onClick={async () =>  {
                      await deleteTemplate(item.id);
                      const updatedTemplates = await loadTemplates();
                      setData(updatedTemplates);
                      setTemplate("-");
                      setSearchTerm("");
                      setCategory("Select Category");
                    }}
                    className="text-sm cursor-pointer text-red-500 hover:underline"
                    aria-label="Clear search"
                  >
                    ✕
                  </button>
                </div>
              ))
            )}
          </div>

          <div className="mt-2 text-xs text-gray-500">
            {filtered.length} result{filtered.length !== 1 ? "s" : ""}
          </div>
          <div className="mt-2 text-xs text-gray-500">
            Selected Category: {category}
          </div>
          <div className="mt-2 text-xs text-gray-500">
            <button
              type="button"
              onClick={async () => {
                const updatedTemplates = await loadTemplates();
                setData(updatedTemplates);
                setTemplate("-");
                setSearchTerm("");
                setCategory("Select Category");
              }}
              className="text-sm cursor-pointer text-red-500 hover:underline"
              aria-label="Clear search"
            >
                Delete All Templates
            </button>
          </div>
        </div>
      </div>
    </CategoryContext.Provider>
  );
}


// Simple highlighter for matches
function highlight(text: string, searchTerm: string) {
  if (!searchTerm) return text;
  if (!text) return "this is handle";
  const esc = searchTerm.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const parts = text.split(new RegExp(`(${esc})`, "ig"));
  return parts.map((part, i) =>
    part.toLowerCase() === searchTerm.toLowerCase() ? (
      <mark key={i}>{part}</mark>
    ) : (
      <span key={i}>{part}</span>
    )
  );
}