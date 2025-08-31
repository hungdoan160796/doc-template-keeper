"use client";
import { useState, useContext, useId } from "react";
import { TemplateContext, AddTemplateContext, CategoryContext, SearchContext, SetActiveIDX } from "../../boards/Template";
import { saveTemplate } from "../backend/savingTemplates";
import { getTemplateDir } from "../backend/directory";
import loadTemplates from "../backend/loadingTemplates";
import { Data, DataType } from "../../boards/Template";

export default function AddTemplateBox() {
    const { open, setOpen } = useContext(AddTemplateContext);
    const { template, setTemplate } = useContext(TemplateContext);
    const { category, setCategory } = useContext(CategoryContext);
    const { searchTerm, setSearchTerm } = useContext(SearchContext);
    const { activeIdx, setActiveIdx } = useContext(SetActiveIDX);
    const { data, setData } = useContext(Data);
    if (!data) return <div>Loading...</div>;

    const [addCategory, setAddCategory] = useState("-");
    const [label, setLabel] = useState("");
    const [fields, setFields] = useState("");
    const [newCategory, setNewCategory] = useState("");

    const categories = Array.from(
        new Set(data.map((it) => (it.category || "-")))
    );
    const chosenCategory =
        addCategory === "-" || addCategory === "" ? newCategory.trim() : (addCategory ?? "").trim();
    if (open == false) return;
    return (
        <div
            className="fixed inset-0 z-50 grid place-items-center bg-black/50 p-4"
            onClick={() => setOpen(false)}
        >
            <div
                role="dialog"
                aria-modal="true"
                aria-labelledby="modal-title"
                className="w-full max-w-md rounded-xl bg-white p-4 shadow-xl"
                onClick={(e) => e.stopPropagation()}
            >
                <h2 id="modal-title" className="text-lg font-semibold">
                    Enter field titles of your template
                </h2>
                <input
                    value={label}
                    onChange={(e) => setLabel(e.target.value)}
                    placeholder={"Template Name (*)"}
                    required={true}
                    className="mt-2 h-full w-full rounded-md border border-gray-300 p-2 focus:outline-none focus:ring-2 focus:ring-gray-400"
                ></input>
                <textarea
                    value={fields}
                    onChange={(e) => setFields(e.target.value)}
                    placeholder={`Title one
Title two
Title three
... (*)`}
                    required={true}
                    className="mt-2 w-full min-h-[120px] rounded-md border border-gray-300 p-2 focus:outline-none focus:ring-2 focus:ring-gray-400"
                />
                <div className="mt-2 w-full flex gap-2">
                    <input
                        type="text"
                        value={newCategory}
                        onChange={(e) => setNewCategory(e.target.value)}
                        placeholder="Add new or select category (*)"
                        required={true}
                        className={`h-full ${categories.length == 0 ? "w-[100%]" : "max-w-[60%]"} rounded-md border border-gray-300 p-2 focus:outline-none focus:ring-2 focus:ring-gray-400 ${addCategory === "-" ? "" : "hidden"}`}>
                    </input>
                    <select
                        id="category"
                        value={addCategory}
                        required={true}
                        onChange={(e) => setAddCategory(e.target.value)}
                        className={`border rounded w-full h-full px-3 py-2 ${categories.length == 0 ? "hidden" : ""}`}
                    >
                            <option>-</option>
                        {categories.map((cat) => (
                            <option key={cat} value={cat}>
                                {cat}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="mt-3 flex justify-end gap-2">
                    <button
                        onClick={async () => {
                            const dir = await getTemplateDir();
                            if (!dir) {
                                alert("Your browser doesn't support the File System Access API.");
                                return;
                            }
                            await saveTemplate({ id: data.length + 1, text: fields, category: chosenCategory, label: label });
                            setOpen(false);
                            const updatedTemplates = await loadTemplates();
                            setData(updatedTemplates);
                            setTemplate(label);
                            setCategory(chosenCategory);
                            setSearchTerm("");
                            setLabel("");
                            setFields("");
                            setNewCategory("");
                            setAddCategory("-");
                        }}
                        className="rounded-md bg-gray-900 px-3 py-2 text-sm text-white hover:bg-gray-800 hover:cursor-pointer"
                    >
                        Save
                    </button>
                </div>
            </div>
        </div>
    );
}