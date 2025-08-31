"use client";
import { useContext } from "react";
import { } from "./TemplateSelect";
import { AddTemplateContext, CategoryContext } from "../../../boards/Templates";
import { Data } from "../../../boards/Templates";


export default function CategorySelect() {
  const { category, setCategory } = useContext(CategoryContext);
  const { open, setOpen } = useContext(AddTemplateContext);
  const { data } = useContext(Data);
  if (!data) return <div>Loading...</div>;

  const categories = Array.from(
    new Set(data.map((it) => (it.category || "-")))
  );

  return (
    <div className="flex flex-row items-start w-[100%] justify-between">
      <select
        id="category"
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        className="border rounded px-3 py-2 w-[50%]"
      >
        <option value="Select Category">Select Category</option>
        {categories.map((cat) => (
          <option key={cat} value={cat}>
            {cat}
          </option>
        ))}
      </select>
      <button
        className="border rounded px-3 py-2 hover:cursor-pointer"
        onClick={() => setOpen(true)}
      >Add Template</button>
    </div>
  );
}
