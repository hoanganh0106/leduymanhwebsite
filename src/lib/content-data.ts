import { supabase, isSupabaseConfigured } from './supabase';
import {
  blogPosts as defaultPosts,
  courses as defaultCourses,
  defaultAboutImage,
  defaultHeroImage,
  mediaItems as defaultMedia,
  recentTours as defaultTours,
  workshops as defaultWorkshops,
} from '../content';
import type { BlogPost, Course, MediaItem, SiteImages, Tour, Workshop } from '../content';

/**
 * Each fetcher reads from Supabase when configured, ordered by `sort_order`.
 * On any error / empty table / missing config it returns the built-in defaults,
 * so the public site always renders something sensible.
 */

export async function fetchTours(): Promise<Tour[]> {
  if (!isSupabaseConfigured || !supabase) return defaultTours;
  const { data, error } = await supabase.from('tours').select('*').order('sort_order', { ascending: true });
  if (error || !data || data.length === 0) return defaultTours;
  return data as unknown as Tour[];
}

export async function fetchWorkshops(): Promise<Workshop[]> {
  if (!isSupabaseConfigured || !supabase) return defaultWorkshops;
  const { data, error } = await supabase.from('workshops').select('*').order('sort_order', { ascending: true });
  if (error || !data || data.length === 0) return defaultWorkshops;
  return data as unknown as Workshop[];
}

export async function fetchCourses(): Promise<Course[]> {
  if (!isSupabaseConfigured || !supabase) return defaultCourses;
  const { data, error } = await supabase.from('courses').select('*').order('sort_order', { ascending: true });
  if (error || !data || data.length === 0) return defaultCourses;
  return data as unknown as Course[];
}

export async function fetchPosts(): Promise<BlogPost[]> {
  if (!isSupabaseConfigured || !supabase) return defaultPosts;
  const { data, error } = await supabase.from('posts').select('*').order('sort_order', { ascending: true });
  if (error || !data || data.length === 0) return defaultPosts;
  return (data as Array<Record<string, string>>).map((post, index) => ({
    id: post.id || `post-${index + 1}`,
    slug: post.slug || `post-${index + 1}`,
    title: post.title || defaultPosts[index]?.title || 'Bài viết saxophone',
    excerpt: post.excerpt || post.content || defaultPosts[index]?.excerpt || defaultPosts[index]?.desc || '',
    content: post.content || post.excerpt || defaultPosts[index]?.content || defaultPosts[index]?.excerpt || defaultPosts[index]?.desc || '',
    image: post.image || defaultPosts[index]?.image || '',
    date: post.date || defaultPosts[index]?.date || '',
  }));
}

export async function fetchMedia(): Promise<MediaItem[]> {
  if (!isSupabaseConfigured || !supabase) return defaultMedia;
  const { data, error } = await supabase.from('media').select('*').order('sort_order', { ascending: true });
  if (error || !data || data.length === 0) return defaultMedia;
  return (data as Array<Record<string, string>>).map((item, index) => ({
    id: item.id || `media-${index + 1}`,
    title: item.title || defaultMedia[index]?.title || 'Video saxophone',
    category: item.category || defaultMedia[index]?.category || 'Video',
    duration: item.duration || defaultMedia[index]?.duration || '',
    thumbnail: item.thumbnail || defaultMedia[index]?.thumbnail || '',
    videoUrl: item.video_url || defaultMedia[index]?.videoUrl || '',
  }));
}

export async function fetchSiteImages(): Promise<SiteImages> {
  const defaults: SiteImages = {
    hero_image: defaultHeroImage,
    about_image: defaultAboutImage,
  };

  if (!isSupabaseConfigured || !supabase) return defaults;
  const { data, error } = await supabase.from('settings').select('key,value').in('key', ['hero_image', 'about_image']);
  if (error || !data || data.length === 0) return defaults;

  return (data as Array<{ key: keyof SiteImages; value: string }>).reduce<SiteImages>(
    (images, item) => ({
      ...images,
      [item.key]: item.value || images[item.key],
    }),
    defaults,
  );
}
