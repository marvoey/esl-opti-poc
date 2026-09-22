import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import EslAccordionCardGrid from './EslAccordionCardGridRenderer';
import { EslAccordionCardGridContentType } from './EslAccordionCardGrid';
import { EslAccordionCardItemContentType } from './EslAccordionCardItem';

describe('EslAccordionCardGrid Content Type & Renderer', () => {
  it('defines EslAccordionCardGrid with expected properties and richText description', () => {
    expect(EslAccordionCardGridContentType.key).toBe('EslAccordionCardGrid');
    expect(EslAccordionCardGridContentType.displayName).toBe('ESL Accordion Card Grid');
    expect(EslAccordionCardGridContentType.baseType).toBe('_component');
    expect(EslAccordionCardGridContentType.compositionBehaviors).toContain('sectionEnabled');

    const props = EslAccordionCardGridContentType.properties;
    expect(props).toBeDefined();
    expect(props.eyebrow.type).toBe('string');
    expect(props.title.type).toBe('string');
    expect(props.description.type).toBe('richText');
    expect(props.items.type).toBe('array');
    expect(props.items.items.type).toBe('component');
  });

  it('defines EslAccordionCardItem with expected properties and richText definition', () => {
    expect(EslAccordionCardItemContentType.key).toBe('EslAccordionCardItem');
    expect(EslAccordionCardItemContentType.displayName).toBe('ESL Accordion Card Item');
    expect(EslAccordionCardItemContentType.baseType).toBe('_component');
    expect(EslAccordionCardItemContentType.compositionBehaviors).toContain('elementEnabled');

    const props = EslAccordionCardItemContentType.properties;
    expect(props).toBeDefined();
    expect(props.term.type).toBe('string');
    expect(props.definition.type).toBe('richText');
  });

  it('returns null when content is missing or items are empty (zero hardcoded fallback)', () => {
    const { container: c1 } = render(<EslAccordionCardGrid content={undefined} />);
    expect(c1.firstChild).toBeNull();

    const { container: c2 } = render(<EslAccordionCardGrid content={null} />);
    expect(c2.firstChild).toBeNull();

    const { container: c3 } = render(<EslAccordionCardGrid content={{}} />);
    expect(c3.firstChild).toBeNull();

    const { container: c4 } = render(
      <EslAccordionCardGrid
        content={{
          title: 'Glossary',
          items: [],
        }}
      />
    );
    expect(c4.firstChild).toBeNull();
  });

  it('renders section and accordion items from CMS data with rich text descriptions and definitions', () => {
    const mockContent = {
      eyebrow: 'In plain terms',
      title: 'A few words, defined.',
      description: {
        html: '<p>Banking has its own vocabulary. Here is what a few terms mean.</p>',
      },
      items: [
        {
          term: 'APY vs. APR',
          definition: {
            json: {
              text: 'APY is what your money can earn. APR is the yearly cost of borrowing.',
            },
          },
        },
        {
          term: 'Overdraft',
          definition: {
            html: '<p>When a transaction is approved even without enough funds.</p>',
          },
        },
      ],
    };

    render(<EslAccordionCardGrid content={mockContent} id="test-glossary" />);

    expect(screen.getByText('In plain terms')).toBeDefined();
    expect(screen.getByText('A few words, defined.')).toBeDefined();
    expect(
      screen.getByText('Banking has its own vocabulary. Here is what a few terms mean.')
    ).toBeDefined();
    expect(screen.getByText('APY vs. APR')).toBeDefined();
    expect(
      screen.getByText(
        'APY is what your money can earn. APR is the yearly cost of borrowing.'
      )
    ).toBeDefined();
    expect(screen.getByText('Overdraft')).toBeDefined();
    expect(
      screen.getByText('When a transaction is approved even without enough funds.')
    ).toBeDefined();
  });

  it('unwraps nested component objects correctly from Optimizely CMS payload', () => {
    const mockContent = {
      component: {
        title: 'Nested Terms',
        items: [
          {
            component: {
              term: 'Membership Share',
              definition: 'The one-time $1 deposit that makes you an owner.',
            },
          },
        ],
      },
    };

    render(<EslAccordionCardGrid content={mockContent} />);

    expect(screen.getByText('Nested Terms')).toBeDefined();
    expect(screen.getByText('Membership Share')).toBeDefined();
    expect(
      screen.getByText('The one-time $1 deposit that makes you an owner.')
    ).toBeDefined();
  });
});
