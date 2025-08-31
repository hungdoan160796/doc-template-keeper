import react from "react";
import { useContext, useState, createContext } from "react";
import { TemplateContextID } from "../../../boards/Templates";
import { Data, DataType } from "../../../boards/Templates";
import { saveNote } from "../../backend/savingNotes";
import { LinesContext } from "../../../boards/Templates";
import { CopyNoteButton } from "../../backend/copyText"

export default function TemplateArea() {
    const { templateID, setTemplateID } = useContext(TemplateContextID);
    const { data } = useContext(Data);
    const { lines, setLines } = useContext(LinesContext)


    if (!data) return <div>Loading...</div>;

    const selectedTemplate = data.find((t) => t.id === templateID) as DataType;
    const templateContent = selectedTemplate ? selectedTemplate.fields : [];
    const templateLabel = selectedTemplate ? selectedTemplate.label : "";
    const templateCategory = selectedTemplate ? selectedTemplate.category : ""

    let noteFields: Record<string, string> = {};

    for (const key of templateContent) {
        noteFields[key] = "";
    }

    return (
        <div className="flex flex-col w-[100%] gap-2">
            <div className="w-[100%] flex flex-row justify-between items-center">
                <h1 className="w-[100%]">Template Preview Area</h1>
                <div className="w-[100%] flex flex-row justify-end gap-4">
                    <CopyNoteButton
                        label={templateLabel}
                        category={templateCategory}
                        fields={templateContent}     // string[]
                        lines={lines}                         // Record<string,string>
                    />

                    <button
                        onClick={
                            async () => {
                                await saveNote({
                                    id: Date.now(),
                                    fields: templateContent,
                                    lines: lines,
                                    category: selectedTemplate ? selectedTemplate.category : "",
                                    label: selectedTemplate ? selectedTemplate.label : "",
                                });
                                alert("Note saved!");
                            }
                        }
                        className="border rounded px-3 py-2 hover:cursor-pointer"
                    >Save Note</button>
                </div>
            </div>
            <div className="w-[100%] flex flex-row justify-between items-start h-[400px] overflow-auto scroll-auto rounded border border-black">
                <ul className="w-[100%]">
                    {templateContent.flatMap((tpl, i) => (
                        <li className="w-[100%]" key={tpl}>
                            <div className="flex flex-row justify-between border-b border-gray-300 p-2 w-[100%]">
                                <p className="w-fit">{tpl}</p>
                                <textarea
                                    value={lines[i]}
                                    onChange={(e) => setLines({ ...lines, [i]: e.target.value })}
                                    required={true}
                                    className="w-[60%] border border-gray-300 rounded-md p-1"
                                    placeholder={`Enter ${tpl} here...`}>
                                </textarea>
                            </div>
                        </li>
                    )
                    )}
                </ul>
            </div>
        </div>
    )
}