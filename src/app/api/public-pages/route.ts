import { readdir, readFile } from 'node:fs/promises';
import path from 'node:path';
import { NextResponse } from 'next/server';

const PUBLIC_DIR = path.join(process.cwd(), 'public');

const TITLE = /<title[^>]*>([\s\S]*?)<\/title>/i;

const titleOf = (html: string, fallback: string) =>
  TITLE.exec(html)?.[1].replace(/\s+/g, ' ').trim() || fallback;

/**
 * The standalone HTML pages in /public, for the floating page navigator they all embed
 * (`public/pages-widget.js`). Discovered from disk so a new page shows up without editing a list.
 */
export async function GET() {
  const files = (await readdir(PUBLIC_DIR)).filter((name) => name.endsWith('.html')).sort();
  const pages = await Promise.all(
    files.map(async (name) => ({
      path: `/${name}`,
      title: titleOf(await readFile(path.join(PUBLIC_DIR, name), 'utf8'), name),
    }))
  );
  return NextResponse.json({ pages }, { headers: { 'Cache-Control': 'no-store' } });
}
