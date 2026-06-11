import { describe, it, expect } from 'vitest';
import { NAV_ITEMS } from '@everyone-web/constants/nav';

describe('NAV_ITEMS', () => {
  it('exports a non-empty ReadonlyArray', () => {
    expect(Array.isArray(NAV_ITEMS)).toBe(true);
    expect(NAV_ITEMS.length).toBeGreaterThan(0);
  });

  it('contains the four canonical nav entries', () => {
    const labels = NAV_ITEMS.map(i => i.label);
    expect(labels).toContain('Servicios');
    expect(labels).toContain('Proyectos');
    expect(labels).toContain('Nosotros');
    expect(labels).toContain('Contacto');
    expect(NAV_ITEMS).toHaveLength(4);
  });

  it('each item has at minimum label and href', () => {
    for (const item of NAV_ITEMS) {
      expect(typeof item.label).toBe('string');
      expect(typeof item.href).toBe('string');
    }
  });

  it('Servicios item has a hash field', () => {
    const servicios = NAV_ITEMS.find(i => i.label === 'Servicios');
    expect(servicios).toBeDefined();
    expect(servicios!.hash).toBe('services');
  });

  it('items without hash have href pointing to their route', () => {
    const proyectos = NAV_ITEMS.find(i => i.label === 'Proyectos');
    const nosotros = NAV_ITEMS.find(i => i.label === 'Nosotros');
    const contacto = NAV_ITEMS.find(i => i.label === 'Contacto');
    expect(proyectos?.href).toBe('/projects');
    expect(nosotros?.href).toBe('/aboutUs');
    expect(contacto?.href).toBe('/contact');
  });
});
