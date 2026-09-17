import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { EslCircularImageMetricRowContentType } from './EslCircularImageMetricRow';
import { EslCircularImageMetricItemContentType } from './EslCircularImageMetricItem';
import EslCircularImageMetricRow from './EslCircularImageMetricRowRenderer';

function mockUrl(url: string) {
  return {
    type: null,
    default: url,
    hierarchical: null,
    internal: null,
    graph: null,
    base: null,
  };
}

function mockLink(text: string, href: string, target: string | null = null) {
  return {
    text,
    title: null,
    target,
    url: mockUrl(href),
  };
}

function mockImageRef(url: string) {
  return {
    key: 'img-metric',
    url: mockUrl(url),
    item: null,
  };
}

function mockRichText(text: string) {
  return {
    html: `<p>${text}</p>`,
    json: {
      type: 'richText' as const,
      children: [
        {
          type: 'paragraph',
          children: [{ text }],
        },
      ],
    },
  };
}

describe('EslCircularImageMetricRow CMS Component', () => {
  it('exposes correct Optimizely Content Type definitions for row and item', () => {
    expect(EslCircularImageMetricRowContentType.key).toBe('EslCircularImageMetricRow');
    expect(EslCircularImageMetricRowContentType.displayName).toBe('ESL Circular Image Metric Row');
    expect(EslCircularImageMetricRowContentType.baseType).toBe('_component');
    expect(EslCircularImageMetricRowContentType.compositionBehaviors).toEqual(['sectionEnabled']);

    expect(EslCircularImageMetricRowContentType.properties).toHaveProperty('eyebrow');
    expect(EslCircularImageMetricRowContentType.properties).toHaveProperty('title');
    expect(EslCircularImageMetricRowContentType.properties.description.type).toBe('richText');
    expect(EslCircularImageMetricRowContentType.properties).toHaveProperty('cta');
    expect(EslCircularImageMetricRowContentType.properties.metrics.type).toBe('array');

    expect(EslCircularImageMetricItemContentType.key).toBe('EslCircularImageMetricItem');
    expect(EslCircularImageMetricItemContentType.displayName).toBe('ESL Circular Image Metric Item');
    expect(EslCircularImageMetricItemContentType.properties.image.type).toBe('contentReference');
    expect(EslCircularImageMetricItemContentType.properties).toHaveProperty('imageAlt');
    expect(EslCircularImageMetricItemContentType.properties).toHaveProperty('stat');
    expect(EslCircularImageMetricItemContentType.properties).toHaveProperty('label');
  });

  it('returns null when content is null, empty, or has no metrics (strict Rule 3)', () => {
    const { container: c1 } = render(<EslCircularImageMetricRow content={null} />);
    expect(c1.firstChild).toBeNull();

    const { container: c2 } = render(<EslCircularImageMetricRow content={{}} />);
    expect(c2.firstChild).toBeNull();

    const { container: c3 } = render(
      <EslCircularImageMetricRow
        content={{
          title: 'Empty Metrics',
          metrics: [],
        }}
      />
    );
    expect(c3.firstChild).toBeNull();
  });

  it('renders a full section with title, eyebrow, rich text description, CTA, and metrics', () => {
    const content = {
      eyebrow: 'Community Impact',
      title: 'Making a difference locally.',
      description: mockRichText('We invest in our neighbors and community programs.'),
      cta: mockLink('Read Our Report', '/report'),
      metrics: [
        {
          image: mockImageRef('https://res.cloudinary.com/demo/image/upload/sample1.webp'),
          imageAlt: 'Volunteers planting trees',
          stat: '15,000+',
          label: 'Hours given to local parks',
        },
        {
          image: mockImageRef('https://res.cloudinary.com/demo/image/upload/sample2.webp'),
          imageAlt: 'Students receiving awards',
          stat: '$3.5M',
          label: 'Awarded in scholarships',
        },
        {
          image: mockImageRef('https://res.cloudinary.com/demo/image/upload/sample3.webp'),
          imageAlt: 'Community banking workshop',
          stat: '250',
          label: 'Workshops conducted',
        },
      ],
    };

    render(<EslCircularImageMetricRow content={content} />);

    expect(screen.getByText('Community Impact')).toBeDefined();
    expect(screen.getByText('Making a difference locally.')).toBeDefined();
    expect(screen.getByText('We invest in our neighbors and community programs.')).toBeDefined();

    const ctaLink = screen.getByRole('link', { name: /Read Our Report/i });
    expect(ctaLink.getAttribute('href')).toBe('/report');

    expect(screen.getByText('15,000+')).toBeDefined();
    expect(screen.getByText('Hours given to local parks')).toBeDefined();
    expect(screen.getByText('$3.5M')).toBeDefined();
    expect(screen.getByText('Awarded in scholarships')).toBeDefined();
    expect(screen.getByText('250')).toBeDefined();
    expect(screen.getByText('Workshops conducted')).toBeDefined();
  });

  it('filters out metrics without valid images or missing stat/label', () => {
    const content = {
      title: 'Filtered Metrics',
      description: mockRichText('Testing metric validation.'),
      metrics: [
        {
          image: mockImageRef('https://res.cloudinary.com/demo/image/upload/valid.webp'),
          imageAlt: 'Valid metric',
          stat: '500',
          label: 'Valid label',
        },
        {
          // Missing image
          image: null,
          stat: '999',
          label: 'Should not appear',
        },
        {
          // Missing stat
          image: mockImageRef('https://res.cloudinary.com/demo/image/upload/statless.webp'),
          stat: '',
          label: 'Missing stat',
        },
      ],
    };

    render(<EslCircularImageMetricRow content={content} />);

    expect(screen.getByText('500')).toBeDefined();
    expect(screen.getByText('Valid label')).toBeDefined();
    expect(screen.queryByText('999')).toBeNull();
    expect(screen.queryByText('Missing stat')).toBeNull();
  });

  it('supports wrapped composition node structure (content.component)', () => {
    const content = {
      component: {
        eyebrow: 'Wrapped Eyebrow',
        title: 'Wrapped Title',
        description: mockRichText('Wrapped description copy'),
        metrics: [
          {
            image: mockImageRef('https://res.cloudinary.com/demo/image/upload/wrapped.webp'),
            stat: '100%',
            label: 'Member satisfaction',
          },
        ],
      },
    };

    render(<EslCircularImageMetricRow content={content} />);

    expect(screen.getByText('Wrapped Eyebrow')).toBeDefined();
    expect(screen.getByText('Wrapped Title')).toBeDefined();
    expect(screen.getByText('100%')).toBeDefined();
    expect(screen.getByText('Member satisfaction')).toBeDefined();
  });
});
