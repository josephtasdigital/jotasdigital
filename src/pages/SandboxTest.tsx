import { useParams, Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { ArrowLeft } from "lucide-react";

const titles: Record<string, string> = {
  click: "Click test successful",
  pageview: "Pageview test successful",
  form: "Form submit successful",
  newsletter: "Newsletter submit successful",
};

const SandboxTest = () => {
  const { type } = useParams<{ type: string }>();
  const title = titles[type ?? ""] ?? "Test Page";

  return (
    <>
      <Helmet>
        <meta name="robots" content="noindex" />
      </Helmet>
      <main className="min-h-screen bg-background flex flex-col items-center justify-center px-6">
        <h1 className="font-display text-4xl md:text-6xl font-bold text-foreground text-center">
          {title}
        </h1>
        <Link
          to="/playground"
          className="mt-8 inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors font-display text-xs uppercase tracking-wider"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Playground
        </Link>
      </main>
    </>
  );
};

export default SandboxTest;
