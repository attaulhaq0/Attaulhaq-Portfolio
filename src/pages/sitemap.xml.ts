import type { APIRoute } from 'astro';
import { projects } from '../data/projects';
import { clientCaseStudies } from '../data/client-case-studies';

export const GET: APIRoute = ({ site }) => {
  const escape = (value: string) => value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  const paths = ['/', '/freelance-work/', ...projects.map(project => `/work/${project.slug}/`), ...clientCaseStudies.map(study => `/freelance-work/${study.slug}/`)];
  const entries = site ? paths.map(path => `<url><loc>${escape(new URL(path, site).href)}</loc></url>`).join('') : '';
  return new Response(`<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${entries}</urlset>`, { headers: { 'Content-Type': 'application/xml; charset=utf-8' } });
};
