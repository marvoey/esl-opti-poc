import { initContentTypeRegistry } from '@optimizely/cms-sdk';
import { initReactComponentRegistry } from '@optimizely/cms-sdk/react/server';
import EslHomePage, { EslHomePageContentType } from '@/components/cms/pages/EslHomePage';
import { EslHeroSliderContentType } from '@/components/cms/components/EslHeroSlider';
import { EslHeroSlideContentType } from '@/components/cms/components/EslHeroSlide';
import { EslQuickLinkCardContentType } from '@/components/cms/components/EslQuickLinkCard';
import { EslSnipeCtaContentType } from '@/components/cms/components/EslSnipeCta';

let isRegistered = false;

export function ensureOptimizelyRegistry() {
  if (isRegistered) return;

  initContentTypeRegistry([
    EslHomePageContentType,
    EslHeroSliderContentType,
    EslHeroSlideContentType,
    EslQuickLinkCardContentType,
    EslSnipeCtaContentType,
  ]);

  initReactComponentRegistry({
    resolver: {
      EslHomePage,
    },
  });

  isRegistered = true;
}

// Auto-run on import
ensureOptimizelyRegistry();
