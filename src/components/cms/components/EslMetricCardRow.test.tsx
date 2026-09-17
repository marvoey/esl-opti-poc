import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import EslMetricCardRow from './EslMetricCardRowRenderer';
import {
  EslMetricCardRowContentType,
  resolveCategoryIcon,
} from './EslMetricCardRow';
import { EslRatesCardContentType } from './EslRatesCard';

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

describe('EslMetricCardRow CMS Component', () => {
  it('exposes correct Optimizely Content Type definitions', () => {
    expect(EslMetricCardRowContentType.key).toBe('EslMetricCardRow');
    expect(EslMetricCardRowContentType.displayName).toBe('ESL Metric Card Row');
    expect(EslMetricCardRowContentType.baseType).toBe('_component');
    expect(EslMetricCardRowContentType.properties).toHaveProperty('eyebrow');
    expect(EslMetricCardRowContentType.properties).toHaveProperty('title');
    expect(EslMetricCardRowContentType.properties).toHaveProperty('description');
    expect(EslMetricCardRowContentType.properties).toHaveProperty('cta');
    expect(EslMetricCardRowContentType.properties).toHaveProperty('cards');

    expect(EslRatesCardContentType.key).toBe('EslRatesCard');
    expect(EslRatesCardContentType.displayName).toBe('ESL Rates Card');
    expect(EslRatesCardContentType.baseType).toBe('_component');
    expect(EslRatesCardContentType.properties).toHaveProperty('category');
    expect(EslRatesCardContentType.properties).toHaveProperty('categoryIcon');
    expect(EslRatesCardContentType.properties).toHaveProperty('rate');
    expect(EslRatesCardContentType.properties).toHaveProperty('rateUnit');
    expect(EslRatesCardContentType.properties).toHaveProperty('rateLabel');
    expect(EslRatesCardContentType.properties).toHaveProperty('title');
    expect(EslRatesCardContentType.properties).toHaveProperty('description');
    expect(EslRatesCardContentType.properties).toHaveProperty('cta');
    expect(EslRatesCardContentType.properties).toHaveProperty('variant');
  });

  it('renders full row with header elements, row CTA, and rates cards', () => {
    const mockData = {
      eyebrow: 'Competitive Rates',
      title: 'Rates that work for your goals.',
      description: 'Explore high-yield savings, auto loans, and mortgages.',
      cta: mockLink('View all rates', '/rates'),
      cards: [
        {
          category: 'Getting on the road',
          categoryIcon: 'car',
          rate: '1.99',
          rateUnit: '%',
          rateLabel: 'APR',
          title: 'Auto loans',
          description: 'A loan that fits your life.',
          cta: mockLink('Explore auto loans', '/auto-loans'),
          variant: 'default',
        },
        {
          category: 'Home financing',
          categoryIcon: 'home',
          rate: '5.49',
          rateUnit: '%',
          rateLabel: 'APR',
          title: 'Mortgages',
          description: 'Competitive fixed rates.',
          cta: mockLink('Explore mortgages', '/mortgages'),
          variant: 'default',
        },
        {
          category: 'Growing your savings',
          categoryIcon: 'piggy-bank',
          rate: '4.25',
          rateUnit: '%',
          rateLabel: 'APY',
          title: 'High-Yield Savings',
          description: 'Watch your money grow.',
          cta: mockLink('Explore savings', '/savings', '_blank'),
          variant: 'active',
        },
      ],
    };

    render(<EslMetricCardRow content={mockData} />);

    expect(screen.getByText('Competitive Rates')).toBeDefined();
    expect(screen.getByRole('heading', { level: 2, name: 'Rates that work for your goals.' })).toBeDefined();
    expect(screen.getByText('Explore high-yield savings, auto loans, and mortgages.')).toBeDefined();

    const rowCta = screen.getByRole('link', { name: /view all rates/i });
    expect(rowCta.getAttribute('href')).toBe('/rates');

    expect(screen.getByText('1.99')).toBeDefined();
    expect(screen.getByText('Auto loans')).toBeDefined();
    expect(screen.getByRole('link', { name: /explore auto loans/i })).toBeDefined();

    expect(screen.getByText('5.49')).toBeDefined();
    expect(screen.getByText('Mortgages')).toBeDefined();

    expect(screen.getByText('4.25')).toBeDefined();
    expect(screen.getByText('High-Yield Savings')).toBeDefined();
    expect(screen.getByText('APY')).toBeDefined();
    expect(screen.getByText('High-Yield Savings').closest('article')?.className).toContain('active');
  });

  it('unwraps component property when nested inside composition node', () => {
    const mockNested = {
      component: {
        eyebrow: 'Member Advantage',
        title: 'Personalized Rates',
        description: 'Great rates every day.',
        cta: mockLink('Compare Rates', '/compare'),
        cards: [
          {
            category: 'Auto Loans',
            rate: '2.49',
            rateUnit: '%',
            rateLabel: 'APR',
            title: 'New Vehicle Loan',
            description: 'Low rates on new cars.',
            cta: mockLink('Apply Now', '/apply/auto'),
            variant: 'default',
          },
        ],
      },
    };

    render(<EslMetricCardRow content={mockNested} />);

    expect(screen.getByText('Member Advantage')).toBeDefined();
    expect(screen.getByRole('heading', { level: 2, name: 'Personalized Rates' })).toBeDefined();
    expect(screen.getByText('2.49')).toBeDefined();
    expect(screen.getByText('New Vehicle Loan')).toBeDefined();
  });

  it('resolves category icons with explicit key, category inference, and fallback', () => {
    const carIcon = resolveCategoryIcon('car', 'anything');
    expect(React.isValidElement(carIcon)).toBe(true);

    const homeIcon = resolveCategoryIcon('home', 'anything');
    expect(React.isValidElement(homeIcon)).toBe(true);

    const piggyIcon = resolveCategoryIcon('piggy-bank', 'anything');
    expect(React.isValidElement(piggyIcon)).toBe(true);

    const coinsIcon = resolveCategoryIcon('coins', 'anything');
    expect(React.isValidElement(coinsIcon)).toBe(true);

    const creditIcon = resolveCategoryIcon('credit-card', 'anything');
    expect(React.isValidElement(creditIcon)).toBe(true);

    // Inferred icons
    const inferredCar = resolveCategoryIcon(null, 'Getting on the road');
    expect(React.isValidElement(inferredCar)).toBe(true);

    const inferredHome = resolveCategoryIcon(null, 'Home financing');
    expect(React.isValidElement(inferredHome)).toBe(true);

    const inferredSavings = resolveCategoryIcon(null, 'Growing your savings');
    expect(React.isValidElement(inferredSavings)).toBe(true);

    // Fallback
    const fallback = resolveCategoryIcon(null, 'Unmatched category');
    expect(React.isValidElement(fallback)).toBe(true);
  });

  it('returns null cleanly when content is null or completely empty', () => {
    const { container: container1 } = render(<EslMetricCardRow content={null} />);
    expect(container1.firstChild).toBeNull();

    const { container: container2 } = render(<EslMetricCardRow content={{}} />);
    expect(container2.firstChild).toBeNull();
  });

  it('renders section with title and CTA but 0 cards when cards array is empty without defaulting to hardcoded cards', () => {
    const mockNoCards = {
      eyebrow: 'Competitive Rates',
      title: 'Rates that work for your goals.',
      description: 'Explore high-yield savings.',
      cta: mockLink('View all rates', '/rates'),
      cards: [],
    };

    const { container } = render(<EslMetricCardRow content={mockNoCards} />);

    expect(screen.getByText('Competitive Rates')).toBeDefined();
    expect(screen.getByRole('heading', { level: 2, name: 'Rates that work for your goals.' })).toBeDefined();
    expect(screen.getByText('View all rates')).toBeDefined();

    // Verify no rates cards are rendered and no default hardcoded cards are displayed
    expect(container.querySelectorAll('article')).toHaveLength(0);
    expect(screen.queryByText('1.99')).toBeNull();
    expect(screen.queryByText('Auto loans')).toBeNull();
  });
});
