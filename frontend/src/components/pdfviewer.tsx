import { GetStaticProps } from "next";
import React, { useState, useEffect, useRef } from "react";
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
import { FaX } from "react-icons/fa6";
import { FaSearch } from "react-icons/fa";

const pdfjsVersion = "3.11.174";

interface ModalProps {
  isVisible: boolean;
  onClose: () => void;
  children: React.ReactNode;
  width: number;
  height: number;
}

const Modal: React.FC<ModalProps> = ({
  isVisible,
  onClose,
  children,
  width,
  height,
}) => {
  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 flex items-center z-10 bg-black bg-opacity-50">
      <div
        className="bg-white left-10 px-4 py-2 rounded-lg overflow-auto relative"
        style={{
          width: `${width}px`,
          height: `${height}px`,
          maxWidth: "90vw",
          maxHeight: "90vh",
        }}
      >
        <div className="flex justify-end items-center pb-1">
          <Button
            className="top-2 right-2 w-[45px] h-[45px] rounded-full"
            onClick={onClose}
          >
            <FaX title="Close" />
          </Button>
        </div>
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
    return contextData?.map((data, index) => {
      if (data.metadata.page_number - 1 !== props.pageIndex) {
        return null;
      }
      const layoutWidth = data.metadata.coordinates_layout_width;
      const layoutHeight = data.metadata.coordinates_layout_height;
      const points = JSON.parse(data.metadata.coordinates_points);
      if (points?.length === 4) {
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
  const [contextData, setContextData] = useState<IUpdateContextData[]>(
    convoData?.context
  );
  const [viewerDimensions, setViewerDimensions] = useState({
    width: 0,
    height: 0,
  });
  const viewerRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const updateDimensions = () => {
      if (viewerRef.current) {
        setViewerDimensions({
          width: viewerRef.current.offsetWidth,
          height: viewerRef.current.offsetHeight,
        });
      }
    };

    updateDimensions();
    window.addEventListener("resize", updateDimensions);

    return () => window.removeEventListener("resize", updateDimensions);
  }, []);
  useEffect(() => {
    setContextData(convoData?.context);
  }, [convoData]);
  useEffect(() => {
    setModalContent(
      contextData?.map((data) => ({
        pageContent: data.pageContent,
        pageNumber: data.metadata.page_number,
      }))
    );
  }, [contextData]);

  const onDocumentLoadSuccess = (e: DocumentLoadEvent) => {
    setTotalPages(e.doc.numPages);
    contextData?.forEach((data) => {
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

  return (
    <Worker
      workerUrl={`https://unpkg.com/pdfjs-dist@${pdfjsVersion}/build/pdf.worker.min.js`}
    >
      <div className="h-full w-full flex flex-col relative">
        <div className="flex justify-between p-2">
          <div className="flex flex-wrap border-2 w-full items-center justify-between">
            <ZoomOutButton />
            <ZoomInButton />
            <ZoomPopover />
            <GoToPreviousPage />
            <GoToNextPage />
            <CurrentPageInput />
            <Button
              onClick={() => setModalVisible(true)}
              className="border p-1"
            >
              Context
            </Button>
          </div>
        </div>
        <div
          className="flex relative overflow-hidden hover:overflow-y-auto h-full"
          ref={viewerRef}
        >
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
          <Modal
            isVisible={isModalVisible}
            onClose={() => setModalVisible(!isModalVisible)}
            width={viewerDimensions.width}
            height={viewerDimensions.height}
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
              {modalContent?.map((content, index) => (
                <div
                  key={index}
                  className="p-4 bg-white rounded-lg shadow-md border h-64 overflow-hidden flex flex-col"
                >
                  <div className="font-semibold text-lg mb-2 bg-blue-500 w-[30px] h-[30px] rounded-full text-center">
                    {index + 1}
                  </div>
                  <div className="text-gray-700 w-150 h-60 overflow-hidden overflow-ellipsis whitespace-normal hover:overflow-y-auto">
                    {content.pageContent}
                  </div>
                  <div className="mt-4 flex justify-between">
                    <Button
                      onClick={() => {
                        setModalContent((modalContent) => {
                          const updatedContent = [...modalContent];
                          updatedContent.splice(index, 1);
                          return updatedContent;
                        });
                      }}
                    >
                      <FaX title="Close" />
                    </Button>
                    <Button
                      onClick={() => {
                        jumpToPage(content.pageNumber - 1);
                        setModalVisible(false);
                      }}
                      title={`Show on page ${content.pageNumber}`}
                    >
                      <FaSearch />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </Modal>
        </div>
      </div>
    </Worker>
  );
}

export default PDFViewer;
