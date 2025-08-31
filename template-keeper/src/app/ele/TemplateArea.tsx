import react from "react";
import { useContext, useState } from "react";
import { TemplateContext } from "../../boards/Template";
import { Data, DataType } from "../../boards/Template";
import { saveNote } from "../backend/savingNotes";

export default function TemplateArea() {
    const { template, setTemplate } = useContext(TemplateContext);
    const { data } = useContext(Data);

    if (!data) return <div>Loading...</div>;

    const selectedTemplate = data.find((t) => t.label === template);
    const templateContent = selectedTemplate ? selectedTemplate.fields : [];
    let noteFields: Record<string, string> = {};

    for (const key of templateContent) {
        noteFields[key] = "";
    }

// add variables to hold the state of the note being created, and functions to handle saving and copying the note

    return (
        <div className="flex flex-col border-2 border-purple w-[100%] h-full">
            <div className="w-[100%] flex flex-row justify-between items-center p-2">
                <h1 className="w-[100%]">Template Preview Area</h1>
                <div className="w-[100%] flex flex-row justify-end gap-2">
                    <button>Copy Note</button>
                    <button
                        onClick={
                            async () => {
                                await saveNote({
                                    id: Date.now(),
                                    fields: noteFields,
                                    category: selectedTemplate ? selectedTemplate.category : "",
                                    label: selectedTemplate ? selectedTemplate.label : "",
                                });
                                alert("Note saved!");
                            }
                        }
                    >Save Note</button>
                </div>
            </div>

            <ul>
                {templateContent.flatMap((tpl) => (
                    <li className="w-[100%]" key={tpl}>
                        <div className="flex flex-row justify-between border-b border-gray-300 p-2 w-[100%]">
                            <p className="w-fit">{tpl}</p>
                            <textarea className="w-[60%] border border-gray-300 rounded-md p-1" placeholder={`Enter ${tpl} here...`}></textarea>
                        </div>
                    </li>
                )
                )}
            </ul>
        </div>
    )
}