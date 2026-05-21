import { CSSProperties, ImgHTMLAttributes } from "react";

interface AnimatedAssetProps extends Omit<ImgHTMLAttributes<HTMLImageElement>, "src" | "loading" | "decoding"> {
  src?: string | null;
  alt: string;
  width?: number;
  height?: number;
  /** Aspect ratio as "W / H" or numeric. Used when width/height not provided. */
  aspectRatio?: string | number;
  /** Optional fallback node when src is missing. */
  fallback?: React.ReactNode;
  containerClassName?: string;
  containerStyle?: CSSProperties;
}

/**
 * High-performance wrapper for CMS-provided animated assets (GIF / animated WebP / PNG).
 *
 * - `loading="lazy"`  → defers off-screen asset loading
 * - `decoding="async"` → offloads decode work from the main thread
 * - Explicit width/height OR CSS aspect-ratio container → prevents CLS
 *   before the heavy animated asset finishes loading.
 */
const AnimatedAsset = ({
  src,
  alt,
  width,
  height,
  aspectRatio = "1 / 1",
  fallback = null,
  className,
  containerClassName,
  containerStyle,
  style,
  ...rest
}: AnimatedAssetProps) => {
  if (!src) return <>{fallback}</>;

  const ar =
    typeof aspectRatio === "number" ? String(aspectRatio) : aspectRatio;

  return (
    <div
      className={containerClassName}
      style={{
        aspectRatio: width && height ? undefined : ar,
        width: width ? `${width}px` : undefined,
        height: height ? `${height}px` : undefined,
        ...containerStyle,
      }}
    >
      <img
        src={src}
        alt={alt}
        width={width}
        height={height}
        loading="lazy"
        decoding="async"
        className={className}
        style={{
          display: "block",
          width: "100%",
          height: "100%",
          objectFit: "contain",
          ...style,
        }}
        {...rest}
      />
    </div>
  );
};

export default AnimatedAsset;
