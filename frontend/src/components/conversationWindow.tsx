import React, { useEffect, useRef, useState } from "react";
import { FaBook, FaComputer, FaPen, FaUser } from "react-icons/fa6";
import { Button } from "@/components/ui/button";
import { updateQuestionDBEntry } from "@/db/actions";

interface ChatWindowProps {
  chatData: IChatStruct[];
  setChatData: (chatData: IChatStruct[]) => void;
  questions: IQuestionStruct[];
  setConvoData: (currConvo: IChatStruct) => void;
}

const ChatWindow: React.FC<ChatWindowProps> = ({
  chatData,
  setChatData,
  questions,
  setConvoData,
}) => {
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [annotatedAnswers, setAnnotatedAnswers] = useState<string[]>([]);
  const currDivRefs = useRef<HTMLDivElement[]>([]);
  const currSaveRefs = useRef<HTMLButtonElement[]>([]);
  const latestEntryRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    setAnnotatedAnswers(chatData.map((chat) => chat.answer));
    setConvoData(chatData[chatData.length - 1]);

    if (latestEntryRef.current) {
      latestEntryRef.current.focus();
    }
  }, [chatData]);
  const handleAnnotate = (index: number) => {
    if (
      currDivRefs.current[index] &&
      !currDivRefs.current[index].isContentEditable
    ) {
      currDivRefs.current[index].contentEditable = "true";
      currDivRefs.current[index].focus();
      setEditingIndex(index);
    }
  };

  const formatData = (currChat: IChatStruct, annotated_answer: string) => {
    const annotatedData: dbConversationStruct = {
      q_id: questions[editingIndex].q_id,
      is_annotated: true,
      annotated_answer: annotated_answer,
      annotated_context: currChat.context,
    };
    return annotatedData;
  };

  const handleSave = async (index: number) => {
    if (currDivRefs.current[index]) {
      const newContent = currDivRefs.current[index].textContent || "";
      const updatedAnnotatedAnswers = [...annotatedAnswers];
      updatedAnnotatedAnswers[index] = newContent;
      setAnnotatedAnswers(updatedAnnotatedAnswers);

      const updatedChatData = chatData.map((chat, i) =>
        i === index ? { ...chat, answer: newContent } : chat
      );
      setChatData(updatedChatData);

      currDivRefs.current[index].contentEditable = "false";

      const updates = formatData(chatData[index], newContent);
      const response = await updateQuestionDBEntry(updates);
      setEditingIndex(null);

      console.log("Updated: ", response);
    }
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (editingIndex !== null) {
      if (
        currDivRefs.current[editingIndex] &&
        currSaveRefs.current[editingIndex] &&
        !currDivRefs.current[editingIndex].contains(event.target as Node) &&
        !currSaveRefs.current[editingIndex].contains(event.target as Node)
      ) {
        setEditingIndex(null);
        if (currDivRefs.current[editingIndex]) {
          currDivRefs.current[editingIndex].contentEditable = "false";
        }
        console.log("Clicked outside, editing disabled");
      }
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [editingIndex]);

  return (
    <>
      {chatData.length > 0 ? (
        chatData.map((chat, index) => (
          <div key={index}>
            <div className="flex justify-end">
              <div className="border-2 rounded-lg mx-1 my-4 px-3">
                {chat.input}
              </div>
              <div className="flex items-end p-2 mx-1 mt-3 bg-slate-500 h-fit rounded-full">
                <div>
                  <FaUser />
                </div>
              </div>
            </div>
            <div className="flex justify-start">
              <div className="flex items-start p-2 mx-1 mt-3 bg-purple-700 h-fit rounded-full text-white">
                <div>
                  <FaComputer />
                </div>
              </div>
              <div className="relative">
                <div
                  className="relative border-2 rounded-lg mx-1 my-4 px-3 hover:cursor-pointer"
                  title="Edit Answer"
                  onClick={() => handleAnnotate(index)}
                  ref={(el) => (currDivRefs.current[index] = el)}
                  tabIndex={index === chatData.length - 1 ? -1 : 0}
                >
                  {annotatedAnswers[index]}
                  {editingIndex === index && (
                    <Button
                      onClick={() => handleSave(index)}
                      ref={(el) => (currSaveRefs.current[index] = el)}
                      className="absolute bottom-0 right-0 h-[30px] w-[45px] mb-1 mr-1 bg-purple-700 text-white rounded-md"
                    >
                      <FaPen />
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))
      ) : (
        <div className="flex relative w-full h-full gap-2 justify-center items-center">
          <FaBook />
          Ask a question to get started!!!
        </div>
      )}
    </>
  );
};

export default ChatWindow;
