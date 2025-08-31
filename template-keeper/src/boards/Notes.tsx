import React from "react";

export default function Notes() {
    return <div className="hidden flex-col gap-[32px] row-start-2 items-center md:items-start border-amber-200 border-2 w-[100%]">
        <div className="flex flex-row justify-between w-[100%]">
            <h1 className="text-2xl md:text-3xl">Notes</h1>
            <button className="text-2xl md:text-3xl">New Note</button>
        </div>
        <div>Filter by: Dropdown List of Categories</div>
        <div className="flex flex-row justify-between items-start border-2 border-amber-200 w-[100%] h-[400px]">
            <div>Notes List Area</div>
        </div>
    </div>
}