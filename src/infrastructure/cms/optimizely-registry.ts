import { initContentTypeRegistry } from '@optimizely/cms-sdk';
import { initReactComponentRegistry } from '@optimizely/cms-sdk/react/server';
import { EslHomeExperienceContentType } from '@/components/cms/pages/EslHomePage';
import EslHomeExperience from '@/components/cms/pages/EslHomePageRenderer';
import { EslProductDetailExperienceContentType } from '@/components/cms/pages/EslProductDetailPage';
import EslProductDetailExperience from '@/components/cms/pages/EslProductDetailPageRenderer';
import { EslHeroSliderContentType } from '@/components/cms/components/EslHeroSlider';
import EslHeroSlider from '@/components/cms/components/EslHeroSliderRenderer';
import { EslHeroSlideContentType } from '@/components/cms/components/EslHeroSlide';
import { EslQuickLinkCardContentType } from '@/components/cms/components/EslQuickLinkCard';
import { EslSnipeCtaContentType } from '@/components/cms/components/EslSnipeCta';
import EslSnipeCta from '@/components/cms/components/EslSnipeCtaRenderer';
import { EslTabbedSolutionsContentType } from '@/components/cms/components/EslTabbedSolutions';
import EslTabbedSolutions from '@/components/cms/components/EslTabbedSolutionsRenderer';
import { EslSideBySideContentType } from '@/components/cms/components/EslSideBySide';
import EslSideBySide from '@/components/cms/components/EslSideBySideRenderer';
import { EslMetricCardRowContentType } from '@/components/cms/components/EslMetricCardRow';
import EslMetricCardRow from '@/components/cms/components/EslMetricCardRowRenderer';
import { EslRatesCardContentType } from '@/components/cms/components/EslRatesCard';
import { EslSplitContentCardsContentType } from '@/components/cms/components/EslSplitContentCards';
import EslSplitContentCards from '@/components/cms/components/EslSplitContentCardsRenderer';
import { EslStatCardContentType } from '@/components/cms/components/EslStatCard';
import { EslMediaCardGridContentType } from '@/components/cms/components/EslMediaCardGrid';
import { EslMediaCardContentType } from '@/components/cms/components/EslMediaCard';
import EslMediaCardGrid from '@/components/cms/components/EslMediaCardGridRenderer';
import { EslVideoStoryCardRowContentType } from '@/components/cms/components/EslVideoStoryCardRow';
import { EslVideoStoryCardContentType } from '@/components/cms/components/EslVideoStoryCard';
import EslVideoStoryCardRow from '@/components/cms/components/EslVideoStoryCardRowRenderer';
import { EslFooterNavColumnContentType } from '@/components/cms/components/EslFooterNavColumn';
import { EslFooterContentType } from '@/components/cms/components/EslFooter';
import { EslSiteSettingsContentType } from '@/components/cms/pages/EslSiteSettings';
import EslSiteSettings from '@/components/cms/pages/EslSiteSettingsRenderer';
import { EslStartPageContentType } from '@/components/cms/pages/EslStartPage';
import EslStartPage from '@/components/cms/pages/EslStartPageRenderer';
import {
  EslVerticalSelectorFeatureCardContentType,
} from '@/components/cms/components/EslVerticalSelectorFeatureCard';
import EslVerticalSelectorFeatureCard from '@/components/cms/components/EslVerticalSelectorFeatureCardRenderer';
import EslCircularImageMetricRow from '@/components/cms/components/EslCircularImageMetricRowRenderer';
import { EslCircularImageMetricRowContentType } from '@/components/cms/components/EslCircularImageMetricRow';
import { EslCircularImageMetricItemContentType } from '@/components/cms/components/EslCircularImageMetricItem';
import EslSplitContentImage from '@/components/cms/components/EslSplitContentImageRenderer';
import { EslSplitContentImageContentType } from '@/components/cms/components/EslSplitContentImage';
import EslMediaCardGridCarousel from '@/components/cms/components/EslMediaCardGridCarouselRenderer';
import { EslMediaCardGridCarouselContentType } from '@/components/cms/components/EslMediaCardGridCarousel';

export function ensureOptimizelyRegistry() {

  initContentTypeRegistry([
    EslHomeExperienceContentType,
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
    EslMediaCardGridContentType,
    EslMediaCardContentType,
    EslVideoStoryCardRowContentType,
    EslVideoStoryCardContentType,
    EslFooterNavColumnContentType,
    EslFooterContentType,
    EslSiteSettingsContentType,
    EslStartPageContentType,
    EslVerticalSelectorFeatureCardContentType,
    EslCircularImageMetricRowContentType,
    EslCircularImageMetricItemContentType,
    EslSplitContentImageContentType,
    EslMediaCardGridCarouselContentType,
    EslProductDetailExperienceContentType,
  ]);

  initReactComponentRegistry({
    resolver: {
      EslHomeExperience,
      EslProductDetailExperience,
      EslHeroSlider,
      EslSnipeCta,
      EslTabbedSolutions,
      EslSideBySide,
      EslMetricCardRow,
      EslSplitContentCards,
      EslMediaCardGrid,
      EslVideoStoryCardRow,
      EslVerticalSelectorFeatureCard,
      EslCircularImageMetricRow,
      EslSplitContentImage,
      EslMediaCardGridCarousel,
      EslSiteSettings,
      EslStartPage,
    },
  });
}

// Auto-run on import
ensureOptimizelyRegistry();
