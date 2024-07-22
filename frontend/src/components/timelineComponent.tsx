import React from "react";

interface TimelineItem {
  label: string;
  status: "in progress" | "completed" | "pending";
}

const LoadingTimeline: React.FC<{ items: TimelineItem[] }> = ({ items }) => {
  return (
    <div className="flex flex-row justify-center gap-1">
      {items.map((item, index) => (
        <div key={index} className="flex items-center justify-center px-1">
          <div
            className={`w-4 h-4 rounded-full ${
              item.status === "completed"
                ? "bg-green-500"
                : item.status === "in progress"
                ? "bg-blue-500"
                : "bg-gray-300"
            }`}
          ></div>
          <span className={item.status === "in progress" ? "font-bold" : ""}>
            {item.label}
          </span>
          {item.status === "in progress" && (
            <div className="ml-auto animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-blue-500"></div>
          )}
        </div>
      ))}
    </div>
  );
};

export default LoadingTimeline;
