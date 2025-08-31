"use client"
import Templates from "../boards/Templates";
import Notes from "../boards/Notes";
import Header from "./ele/Templates/Header";
import { useState, createContext } from "react";

export const Board = createContext({
  board: "" as string,
  setBoard: (_v: string) => { }
})

export default function Home() {
  const [board, setBoard] = useState("Templates")
  return (
      <Board.Provider value={{ board, setBoard }}>
    <div className="absolute font-sans flex flex-col gap-2 items-center p-[20px] w-[100%] h-[100%]">
      <Header />
        <main className="relative flex flex-col py-8 row-start-2 items-center md:items-start w-full h-full">
          {board === "Notes" ? <Notes /> : <Templates />}
        </main>
    </div>
      </Board.Provider>
  );
}
