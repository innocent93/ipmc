import { describe, it, expect } from 'vitest';
import { SERVICES, SERVICE_CATEGORIES, getServiceBySlug, getServicesByCategory } from '../data/services';

describe('services fallback data', () => {
  it('has 32 real services with unique slugs', () => {
    expect(SERVICES.length).toBe(32);
    const slugs = SERVICES.map((s) => s.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
  });

  it('every service belongs to a real category', () => {
    const categoryIds = new Set(SERVICE_CATEGORIES.map((c) => c.id));
    for (const service of SERVICES) {
      expect(categoryIds.has(service.category)).toBe(true);
    }
  });

  it('every service has a non-empty title, summary and description', () => {
    for (const service of SERVICES) {
      expect(service.title.length).toBeGreaterThan(0);
      expect(service.summary.length).toBeGreaterThan(0);
      expect(service.description.length).toBeGreaterThan(0);
    }
  });

  it('getServiceBySlug finds a real service and returns null for an unknown one', () => {
    expect(getServiceBySlug('qa-qc')?.title).toBe('QA/QC (Third Party Inspection)');
    expect(getServiceBySlug('not-a-real-service')).toBeNull();
  });

  it('getServicesByCategory returns only services in that category', () => {
    const esgServices = getServicesByCategory('esg');
    expect(esgServices.length).toBeGreaterThan(0);
    expect(esgServices.every((s) => s.category === 'esg')).toBe(true);
  });

  it('every category has at least one service (no empty nav groups)', () => {
    for (const category of SERVICE_CATEGORIES) {
      expect(getServicesByCategory(category.id).length).toBeGreaterThan(0);
    }
  });
});
