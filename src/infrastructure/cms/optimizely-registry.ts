import { initContentTypeRegistry } from '@optimizely/cms-sdk';
import { initReactComponentRegistry } from '@optimizely/cms-sdk/react/server';
import EslHomePage, { EslHomePageContentType } from '@/components/cms/pages/EslHomePage';
import { EslHeroSliderContentType } from '@/components/cms/components/EslHeroSlider';
import { EslHeroSlideContentType } from '@/components/cms/components/EslHeroSlide';
import { EslQuickLinkCardContentType } from '@/components/cms/components/EslQuickLinkCard';
import { EslSnipeCtaContentType } from '@/components/cms/components/EslSnipeCta';
import { EslFooterNavColumnContentType } from '@/components/cms/components/EslFooterNavColumn';
import { EslFooterContentType } from '@/components/cms/components/EslFooter';
import EslSiteSettings, { EslSiteSettingsContentType } from '@/components/cms/pages/EslSiteSettings';
import EslStartPage, { EslStartPageContentType } from '@/components/cms/pages/EslStartPage';

let isRegistered = false;

export function ensureOptimizelyRegistry() {
  if (isRegistered) return;

  initContentTypeRegistry([
    EslHomePageContentType,
    EslHeroSliderContentType,
    EslHeroSlideContentType,
    EslQuickLinkCardContentType,
    EslSnipeCtaContentType,
    EslFooterNavColumnContentType,
    EslFooterContentType,
    EslSiteSettingsContentType,
    EslStartPageContentType,
  ]);

  initReactComponentRegistry({
    resolver: {
      EslHomePage,
      EslSiteSettings,
      EslStartPage,
    },
  });

  isRegistered = true;
}

// Auto-run on import
ensureOptimizelyRegistry();
