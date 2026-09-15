import { initContentTypeRegistry } from '@optimizely/cms-sdk';
import { initReactComponentRegistry } from '@optimizely/cms-sdk/react/server';
import EslHomePage, { EslHomePageContentType, LegacyEslHomePageContentType } from '@/components/cms/pages/EslHomePage';
import EslHeroSlider, { EslHeroSliderContentType } from '@/components/cms/components/EslHeroSlider';
import { EslHeroSlideContentType } from '@/components/cms/components/EslHeroSlide';
import { EslQuickLinkCardContentType } from '@/components/cms/components/EslQuickLinkCard';
import EslSnipeCta, { EslSnipeCtaContentType } from '@/components/cms/components/EslSnipeCta';
import EslTabbedSolutions, { EslTabbedSolutionsContentType } from '@/components/cms/components/EslTabbedSolutions';
import EslSideBySide, { EslSideBySideContentType } from '@/components/cms/components/EslSideBySide';
import EslMetricCardRow, { EslMetricCardRowContentType } from '@/components/cms/components/EslMetricCardRow';
import { EslRatesCardContentType } from '@/components/cms/components/EslRatesCard';
import { EslSplitContentCardsContentType } from '@/components/cms/components/EslSplitContentCards';
import EslSplitContentCards from '@/components/cms/components/EslSplitContentCardsRenderer';
import { EslStatCardContentType } from '@/components/cms/components/EslStatCard';
import { EslFooterNavColumnContentType } from '@/components/cms/components/EslFooterNavColumn';
import { EslFooterContentType } from '@/components/cms/components/EslFooter';
import EslSiteSettings, { EslSiteSettingsContentType } from '@/components/cms/pages/EslSiteSettings';
import EslStartPage, { EslStartPageContentType } from '@/components/cms/pages/EslStartPage';

export function ensureOptimizelyRegistry() {

  initContentTypeRegistry([
    EslHomePageContentType,
    LegacyEslHomePageContentType,
    EslHeroSliderContentType,
    EslHeroSlideContentType,
    EslQuickLinkCardContentType,
    EslSnipeCtaContentType,
    EslTabbedSolutionsContentType,
    EslSideBySideContentType,
    EslMetricCardRowContentType,
    EslRatesCardContentType,
    EslSplitContentCardsContentType,
    EslStatCardContentType,
    EslFooterNavColumnContentType,
    EslFooterContentType,
    EslSiteSettingsContentType,
    EslStartPageContentType,
  ]);

  initReactComponentRegistry({
    resolver: {
      EslHomePage,
      EslHomeExperience: EslHomePage,
      EslHeroSlider,
      EslSnipeCta,
      EslTabbedSolutions,
      EslSideBySide,
      EslMetricCardRow,
      EslSplitContentCards,
      EslSiteSettings,
      EslStartPage,
    },
  });
}

// Auto-run on import
ensureOptimizelyRegistry();
