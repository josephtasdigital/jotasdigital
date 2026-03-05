import { useState, useCallback } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/esm/Page/AnnotationLayer.css";
import "react-pdf/dist/esm/Page/TextLayer.css";
import { ChevronLeft, ChevronRight, ZoomIn, ZoomOut } from "lucide-react";
import { Button } from "@/components/ui/button";

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

interface PdfViewerProps {
  src: string;
  title?: string;
}

const PdfViewer = ({ src, title }: PdfViewerProps) => {
  const [numPages, setNumPages] = useState<number>(0);
  const [pageNumber, setPageNumber] = useState(1);
  const [scale, setScale] = useState(1.2);

  const onDocumentLoadSuccess = useCallback(({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
    setPageNumber(1);
  }, []);

  return (
    <div className="bg-card border border-border rounded-sm overflow-hidden mb-8">
      {/* Controls */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-border bg-muted/30">
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setPageNumber((p) => Math.max(1, p - 1))}
            disabled={pageNumber <= 1}
            className="h-8 w-8"
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <span className="font-display text-xs text-muted-foreground tabular-nums">
            {pageNumber} / {numPages || "–"}
          </span>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setPageNumber((p) => Math.min(numPages, p + 1))}
            disabled={pageNumber >= numPages}
            className="h-8 w-8"
          >
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon" onClick={() => setScale((s) => Math.max(0.5, s - 0.2))} className="h-8 w-8">
            <ZoomOut className="w-4 h-4" />
          </Button>
          <span className="font-display text-xs text-muted-foreground w-12 text-center tabular-nums">
            {Math.round(scale * 100)}%
          </span>
          <Button variant="ghost" size="icon" onClick={() => setScale((s) => Math.min(3, s + 0.2))} className="h-8 w-8">
            <ZoomIn className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* PDF Render */}
      <div className="overflow-auto flex justify-center py-6" style={{ maxHeight: "80vh" }}>
        <Document file={src} onLoadSuccess={onDocumentLoadSuccess} loading={<p className="text-muted-foreground font-display text-sm py-20">Loading PDF…</p>}>
          <Page pageNumber={pageNumber} scale={scale} renderTextLayer renderAnnotationLayer />
        </Document>
      </div>
    </div>
  );
};

export default PdfViewer;
