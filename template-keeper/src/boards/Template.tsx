"use client";
import React from "react";
import TemplateSelect from "../app/ele/TemplateSelect";
import TemplateArea from "../app/ele/TemplateArea";
import { useState } from "react";
import { createContext } from "react";
import AddTemplateBox from "@/app/ele/AddTemplate";
import loadTemplates from "../app/backend/loadingTemplates";

export type DataType = {
    id: number;
    label: string;
    fields: string[];
    category: string;
};

const LoadedTemplates = await loadTemplates();

export const Data = createContext({
    data: LoadedTemplates as DataType[],
    setData: (_v: DataType[]) => {
    }
});

export const CategoryContext = createContext({
    category: "-",
    setCategory: (_v: string) => { }
})

export const TemplateContextID = createContext({
    templateID: 0,
    setTemplateID: (_v: number) => { }
})

export const AddTemplateContext = createContext({
    open: false,
    setOpen: (_v: boolean) => { }
})

export const SearchContext = createContext({
    searchTerm: "",
    setSearchTerm: (_v: string) => { }
})

export const SetActiveIDX = createContext({
    activeIdx: 0,
    setActiveIdx: (_v: number) => { }
})

export default function Template() {
    const [data, setData] = useState(LoadedTemplates);
    const [templateID, setTemplateID] = useState(0);
    const [open, setOpen] = useState(false);
    const [category, setCategory] = useState("-");
    const [searchTerm, setSearchTerm] = useState("");
    const [activeIdx, setActiveIdx] = useState(0);

    return <div className="flex flex-col gap-[32px] row-start-2 items-start justify-start md:items-start border-amber-200 border-2 w-[100%] h-full">
        <h1 className="text-2xl md:text-3xl">Select a Template</h1>
        <div className="flex flex-col md:flex-row gap-2 w-[100%]">
            <Data.Provider value={{ data, setData }}>
                <TemplateContextID.Provider value={{ templateID, setTemplateID }}>
                    <AddTemplateContext.Provider value={{ open, setOpen }}>
                        <CategoryContext.Provider value={{ category, setCategory }}>
                            <SetActiveIDX.Provider value={{ activeIdx, setActiveIdx }}>
                                <SearchContext.Provider value={{ searchTerm, setSearchTerm }}>
                                    <TemplateSelect />
                                    <TemplateArea />
                                    <AddTemplateBox />
                                </SearchContext.Provider>
                            </SetActiveIDX.Provider>
                        </CategoryContext.Provider>
                    </AddTemplateContext.Provider>
                </TemplateContextID.Provider>
            </Data.Provider>
        </div>
    </div >
}