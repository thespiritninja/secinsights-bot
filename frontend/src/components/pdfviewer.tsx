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
import { searchPlugin } from "@react-pdf-viewer/search";
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
  chat_history?: [];
  context: IContextData[];
}
const pdfjsVersion = "3.11.174";

function PDFViewer({ filePath }: { filePath: string }) {
  const zoomPluginInstance = zoomPlugin();
  const { ZoomInButton, ZoomOutButton, ZoomPopover } = zoomPluginInstance;

  const pageNavigationPluginInstance = pageNavigationPlugin();
  const { GoToNextPage, GoToPreviousPage, CurrentPageInput, jumpToPage } =
    pageNavigationPluginInstance;

  const searchPluginInstance = searchPlugin();
  const { Search } = searchPluginInstance;

  const renderHighlights = (props: RenderHighlightsProps) => {
    console.log("renderHighlights called", props);
    console.log("contextData", contextData);

    return contextData.map((data, index) => {
      if (data.metadata.page_number - 1 !== props.pageIndex) {
        return null;
      }

      console.log("Rendering highlight for page", props.pageIndex + 1);

      const highlightAreas = data.metadata.coordinates.points.map(
        (point, idx) => ({
          top: (point[1] / data.metadata.coordinates.layout_height) * 100,
          left: (point[0] / data.metadata.coordinates.layout_width) * 100,
          width:
            ((data.metadata.coordinates.points[2][0] -
              data.metadata.coordinates.points[0][0]) /
              data.metadata.coordinates.layout_width) *
            100,
          height:
            ((data.metadata.coordinates.points[1][1] -
              data.metadata.coordinates.points[0][1]) /
              data.metadata.coordinates.layout_height) *
            100,
        })
      );

      console.log("highlightAreas", highlightAreas);

      return highlightAreas.map((area, idx) => (
        <div
          key={idx}
          style={{
            position: "absolute",
            top: `${area.top}%`,
            left: `${area.left}%`,
            width: `${area.width}%`,
            height: `${area.height}%`,
            background: "rgba(255, 0, 0, 0.5)", // Changed to red with higher opacity
            border: "2px solid black", // Added border
            pointerEvents: "none",
            zIndex: 1000, // Ensure it's on top of other elements
          }}
        />
      ));
    });
  };

  const highlightPluginInstance = highlightPlugin({
    renderHighlights,
  });
  const { jumpToHighlightArea } = highlightPluginInstance;
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [jumpPage, setJumpPage] = useState<number>(currentPage);
  const [contextData, setContextData] = useState<IContextData[]>([
    {
      pageContent: "Example content",
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
        page_number: 26,
        parent_id: "0865bad67409a6435977487a0010a5fd",
        file_directory: "/content",
        filename: "3M_10K.pdf",
      },
    },
  ]);

  const onDocumentLoadSuccess = (e: DocumentLoadEvent) => {
    console.log("PDF loaded successfully", e);
    setTotalPages(e.doc.numPages);
  };

  const onPageChange = (e: PageChangeEvent) => {
    setCurrentPage(e.currentPage);
  };

  const highlightPage = () => {
    if (contextData.length > 0) {
      const pageNumbers = contextData.map((data) => data.metadata.page_number);
      const uniquePageNumbers = Array.from(new Set(pageNumbers));
      console.log("Unique page numbers to highlight:", uniquePageNumbers);
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
          </div>
        </div>
        {/* <div className="flex p-2">
          <Search>
            {({ searchFor, clearKeyword }) => (
              <div className="flex flex-row items-center gap-2">
                <input
                  type="text"
                  placeholder="Enter text to search"
                  onChange={(e) => searchFor([e.target.value])}
                  className="border p-1"
                />
                <button onClick={clearKeyword} className="border p-1">
                  Clear
                </button>
              </div>
            )}
          </Search>
        </div> */}
        <div className="flex relative overflow-hidden hover:overflow-y-auto">
          <Viewer
            fileUrl={filePath}
            defaultScale={SpecialZoomLevel.PageWidth}
            onDocumentLoad={onDocumentLoadSuccess}
            onPageChange={onPageChange}
            plugins={[
              zoomPluginInstance,
              pageNavigationPluginInstance,
              searchPluginInstance,
              highlightPluginInstance,
            ]}
            renderLoader={(percentages: number) => (
              <div style={{ width: "240px" }}>
                <ProgressBar progress={Math.round(percentages)} />
              </div>
            )}
          />
        </div>
      </div>
    </Worker>
  );
}

export default PDFViewer;
