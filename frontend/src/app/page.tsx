"use client";
import Chatbox from "@/components/chatbox";
import Navbar from "@/components/navbar";
import PDFViewer from "@/components/pdfviewer";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { FaArrowAltCircleDown, FaArrowAltCircleUp } from "react-icons/fa";

interface IContextData {
  pageContent: string;
  metadata: {
    detection_class_prob: number;
    file_directory: string;
    filename: string;
    filetype: string;
    last_modified: string;
    page_number: number;
    parent_id: string;
  };
}
interface IChatStruct {
  input: string;
  chat_history?: [];
  context: IContextData[];
}

export default function Home() {
  const [collapsed, setCollapsed] = useState<boolean>(false);
  // revalidatePath("/");
  const router = useRouter();
  const handleCollapse = () => {
    console.log(collapsed);
    setCollapsed(!collapsed);
  };
  const [filePath, setfilePath] = useState<string>("/3M_10K_File.pdf");
  const [contextData, setContextData] = useState<IContextData[]>([]);

  return (
    <main className="flex py-5 px-5 gap-2">
      <Navbar setfilePath={setfilePath} />
      <div className="flex flex-col h-screen w-[50vw] items-center border-4 ml-7 px-2 py-2">
        <div className="container flex flex-col h-full items-center border px-2 py-2">
          <PDFViewer filePath={filePath} />
        </div>
      </div>
      <div className="flex flex-col h-full w-[50vw] items-center border-4 px-2 py-2 gap-2">
        <div className="flex h-full w-full border-2 rounded-md flex-col px-2 py-2 ">
          <div onClick={handleCollapse}>
            {collapsed ? (
              <div>
                <div className="flex justify-end ">
                  <FaArrowAltCircleUp />
                </div>
                <div className="w-full h-full">
                  <div>item 2</div>
                  <div>item 2</div>
                  <div>item 2</div>
                </div>
              </div>
            ) : (
              <div className="flex justify-end ">
                <FaArrowAltCircleDown />
              </div>
            )}
          </div>
        </div>
        <div className="flex h-full w-full border-2 rounded-md flex-col px-2 py-2">
          <Chatbox />
        </div>
      </div>
    </main>
  );
}
