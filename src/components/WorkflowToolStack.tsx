import { useMemo } from "react";
import { getWorkflowTools } from "@/lib/markdown";

/**
 * "My workflow tool stack" — auto-sliding marquee carousel of tool logos.
 *
 * Items are sourced from Sveltia CMS (content/workflow-tools/*.md).
 * Default 8 placeholder slots are rendered when CMS has fewer entries,
 * so editors can populate / increase them at any time without code changes.
 *
 * Each tile matches the size of the WhoAmI highlight cards (compact square).
 */
const PLACEHOLDER_COUNT = 8;

const WorkflowToolStack = () => {
  const tools = getWorkflowTools();

  // Pad with placeholders so the carousel always has at least 8 tiles.
  const items = useMemo(() => {
    const list = tools.map((t) => ({
      title: (t.frontmatter.title as string) ?? "",
      image: (t.frontmatter.image as string) ?? "",
      url: (t.frontmatter.url as string) ?? "",
    }));
    while (list.length < PLACEHOLDER_COUNT) {
      list.push({ title: "", image: "", url: "" });
    }
    return list;
  }, [tools]);

  // Duplicate the track for a seamless infinite loop.
  const track = [...items, ...items];

  return (
    <section
      id="workflow-tools"
      className="border-t border-border"
      data-gtm="workflow-tools-section"
    >
      <div className="section-container">
        <span className="section-label">Stack</span>
        <h2 className="section-title">My workflow tool stack</h2>

        <div
          className="relative overflow-hidden mask-fade-x"
          style={{
            WebkitMaskImage:
              "linear-gradient(to right, transparent, black 8%, black 92%, transparent)",
            maskImage:
              "linear-gradient(to right, transparent, black 8%, black 92%, transparent)",
          }}
        >
          <div className="flex gap-4 sm:gap-6 animate-marquee whitespace-nowrap py-2">
            {track.map((item, i) => {
              const tile = (
                <div
                  className="flex items-center justify-center border border-border/60 rounded-sm bg-card/30 hover:border-primary/50 hover:bg-card/50 transition-all duration-300 shrink-0
                             w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 lg:w-36 lg:h-36 p-3"
                  title={item.title || "Tool"}
                >
                  {item.image ? (
                    <img
                      src={item.image}
                      alt={item.title || "Workflow tool"}
                      loading="lazy"
                      decoding="async"
                      className="max-w-full max-h-full object-contain"
                    />
                  ) : (
                    <span className="font-display text-[10px] uppercase tracking-widest text-muted-foreground/50">
                      Tool {(i % PLACEHOLDER_COUNT) + 1}
                    </span>
                  )}
                </div>
              );
              return item.url ? (
                <a
                  key={i}
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  data-gtm="workflow-tool-link"
                >
                  {tile}
                </a>
              ) : (
                <div key={i}>{tile}</div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default WorkflowToolStack;
