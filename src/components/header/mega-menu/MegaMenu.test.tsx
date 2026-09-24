import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { MegaMenu } from './MegaMenu';
import { PERSONAL_MEGA_MENU } from '../megaMenuData';

describe('MegaMenu Component', () => {
  it('renders columns and promo when promo is defined', () => {
    const { container } = render(<MegaMenu id="test-menu" data={PERSONAL_MEGA_MENU} />);
    expect(screen.getByText('View All Personal Banking')).toBeDefined();
    expect(screen.getByText('Checking Accounts')).toBeDefined();
    expect(screen.getByText('Not sure where to start?')).toBeDefined();
    expect(screen.getByText('Get guidance')).toBeDefined();
    expect(container.querySelector('[class*="promo"]')).not.toBeNull();
  });

  it('omits promo container entirely when promo is undefined or empty', () => {
    const dataWithoutPromo = {
      viewAllLabel: 'View All Business',
      viewAllHref: '/business',
      columns: [
        {
          heading: 'COMMERCIAL',
          items: [{ icon: 'store' as const, label: 'Business Loans', href: '/loans' }],
        },
      ],
      promo: undefined,
    };

    const { container } = render(<MegaMenu id="biz-menu" data={dataWithoutPromo} />);
    expect(screen.getByText('View All Business')).toBeDefined();
    expect(screen.getByText('Business Loans')).toBeDefined();
    // Promo container must not be rendered at all
    expect(container.querySelector('[class*="promo"]')).toBeNull();
    expect(screen.queryByText(/get guidance/i)).toBeNull();
  });
});
