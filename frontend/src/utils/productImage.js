const supabaseUrl = import.meta.env.VITE_SUPABASE_URL?.replace(/\/$/, "");

export function getProductImageUrl(imagePath) {
  if (!imagePath) return "";

  // Keep full URLs and local preview URLs unchanged.
  if (/^(https?:\/\/|blob:)/i.test(imagePath)) {
    return imagePath;
  }

  if (!supabaseUrl) {
    console.error("VITE_SUPABASE_URL is not configured");
    return "";
  }

  const encodedPath = imagePath
    .replace(/^\/+/, "")
    .split("/")
    .map(encodeURIComponent)
    .join("/");

  return `${supabaseUrl}/storage/v1/object/public/product-images/${encodedPath}`;
}