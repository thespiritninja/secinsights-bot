"use client";
import Chatbox from "@/components/chatbox";
import ChatWindow from "@/components/conversationWindow";
import Navbar from "@/components/navbar";
import PDFViewer from "@/components/pdfviewer";
import LoadingTimeline from "@/components/timelineComponent";
import { Button } from "@/components/ui/button";
import {
  createTestEntry,
  createQuestionDBEntry,
  getAnnotatedQuestions,
} from "@/db/actions";
import { useState } from "react";
import { FaArrowAltCircleDown } from "react-icons/fa";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

const sampleConvoData = {
  input: "can you give me 3Ms sales in millions for america?",
  chat_history: [],
  context: [
    {
      pageContent:
        "Americas included United States net sales to customers of $15.0 billion, $15.0 billion and $13.9 billion in 2022, 2021 and 2020, respectively. Asia Pacific included China/Hong Kong net sales to customers of $3.8 billion, $4.0 billion and $3.5 billion in 2022, 2021 and 2020, respectively.",
      metadata: {
        detection_class_prob: 0.9183875322341919,
        coordinates: {
          points: [
            [53.574153900146484, 1736.626953125],
            [53.574153900146484, 1782.186769885691],
            [1604.612060546875, 1782.186769885691],
            [1604.612060546875, 1736.626953125],
          ],
          system: "PixelSpace",
          layout_width: 1700,
          layout_height: 2200,
        },
        last_modified: "2024-07-18T20:23:11",
        filetype: "application/pdf",
        languages: ["eng"],
        page_number: 60,
        parent_id: "0865bad67409a6435977487a0010a5fd",
        file_directory: "/content",
        filename: "3M_10K.pdf",
      },
    },
    {
      pageContent:
        "Americas included United States net sales to customers of $15.0 billion, $15.0 billion and $13.9 billion in 2022, 2021 and 2020, respectively. Asia Pacific included China/Hong Kong net sales to customers of $3.8 billion, $4.0 billion and $3.5 billion in 2022, 2021 and 2020, respectively.",
      metadata: {
        detection_class_prob: 0.9183875322341919,
        coordinates: {
          points: [
            [53.574153900146484, 1736.626953125],
            [53.574153900146484, 1782.186769885691],
            [1604.612060546875, 1782.186769885691],
            [1604.612060546875, 1736.626953125],
          ],
          system: "PixelSpace",
          layout_width: 1700,
          layout_height: 2200,
        },
        last_modified: "2024-07-18T20:23:11",
        filetype: "application/pdf",
        languages: ["eng"],
        page_number: 60,
        parent_id: "0865bad67409a6435977487a0010a5fd",
        file_directory: "/content",
        filename: "3M_10K.pdf",
      },
    },
    {
      pageContent:
        "3M manages its operations in four operating business segments: Safety and Industrial; Transportation and Electronics; Health Care; and Consumer. From a geographic perspective, any references to EMEA refer to Europe, Middle East and Africa on a combined basis. References are made to organic sales change (which include both organic volume impacts and selling price impacts), which is defined as the change in net sales, absent the separate impacts on sales from foreign currency translation and acquisitions, net of divestitures. Acquisition and divestiture sales change impacts, if any, are measured separately for the first twelve months post-transaction. 3M believes this information is useful to investors and management in understanding ongoing operations and in analysis of ongoing operating trends.",
      metadata: {
        detection_class_prob: 0.9384881854057312,
        coordinates: {
          points: [
            [67.3896713256836, 931.798828125],
            [67.3896713256836, 1048.8534766211017],
            [1594.9258545187718, 1048.8534766211017],
            [1594.9258545187718, 931.798828125],
          ],
          system: "PixelSpace",
          layout_width: 1700,
          layout_height: 2200,
        },
        last_modified: "2024-07-18T20:23:11",
        filetype: "application/pdf",
        languages: ["eng"],
        page_number: 19,
        parent_id: "f283880b22260d80d360b7da400419c0",
        file_directory: "/content",
        filename: "3M_10K.pdf",
      },
    },
    {
      pageContent:
        "3M manages its operations in four operating business segments: Safety and Industrial; Transportation and Electronics; Health Care; and Consumer. From a geographic perspective, any references to EMEA refer to Europe, Middle East and Africa on a combined basis. References are made to organic sales change (which include both organic volume impacts and selling price impacts), which is defined as the change in net sales, absent the separate impacts on sales from foreign currency translation and acquisitions, net of divestitures. Acquisition and divestiture sales change impacts, if any, are measured separately for the first twelve months post-transaction. 3M believes this information is useful to investors and management in understanding ongoing operations and in analysis of ongoing operating trends.",
      metadata: {
        detection_class_prob: 0.9384881854057312,
        coordinates: {
          points: [
            [67.3896713256836, 931.798828125],
            [67.3896713256836, 1048.8534766211017],
            [1594.9258545187718, 1048.8534766211017],
            [1594.9258545187718, 931.798828125],
          ],
          system: "PixelSpace",
          layout_width: 1700,
          layout_height: 2200,
        },
        last_modified: "2024-07-18T20:23:11",
        filetype: "application/pdf",
        languages: ["eng"],
        page_number: 19,
        parent_id: "f283880b22260d80d360b7da400419c0",
        file_directory: "/content",
        filename: "3M_10K.pdf",
      },
    },
    {
      pageContent:
        "3M products are sold through numerous distribution channels, including directly to users and through numerous e-commerce and traditional wholesalers, retailers, jobbers, distributors and dealers in a wide variety of trades in many countries around the world. Management believes the confidence of wholesalers, retailers, jobbers, distributors and dealers in 3M and its products — a confidence developed through long association with skilled marketing and sales representatives — has contributed significantly to 3M’s position in the marketplace and to its growth.",
      metadata: {
        detection_class_prob: 0.94181227684021,
        coordinates: {
          points: [
            [66.13577270507812, 1247.186694644026],
            [66.13577270507812, 1338.853362571108],
            [1579.2623126367314, 1338.853362571108],
            [1579.2623126367314, 1247.186694644026],
          ],
          system: "PixelSpace",
          layout_width: 1700,
          layout_height: 2200,
        },
        last_modified: "2024-07-18T20:23:11",
        filetype: "application/pdf",
        languages: ["eng"],
        page_number: 5,
        parent_id: "4edb7a3dbfca32da877a65d3747a6180",
        file_directory: "/content",
        filename: "3M_10K.pdf",
      },
    },
    {
      pageContent:
        "3M products are sold through numerous distribution channels, including directly to users and through numerous e-commerce and traditional wholesalers, retailers, jobbers, distributors and dealers in a wide variety of trades in many countries around the world. Management believes the confidence of wholesalers, retailers, jobbers, distributors and dealers in 3M and its products — a confidence developed through long association with skilled marketing and sales representatives — has contributed significantly to 3M’s position in the marketplace and to its growth.",
      metadata: {
        detection_class_prob: 0.94181227684021,
        coordinates: {
          points: [
            [66.13577270507812, 1247.186694644026],
            [66.13577270507812, 1338.853362571108],
            [1579.2623126367314, 1338.853362571108],
            [1579.2623126367314, 1247.186694644026],
          ],
          system: "PixelSpace",
          layout_width: 1700,
          layout_height: 2200,
        },
        last_modified: "2024-07-18T20:23:11",
        filetype: "application/pdf",
        languages: ["eng"],
        page_number: 5,
        parent_id: "4edb7a3dbfca32da877a65d3747a6180",
        file_directory: "/content",
        filename: "3M_10K.pdf",
      },
    },
    {
      pageContent:
        "For the full year 2022, in the Americas geographic area, U.S. total sales were flat which included increased organic sales of 1 percent. Total sales in Mexico increased 8 percent which included increased organic sales of 12 percent. In Canada, total sales increased 9 percent which included increased organic sales of 13 percent. In Brazil, total sales increased 15 percent which included increased organic sales of 12 percent. In the Asia Pacific geographic area, China total sales decreased 6 percent which included decreased organic sales of 3 percent. In Japan, total sales decreased 12 percent which included increased organic sales of 2 percent.",
      metadata: {
        detection_class_prob: 0.914621889591217,
        coordinates: {
          points: [
            [97.96556854248047, 222.3409423828125],
            [97.96556854248047, 315.5201297231956],
            [1603.1946046324672, 315.5201297231956],
            [1603.1946046324672, 222.3409423828125],
          ],
          system: "PixelSpace",
          layout_width: 1700,
          layout_height: 2200,
        },
        last_modified: "2024-07-18T20:23:11",
        filetype: "application/pdf",
        languages: ["eng"],
        page_number: 26,
        parent_id: "4a0a0bc4d5b9fd769cea3a037c0bfa09",
        file_directory: "/content",
        filename: "3M_10K.pdf",
      },
    },
  ],
  answer:
    "3M's sales in the Americas were $15,000 million for each of the years 2022 and 2021, and $13,900 million for 2020.",
};
export default function Home() {
  const [filePath, setfilePath] = useState<string>("/3M_10K_File.pdf");
  const [collapsed, setCollapsed] = useState(false);
  const [convoData, setConvoData] = useState<IChatStruct>(sampleConvoData);
  const [questions, setQuestions] = useState<IQuestionStruct[]>([]);
  const [loading, setLoading] = useState(false);
  const [timelineItems, setTimelineItems] = useState([
    { label: "Searching document for", status: "pending" as const },
    { label: "Defining Terminology", status: "pending" as const },
    { label: "Calculating ROA", status: "pending" as const },
  ]);

  const handleCollapse = () => {
    setCollapsed(!collapsed);
  };
  const formatQuestionData = (data: IChatStruct) => {
    const dbData: dbConversationStruct = {
      q_id: crypto.randomUUID(),
      question: data.input,
      model_answer: data.answer,
      model_context: data.context,
      is_annotated: false,
      annotated_answer: "",
      annotated_context: data.context,
    };
    return dbData;
  };
  const handleSubmit = async (values: { question: string }) => {
    setLoading(true);
    !collapsed ? setCollapsed(true) : setLoading(false);
    setTimeout(() => {
      setTimelineItems([
        { label: "Searching document for", status: "in progress" as const },
        { label: "Defining Terminology", status: "pending" as const },
        { label: "Calculating ROA", status: "pending" as const },
      ]);
    }, 1000);

    setTimeout(() => {
      setTimelineItems([
        { label: "Searching document for", status: "completed" as const },
        { label: "Defining Terminology", status: "in progress" as const },
        { label: "Calculating ROA", status: "pending" as const },
      ]);
    }, 3000);

    setTimeout(() => {
      setTimelineItems([
        { label: "Searching document for", status: "completed" as const },
        { label: "Defining Terminology", status: "completed" as const },
        { label: "Calculating ROA", status: "in progress" as const },
      ]);
    }, 5000);

    setTimeout(() => {
      setTimelineItems([
        { label: "Searching document for", status: "completed" as const },
        { label: "Defining Terminology", status: "completed" as const },
        { label: "Calculating ROA", status: "completed" as const },
      ]);
      setLoading(false);
    }, 6000);
    await createTestEntry();
    const questionData = formatQuestionData(convoData);
    const response = await createQuestionDBEntry(questionData);
    setQuestions([
      ...questions,
      { question: values.question, q_id: response.q_id },
    ]);
  };
  const handleImportAnnotation = async () => {
    const response = await getAnnotatedQuestions();
    console.log(response);
    const data = [
      {
        q_id: response.q_id,
        question: response.question,
        model_answer: response.model_answer,
        model_context: JSON.stringify(response.model_context),
        is_annotated: response.is_annotated,
        annotated_answer: response.annotated_answer,
        annotated_context: JSON.stringify(response.annotated_context),
      },
    ];

    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Annotations");

    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });
    const blob = new Blob([excelBuffer], { type: "application/octet-stream" });

    saveAs(blob, "annotations.xlsx");
  };

  return (
    <main className="flex gap-2">
      <Navbar setfilePath={setfilePath} />
      <div className="flex flex-col h-screen w-[50vw] items-center border-4 ml-7 px-2 py-2">
        <div className="container flex flex-col h-full items-center border px-2 py-2">
          <PDFViewer filePath={filePath} convoData={convoData} />
        </div>
      </div>
      <div className="flex flex-col h-screen w-[50vw]  border-4 px-2 py-2 gap-2">
        <div className="flex flex-col w-full h-[70%] border-2 rounded-md overflow-y-scroll">
          <ChatWindow
            chatData={convoData}
            setChatData={setConvoData}
            questions={questions}
          />
        </div>
        <div
          className="flex h-[30%] w-full border-2 rounded-md flex-col px-2 py-2 "
          onClick={handleCollapse}
        >
          <div className="flex justify-start items-center">
            <LoadingTimeline items={timelineItems} />
          </div>
          {collapsed ? (
            <div className="flex flex-col">
              <div>item 2</div>
              <div>item 2</div>
              <div>item 2</div>
            </div>
          ) : (
            <div className="flex justify-end ">
              <FaArrowAltCircleDown />
            </div>
          )}
        </div>
        <div className="flex h-[30%] w-full border-2 rounded-md flex-col px-2 py-2">
          <Chatbox onSubmit={handleSubmit} />
        </div>
        <div className="flex justify-end bottom-0 right-0">
          <Button onClick={handleImportAnnotation}>
            Import Annotated Questions
          </Button>
        </div>
      </div>
    </main>
  );
}
