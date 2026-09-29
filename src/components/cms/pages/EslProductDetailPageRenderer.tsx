import React from 'react';
import {
  OptimizelyComposition,
  getPreviewUtils,
  type ComponentContainerProps,
} from '@optimizely/cms-sdk/react/server';


import { EslProductDetailExperienceContentType } from './EslProductDetailPage';
import { VisualBuilderConstraintAlert } from '../shared/VisualBuilderConstraintAlert';
import { getAllowedSectionsFromContentType } from '../shared/visualBuilderConstraintUtils';

const {
  allowedKeys: ALLOWED_PRODUCT_DETAIL_TYPE_KEYS,
  allowedSections: ESL_PRODUCT_DETAIL_ALLOWED_SECTIONS,
} = getAllowedSectionsFromContentType(EslProductDetailExperienceContentType);

export { ESL_PRODUCT_DETAIL_ALLOWED_SECTIONS };

function ExperienceComponentWrapper({ children, node, displaySettings }: ComponentContainerProps) {
  const { pa } = getPreviewUtils(node);
  const componentNode = node as Record<string, unknown>;
  const componentObj = componentNode.component as Record<string, unknown> | undefined;
  const rawTypename = typeof componentObj?.__typename === 'string' ? componentObj.__typename : undefined;
  const componentType =
    (rawTypename && rawTypename !== '_Component' ? rawTypename : undefined) ||
    (typeof componentNode.type === 'string' ? componentNode.type : '') ||
    rawTypename ||
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
  return null;
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
