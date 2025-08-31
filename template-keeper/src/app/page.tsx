"use client"
import Template from "../boards/Template";
import Notes from "../boards/Notes";
import Header from "./ele/Header";




export default function Home() {
  return (
      <div className="absolute font-sans flex flex-col gap-2 items-center p-[8px] w-[100%] h-[100%]">
        <Header />
        <main className="relative flex flex-col gap-[32px] row-start-2 items-center md:items-start w-full h-full">
          <Template />
        </main>
      </div>
  );
}
