import React from "react";
import {useContext} from "react";
import { Board } from "../../page";

export default function Header() {
  const { board, setBoard } = useContext(Board);
    return  <aside className="flex flex-row justify-between gap-4 w-[100%]">
        <h1 className="text-2xl md:text-3xl font-extrabold text-center md:text-left">Template Keeper</h1>
        <div className="flex flex-row gap-4">
          <button
          onClick={() => setBoard("Templates")}
          className="border rounded px-3 py-2 hover:cursor-pointer"
          >Templates
          </button>
          <button
          onClick={() => setBoard("Notes")}
          className="border rounded px-3 py-2 hover:cursor-pointer"
          >Notes
          </button>
        </div>
      </aside>
}