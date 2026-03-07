interface PdfViewerProps {
  src: string;
  title?: string;
}

const PdfViewer = ({ src, title }: PdfViewerProps) => {
  return (
    <div className="bg-card border border-border rounded-sm overflow-hidden mb-8">
      <div className="px-4 py-2 border-b border-border bg-muted/30">
        <span className="font-display text-xs text-muted-foreground">
          {title || "Document"}
        </span>
      </div>
      <iframe
        src={src}
        title={title || "PDF Document"}
        className="w-full border-none"
        style={{ height: "80vh" }}
        allow="fullscreen"
      />
    </div>
  );
};

export default PdfViewer;
