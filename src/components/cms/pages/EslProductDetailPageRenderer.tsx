import React from 'react';
import {
  OptimizelyComposition,
  getPreviewUtils,
  type ComponentContainerProps,
} from '@optimizely/cms-sdk/react/server';
import { FeatureCardRow } from '@/components/organisms/feature-card-row';
import { DEFAULT_FEATURE_CARD_ROW_PROPS } from '@/components/organisms/feature-card-row/featureCardRowData';
import { ProductCardsRow } from '@/components/organisms/product-cards-row';
import { DEFAULT_PRODUCT_CARDS_ROW_PROPS } from '@/components/organisms/product-cards-row/productCardsRowData';
import { ProductCardsRowVariant2 } from '@/components/organisms/product-cards-row-variant-2';
import { DEFAULT_PRODUCT_CARDS_ROW_VARIANT_2_PROPS } from '@/components/organisms/product-cards-row-variant-2/productCardsRowVariant2Data';
import { FaqStates } from '@/components/organisms/faq-states';
import { DEFAULT_FAQ_STATES_PROPS } from '@/components/organisms/faq-states/faqStatesData';
import { AccordionCardGrid } from '@/components/organisms/accordion-card-grid';
import { DEFAULT_ACCORDION_CARD_GRID_PROPS } from '@/components/organisms/accordion-card-grid/accordionCardGridData';
import { SwitchSupport } from '@/components/organisms/switch-support';
import { DEFAULT_SWITCH_SUPPORT_PROPS } from '@/components/organisms/switch-support/switchSupportData';
import { SplitContentCta } from '@/components/organisms/split-content-cta';
import { DEFAULT_SPLIT_CONTENT_CTA_PROPS } from '@/components/organisms/split-content-cta/splitContentCtaData';
import { Disclosure } from '@/components/organisms/disclosure';
import { DEFAULT_DISCLOSURE_PROPS } from '@/components/organisms/disclosure/disclosureData';

import { EslProductDetailExperienceContentType } from './EslProductDetailPage';
import {
  VisualBuilderConstraintAlert,
  getAllowedSectionsFromContentType,
} from '../shared/VisualBuilderConstraintAlert';

const {
  allowedKeys: ALLOWED_PRODUCT_DETAIL_TYPE_KEYS,
  allowedSections: ESL_PRODUCT_DETAIL_ALLOWED_SECTIONS,
} = getAllowedSectionsFromContentType(EslProductDetailExperienceContentType);

export { ESL_PRODUCT_DETAIL_ALLOWED_SECTIONS };

function ExperienceComponentWrapper({ children, node, displaySettings }: ComponentContainerProps) {
  const { pa } = getPreviewUtils(node);
  const componentNode = node as Record<string, unknown>;
  const componentObj = componentNode.component as Record<string, unknown> | undefined;
  const componentType =
    (typeof componentObj?.__typename === 'string' ? componentObj.__typename : undefined) ||
    (typeof componentNode.type === 'string' ? componentNode.type : '') ||
    '';

  const previewAttrs = pa(node) as Record<string, unknown>;
  const isEditMode = Boolean(
    (node as { __context?: { edit?: boolean } }).__context?.edit ||
      previewAttrs?.['data-epi-block-id'] ||
      previewAttrs?.['data-epi-edit']
  );

  const isAllowed = ALLOWED_PRODUCT_DETAIL_TYPE_KEYS.has(componentType);

  if (!isAllowed) {
    if (isEditMode) {
      return (
        <div
          {...pa(node)}
          data-component-type={componentType}
          style={{ width: '100%', display: 'block' }}
        >
          <VisualBuilderConstraintAlert
            componentType={componentType}
            componentDisplayName={node.displayName || undefined}
            pageDisplayName="ESL Product Detail Experience"
            allowedTypes={ESL_PRODUCT_DETAIL_ALLOWED_SECTIONS}
          />
        </div>
      );
    }
    return <></>;
  }

  const mergedSettings = {
    ...displaySettings,
    defaultVariant: 'squared',
  };

  const childrenWithProps =
    React.isValidElement<{ displaySettings?: Record<string, string | boolean>; defaultVariant?: 'circled' | 'squared' }>(children)
      ? React.cloneElement(children, {
          displaySettings: mergedSettings,
          defaultVariant: 'squared',
        })
      : children;

  return (
    <div
      {...pa(node)}
      data-component-type={componentType}
      style={{ width: '100%', display: 'block' }}
    >
      {childrenWithProps}
    </div>
  );
}

export function ProductDetailStaticSections() {
  return (
    <>
      <FeatureCardRow {...DEFAULT_FEATURE_CARD_ROW_PROPS} />
      <ProductCardsRow id="product-fit" {...DEFAULT_PRODUCT_CARDS_ROW_PROPS} />
      <ProductCardsRowVariant2
        id="account-tools"
        {...DEFAULT_PRODUCT_CARDS_ROW_VARIANT_2_PROPS}
      />
      <FaqStates id="faq" {...DEFAULT_FAQ_STATES_PROPS} />
      <AccordionCardGrid id="glossary" {...DEFAULT_ACCORDION_CARD_GRID_PROPS} />
      <SwitchSupport id="switch-support" {...DEFAULT_SWITCH_SUPPORT_PROPS} />
      <SplitContentCta id="split-content-cta" {...DEFAULT_SPLIT_CONTENT_CTA_PROPS} />
      <Disclosure id="disclosure" {...DEFAULT_DISCLOSURE_PROPS} />
    </>
  );
}

type ExperienceCompositionData = {
  nodes?: Parameters<typeof OptimizelyComposition>[0]['nodes'] | null;
  [key: string]: unknown;
};

type Props = {
  content?: {
    composition?: ExperienceCompositionData | null;
    [key: string]: unknown;
  } | null;
};

export default function EslProductDetailExperience({ content }: Props) {
  const nodes = content?.composition?.nodes;

  return (
    <>
      {nodes && nodes.length > 0 && (
        <OptimizelyComposition nodes={nodes} ComponentWrapper={ExperienceComponentWrapper} />
      )}
      <ProductDetailStaticSections />
    </>
  );
}

export { EslProductDetailExperience as EslProductDetailPage };
