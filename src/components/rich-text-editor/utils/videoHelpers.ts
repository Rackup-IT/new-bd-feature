export const toEmbedUrl = (raw: string): string => {
  try {
    const u = new URL(raw, window.location.origin);
    const host = u.hostname.toLowerCase();

    // YouTube watch links -> embed
    if (host.includes("youtube.com")) {
      const v = u.searchParams.get("v");
      if (v) return `https://www.youtube.com/embed/${v}`;
      // handle /shorts/ or /embed/ paths
      const p = u.pathname.split("/").filter(Boolean);
      if (p[0] === "shorts" && p[1])
        return `https://www.youtube.com/embed/${p[1]}`;
      if (p[0] === "embed" && p[1])
        return `https://www.youtube.com/embed/${p[1]}`;
    }

    // youtu.be short links
    if (host === "youtu.be") {
      const id = u.pathname.replace(/^\//, "");
      if (id) return `https://www.youtube.com/embed/${id}`;
    }

    // Vimeo -> player url
    if (host.includes("vimeo.com")) {
      const p = u.pathname.split("/").filter(Boolean);
      const id = p.pop();
      if (id) return `https://player.vimeo.com/video/${id}`;
    }

    // default: return original
    return raw;
  } catch {
    return raw;
  }
};

export default toEmbedUrl;
