export type VideoType = "youtube" | "vimeo" | "local" | "embed";

export interface VideoSource {
  type: VideoType;
  src: string;
}

export function parseVideoSource(url?: string): VideoSource | null {
  if (!url) return null;
  const trimmed = url.trim();

  // YouTube match
  const ytMatch = trimmed.match(
    /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?|shorts)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/i
  );
  if (ytMatch && ytMatch[1]) {
    return {
      type: "youtube",
      src: `https://www.youtube-nocookie.com/embed/${ytMatch[1]}?autoplay=1&rel=0`,
    };
  }

  // Vimeo match
  const vimeoMatch = trimmed.match(
    /(?:vimeo\.com\/(?:channels\/(?:\w+\/)?|groups\/[^\/]*\/videos\/|album\/(?:\d+\/)?video\/|video\/|)(\d+))/i
  );
  if (vimeoMatch && vimeoMatch[1]) {
    return {
      type: "vimeo",
      src: `https://player.vimeo.com/video/${vimeoMatch[1]}?autoplay=1`,
    };
  }

  // Local or direct video file (.mp4, .webm, .ogg, etc.)
  if (/\.(mp4|webm|ogg|mov)(\?.*)?$/i.test(trimmed) || trimmed.startsWith("/videos/")) {
    return {
      type: "local",
      src: trimmed,
    };
  }

  // Generic embed
  return {
    type: "embed",
    src: trimmed,
  };
}

export interface TestimonialAuthorData {
  name: string;
  role?: string;
  location?: string;
}

export function formatAuthor(author: TestimonialAuthorData | string): {
  primary: string;
  meta: string;
} {
  if (typeof author === "string") {
    if (author.includes("·")) {
      const [primary, ...rest] = author.split("·");
      return { primary: primary.trim(), meta: rest.join("·").trim() };
    }
    return { primary: author, meta: "" };
  }
  return {
    primary: `${author.name}${author.role ? `, ${author.role}` : ""}`,
    meta: author.location || "",
  };
}

export function formatQuote<T>(quote: T): T {
  if (typeof quote === "string") {
    return quote.replace(/^["“]|["”]$/g, "") as unknown as T;
  }
  return quote;
}

