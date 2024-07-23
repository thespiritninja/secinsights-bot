import React, { useEffect, useRef, useState } from "react";
import { FaComputer, FaPen, FaUser } from "react-icons/fa6";
import { Button } from "@/components/ui/button";

interface ChatWindowProps {
  chatData: IChatStruct;
  setChatData: (chatData: IChatStruct) => void;
}

const ChatWindow: React.FC<ChatWindowProps> = ({ chatData, setChatData }) => {
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [annotatedAnswer, setAnnotatedAnswer] = useState<string>(
    chatData.answer
  );
  const currDiv = useRef<HTMLDivElement>(null);
  const currSave = useRef<HTMLButtonElement>(null);

  const handleAnnotate = (e: React.MouseEvent) => {
    if (currDiv.current && !currDiv.current.isContentEditable) {
      currDiv.current.contentEditable = "true";
      currDiv.current.focus();
      setIsEditing(true);
    }
  };

  const handleSave = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (currDiv.current) {
      const newContent = currDiv.current.textContent || "";
      setAnnotatedAnswer(newContent);
      setChatData({ ...chatData, answer: newContent });
      currDiv.current.contentEditable = "false";
      setIsEditing(false);
      console.log("Saved:", newContent);
    }
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (
      currDiv.current &&
      currSave.current &&
      !currDiv.current.contains(event.target as Node) &&
      !currSave.current.contains(event.target as Node)
    ) {
      setIsEditing(false);
      if (currDiv.current) {
        currDiv.current.contentEditable = "false";
      }
      console.log("Clicked outside, editing disabled");
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <>
      <div className="flex justify-end">
        <div className="border-2 rounded-lg mx-1 my-4 px-3">
          {chatData.input}
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
            onClick={handleAnnotate}
            ref={currDiv}
          >
            {annotatedAnswer}
            {isEditing && (
              <Button
                onClick={handleSave}
                ref={currSave}
                className="absolute bottom-0 right-0 h-[45%] w-[15%] mb-1 mr-1 bg-purple-700  text-white rounded-md"
              >
                <FaPen />
              </Button>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default ChatWindow;
