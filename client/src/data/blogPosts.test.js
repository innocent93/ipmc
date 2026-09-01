import { describe, it, expect } from 'vitest';
import { FALLBACK_POSTS, getFallbackPost, getFallbackRelated } from '../data/blogPosts';

describe('blogPosts fallback data', () => {
  it('has at least one post and every post has a unique slug', () => {
    expect(FALLBACK_POSTS.length).toBeGreaterThan(0);
    const slugs = FALLBACK_POSTS.map((p) => p.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
  });

  it('getFallbackPost finds a post by slug', () => {
    const target = FALLBACK_POSTS[0];
    expect(getFallbackPost(target.slug)).toEqual(target);
  });

  it('getFallbackPost returns null for an unknown slug', () => {
    expect(getFallbackPost('this-slug-does-not-exist')).toBeNull();
  });

  it('getFallbackRelated never includes the current post and respects the limit', () => {
    const target = FALLBACK_POSTS[0];
    const related = getFallbackRelated(target.slug, 2);
    expect(related.length).toBeLessThanOrEqual(2);
    expect(related.find((p) => p.slug === target.slug)).toBeUndefined();
  });
});
