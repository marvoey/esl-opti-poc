import { initContentTypeRegistry } from '@optimizely/cms-sdk';
import { initReactComponentRegistry } from '@optimizely/cms-sdk/react/server';
import { EslHomeExperienceContentType } from '@/components/cms/pages/EslHomePage';
import EslHomeExperience from '@/components/cms/pages/EslHomePageRenderer';
import { EslProductDetailExperienceContentType } from '@/components/cms/pages/EslProductDetailPage';
import EslProductDetailExperience from '@/components/cms/pages/EslProductDetailPageRenderer';
import { EslProductFamilyExperienceContentType } from '@/components/cms/pages/EslProductFamilyPage';
import EslProductFamilyExperience from '@/components/cms/pages/EslProductFamilyPageRenderer';
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
import { EslKeyFactsRowContentType } from '@/components/cms/components/EslKeyFactsRow';
import { EslKeyFactItemContentType } from '@/components/cms/components/EslKeyFactItem';
import EslKeyFactsRow from '@/components/cms/components/EslKeyFactsRowRenderer';
import { EslSwitchSupportContentType } from '@/components/cms/components/EslSwitchSupport';
import { EslSwitchSupportStepContentType } from '@/components/cms/components/EslSwitchSupportStep';
import EslSwitchSupport from '@/components/cms/components/EslSwitchSupportRenderer';
import { EslDisclosureContentType } from '@/components/cms/components/EslDisclosure';
import { EslDisclosureItemContentType } from '@/components/cms/components/EslDisclosureItem';
import EslDisclosure from '@/components/cms/components/EslDisclosureRenderer';
import { EslHeaderContentType } from '@/components/cms/components/EslHeader';
import { EslMegaMenuContentType } from '@/components/cms/components/EslMegaMenu';
import { EslMegaMenuColumnContentType } from '@/components/cms/components/EslMegaMenuColumn';
import { EslMegaMenuColumnItemContentType } from '@/components/cms/components/EslMegaMenuColumnItem';
import { EslMegaMenuPromoContentType } from '@/components/cms/components/EslMegaMenuPromo';
import { EslFaqStatesContentType } from '@/components/cms/components/EslFaqStates';
import EslFaqStates from '@/components/cms/components/EslFaqStatesRenderer';
import { EslProductCardsRowContentType } from '@/components/cms/components/EslProductCardsRow';
import { EslProductCardItemContentType } from '@/components/cms/components/EslProductCardItem';
import EslProductCardsRow from '@/components/cms/components/EslProductCardsRowRenderer';
import { EslProductCardsRowVariant2ContentType } from '@/components/cms/components/EslProductCardsRowVariant2';
import { EslProductCardsRowVariant2ItemContentType } from '@/components/cms/components/EslProductCardsRowVariant2Item';
import EslProductCardsRowVariant2 from '@/components/cms/components/EslProductCardsRowVariant2Renderer';
import { EslAccordionCardGridContentType } from '@/components/cms/components/EslAccordionCardGrid';
import { EslAccordionCardItemContentType } from '@/components/cms/components/EslAccordionCardItem';
import EslAccordionCardGrid from '@/components/cms/components/EslAccordionCardGridRenderer';
import { EslSplitContentCtaContentType } from '@/components/cms/components/EslSplitContentCta';
import EslSplitContentCta from '@/components/cms/components/EslSplitContentCtaRenderer';
import { EslFeatureCardRowContentType } from '@/components/cms/components/EslFeatureCardRow';
import EslFeatureCardRow from '@/components/cms/components/EslFeatureCardRowRenderer';
import { EslComparisonCardPairContentType } from '@/components/cms/components/EslComparisonCardPair';
import { EslComparisonCardItemContentType } from '@/components/cms/components/EslComparisonCardItem';
import { EslComparisonFeatureItemContentType } from '@/components/cms/components/EslComparisonFeatureItem';
import EslComparisonCardPair from '@/components/cms/components/EslComparisonCardPairRenderer';
import { EslCompareTableContentType } from '@/components/cms/components/EslCompareTable';
import EslCompareTable from '@/components/cms/components/EslCompareTableRenderer';
import { EslFinalCtaContentType } from '@/components/cms/components/EslFinalCta';
import EslFinalCta from '@/components/cms/components/EslFinalCtaRenderer';
import { EslLearningHubContentType } from '@/components/cms/components/EslLearningHub';
import EslLearningHub from '@/components/cms/components/EslLearningHubRenderer';

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
    EslHeaderContentType,
    EslMegaMenuContentType,
    EslMegaMenuColumnContentType,
    EslMegaMenuColumnItemContentType,
    EslMegaMenuPromoContentType,
    EslSiteSettingsContentType,
    EslStartPageContentType,
    EslVerticalSelectorFeatureCardContentType,
    EslCircularImageMetricRowContentType,
    EslCircularImageMetricItemContentType,
    EslSplitContentImageContentType,
    EslMediaCardGridCarouselContentType,
    EslProductDetailExperienceContentType,
    EslProductFamilyExperienceContentType,
    EslKeyFactsRowContentType,
    EslKeyFactItemContentType,
    EslSwitchSupportContentType,
    EslSwitchSupportStepContentType,
    EslDisclosureContentType,
    EslDisclosureItemContentType,
    EslFaqStatesContentType,
    EslProductCardsRowContentType,
    EslProductCardItemContentType,
    EslProductCardsRowVariant2ContentType,
    EslProductCardsRowVariant2ItemContentType,
    EslAccordionCardGridContentType,
    EslAccordionCardItemContentType,
    EslSplitContentCtaContentType,
    EslFeatureCardRowContentType,
    EslComparisonCardPairContentType,
    EslComparisonCardItemContentType,
    EslComparisonFeatureItemContentType,
    EslCompareTableContentType,
    EslFinalCtaContentType,
    EslLearningHubContentType,
  ]);

  initReactComponentRegistry({
    resolver: {
      EslHomeExperience,
      EslProductDetailExperience,
      EslProductFamilyExperience,
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
      EslKeyFactsRow,
      EslSwitchSupport,
      EslDisclosure,
      EslFaqStates,
      EslProductCardsRow,
      EslProductCardsRowVariant2,
      EslAccordionCardGrid,
      EslSplitContentCta,
      EslFeatureCardRow,
      EslComparisonCardPair,
      EslCompareTable,
      EslFinalCta,
      EslLearningHub,
      EslSiteSettings,
      EslStartPage,
    },
  });
}

// Auto-run on import
ensureOptimizelyRegistry();
