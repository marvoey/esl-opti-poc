import type { TabCategory } from './TabbedIconCards';

export const defaultTabbedSolutionsData: {
  heading: string;
  tabs: TabCategory[];
} = {
  heading: 'Explore Our Solutions',
  tabs: [
    {
      id: 'personal',
      label: 'Personal',
      cards: [
        { id: 'personal-checking', title: 'Checking Accounts', href: '/personal/checking' },
        { id: 'personal-savings', title: 'Savings Accounts', href: '/personal/savings' },
        { id: 'personal-loans', title: 'Personal Loans', href: '/personal/loans' },
        { id: 'personal-cards', title: 'Credit Cards', href: '/personal/cards' },
        { id: 'personal-mortgage', title: 'Mortgages', href: '/personal/mortgage' },
        { id: 'personal-auto', title: 'Auto Loans', href: '/personal/auto-loans' },
        { id: 'personal-investing', title: 'Investments', href: '/personal/investments' },
      ],
    },
    {
      id: 'business',
      label: 'Business',
      cards: [
        { id: 'business-checking', title: 'Business Checking', href: '/business/checking' },
        { id: 'business-loans', title: 'Business Loans', href: '/business/loans' },
        { id: 'business-cards', title: 'Business Credit Cards', href: '/business/cards' },
        { id: 'business-treasury', title: 'Treasury Services', href: '/business/treasury' },
        { id: 'business-merchant', title: 'Merchant Services', href: '/business/merchant' },
        { id: 'business-payroll', title: 'Payroll Solutions', href: '/business/payroll' },
        { id: 'business-insurance', title: 'Business Insurance', href: '/business/insurance' },
      ],
    },
  ],
};
