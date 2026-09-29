export type RichTextPayload = {
  html?: string | null;
  json?: unknown | null;
  [key: string]: unknown;
};

function extractTextFromJson(node: unknown): string {
  if (!node || typeof node !== 'object') return '';
  const obj = node as Record<string, unknown>;
  let result = '';
  if (typeof obj.text === 'string') result += obj.text;
  if (Array.isArray(obj.children)) {
    for (const child of obj.children) result += extractTextFromJson(child);
  }
  if (Array.isArray(obj.content)) {
    for (const item of obj.content) result += extractTextFromJson(item);
  }
  return result;
}

export function extractPlainText(val?: RichTextPayload | string | null): string {
  if (!val) return '';
  if (typeof val === 'string') return val.trim();
  if (typeof val === 'object' && val !== null) {
    if (typeof val.html === 'string' && val.html.trim()) {
      return val.html.replace(/<[^>]*>/g, '').trim();
    }
    if (val.json && typeof val.json === 'object') {
      return extractTextFromJson(val.json).trim();
    }
  }
  return '';
}
