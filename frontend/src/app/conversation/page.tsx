"use client";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import React from "react";

function Conversations() {
  const router = useRouter();
  return (
    <div>
      <ul>
        <li>
          <Button
            onClick={() => {
              router.push(`/conversation/${1}`);
            }}
          >
            Click for 1
          </Button>
        </li>
        <li>
          <Button
            onClick={() => {
              router.push(`/conversation/${2}`);
            }}
          >
            Click for 2
          </Button>
        </li>
        <li>
          <Button
            onClick={() => {
              router.push(`/conversation/${3}`);
            }}
          >
            Click for 3
          </Button>
        </li>
      </ul>
    </div>
  );
}

export default Conversations;
