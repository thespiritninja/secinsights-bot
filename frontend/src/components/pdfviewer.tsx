import { GetStaticProps } from "next";
import React, { useState, useEffect } from "react";
import {
  Worker,
  Viewer,
  SpecialZoomLevel,
  DocumentLoadEvent,
  PageChangeEvent,
  ProgressBar,
} from "@react-pdf-viewer/core";
import { zoomPlugin } from "@react-pdf-viewer/zoom";
import { pageNavigationPlugin } from "@react-pdf-viewer/page-navigation";
import {
  highlightPlugin,
  RenderHighlightsProps,
} from "@react-pdf-viewer/highlight";
import "@react-pdf-viewer/core/lib/styles/index.css";
import "@react-pdf-viewer/default-layout/lib/styles/index.css";
import "@react-pdf-viewer/zoom/lib/styles/index.css";
import "@react-pdf-viewer/page-navigation/lib/styles/index.css";
import "@react-pdf-viewer/search/lib/styles/index.css";
import "@react-pdf-viewer/highlight/lib/styles/index.css";
import { Button } from "./ui/button";
import "./pdfStyle.css";

interface IContextData {
  pageContent: string;
  metadata: {
    detection_class_prob: number;
    coordinates: {
      points: number[][];
      system: string;
      layout_width: number;
      layout_height: number;
    };
    last_modified: string;
    filetype: string;
    languages: string[];
    page_number: number;
    parent_id: string;
    file_directory: string;
    filename: string;
  };
}
interface IChatStruct {
  input: string;
  chat_history?: any[];
  context: IContextData[];
  answer: string;
}

interface IModalContextData {
  pageContent: string;
  pageNumber: number;
}
const pdfjsVersion = "3.11.174";

interface ModalProps {
  isVisible: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ isVisible, onClose, children }) => {
  if (!isVisible) return null;

  return (
    <div className="fixed top-0 left-0 w-full h-full bg-white opacity-50 flex justify-center items-center z-10">
      <div className="bg-white p-[20px] rounded-lg w-[80%] max-w-600px z-20">
        <Button className="top-1" onClick={onClose}>
          Close
        </Button>
        {children}
      </div>
    </div>
  );
};

function PDFViewer({
  filePath,
  convoData,
}: {
  filePath: string;
  convoData: IChatStruct;
}) {
  const zoomPluginInstance = zoomPlugin();
  const { ZoomInButton, ZoomOutButton, ZoomPopover } = zoomPluginInstance;

  const pageNavigationPluginInstance = pageNavigationPlugin();
  const { GoToNextPage, GoToPreviousPage, CurrentPageInput, jumpToPage } =
    pageNavigationPluginInstance;

  const renderHighlights = (props: RenderHighlightsProps) => {
    return contextData.map((data, index) => {
      if (data.metadata.page_number - 1 !== props.pageIndex) {
        return null;
      }
      const layoutWidth = data.metadata.coordinates.layout_width;
      const layoutHeight = data.metadata.coordinates.layout_height;
      const points = data.metadata.coordinates.points;
      if (points.length === 4) {
        const [topLeft, bottomLeft, bottomRight, topRight] = points;

        const top = (topLeft[1] / layoutHeight) * 100;
        const left = (topLeft[0] / layoutWidth) * 100;
        const width = ((bottomRight[0] - topLeft[0]) / layoutWidth) * 100;
        const height = ((bottomLeft[1] - topLeft[1]) / layoutHeight) * 100;
        return (
          <div
            key={index}
            style={{
              position: "absolute",
              top: `${top}%`,
              left: `${left}%`,
              width: `${width}%`,
              height: `${height}%`,
              background: "rgba(255, 255, 0, 0.3)",
              border: "2px solid black",
              pointerEvents: "none",
              zIndex: 1000,
            }}
          />
        );
      }
      return null;
    });
  };
  const [isModalVisible, setModalVisible] = useState(false);
  const [modalContent, setModalContent] = useState<IModalContextData[]>([]);
  const highlightPluginInstance = highlightPlugin({
    renderHighlights,
  });
  const { jumpToHighlightArea } = highlightPluginInstance;
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [jumpPage, setJumpPage] = useState<number>(currentPage);
  const [contextData, setContextData] = useState<IContextData[]>(
    convoData?.context
  );

  const onDocumentLoadSuccess = (e: DocumentLoadEvent) => {
    setTotalPages(e.doc.numPages);
    contextData.map((data, index) => {
      setModalContent((modalContent) => {
        const isExisting = modalContent.some(
          (content) => content.pageNumber === data.metadata.page_number
        );
        if (!isExisting) {
          return [
            ...modalContent,
            {
              pageContent: data.pageContent,
              pageNumber: data.metadata.page_number,
            },
          ];
        }
        return modalContent;
      });
    });
  };

  const onPageChange = (e: PageChangeEvent) => {
    setCurrentPage(e.currentPage);
  };

  const highlightPage = () => {
    if (contextData.length > 0) {
      const pageNumbers = contextData.map((data) => data.metadata.page_number);
      const uniquePageNumbers = Array.from(new Set(pageNumbers));
      if (uniquePageNumbers.length > 0) {
        jumpToPage(uniquePageNumbers[0] - 1);
      }
    }
  };

  return (
    <Worker
      workerUrl={`https://unpkg.com/pdfjs-dist@${pdfjsVersion}/build/pdf.worker.min.js`}
    >
      <div className="h-full w-full flex flex-col">
        <div className="flex justify-between p-2">
          <div className="flex flex-wrap border-2 w-full items-center justify-between">
            <ZoomOutButton />
            <ZoomInButton />
            <ZoomPopover />
            <GoToPreviousPage />
            <GoToNextPage />
            <CurrentPageInput />
            <Button onClick={highlightPage} className="border p-1">
              Highlight Page
            </Button>
            <Button
              onClick={() => setModalVisible(true)}
              className="border p-1"
            >
              Open Modal
            </Button>
          </div>
        </div>
        <div className="flex relative overflow-hidden hover:overflow-y-auto">
          <Viewer
            fileUrl={filePath}
            defaultScale={SpecialZoomLevel.PageWidth}
            onDocumentLoad={onDocumentLoadSuccess}
            onPageChange={onPageChange}
            plugins={[
              zoomPluginInstance,
              pageNavigationPluginInstance,
              highlightPluginInstance,
            ]}
            renderLoader={(percentages: number) => (
              <div style={{ width: "240px" }}>
                <ProgressBar progress={Math.round(percentages)} />
              </div>
            )}
          />
        </div>
        <Modal
          isVisible={isModalVisible}
          onClose={() => setModalVisible(!isModalVisible)}
        >
          {modalContent?.map((content, index) => (
            <div key={index} className="p-2">
              Page {content.pageNumber}: {content.pageContent}
              <Button onClick={() => setModalVisible(false)}>Close</Button>
              <Button
                onClick={() => {
                  jumpToPage(content.pageNumber - 1);
                }}
              >
                Jump to Page
              </Button>
            </div>
          ))}
        </Modal>
      </div>
    </Worker>
  );
}

export default PDFViewer;
