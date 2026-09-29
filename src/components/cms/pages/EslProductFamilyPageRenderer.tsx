import React from 'react';
import {
  OptimizelyComposition,
  getPreviewUtils,
  type ComponentContainerProps,
} from '@optimizely/cms-sdk/react/server';
import { EslProductFamilyExperienceContentType } from './EslProductFamilyPage';
import { VisualBuilderConstraintAlert } from '../shared/VisualBuilderConstraintAlert';
import { getAllowedSectionsFromContentType } from '../shared/visualBuilderConstraintUtils';

const {
  allowedKeys: ALLOWED_PRODUCT_FAMILY_TYPE_KEYS,
  allowedSections: ESL_PRODUCT_FAMILY_ALLOWED_SECTIONS,
} = getAllowedSectionsFromContentType(EslProductFamilyExperienceContentType);

export { ESL_PRODUCT_FAMILY_ALLOWED_SECTIONS };

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

  const isAllowed = ALLOWED_PRODUCT_FAMILY_TYPE_KEYS.has(componentType);

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
            pageDisplayName="ESL Product Family Experience"
            allowedTypes={ESL_PRODUCT_FAMILY_ALLOWED_SECTIONS}
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

export function ProductFamilyStaticSections(): React.ReactNode {
  return null;
}

export default function EslProductFamilyExperience({ content }: Props) {
  const nodes = content?.composition?.nodes;

  if (!nodes || nodes.length === 0) {
    return null;
  }

  return (
    <OptimizelyComposition
      nodes={nodes}
      ComponentWrapper={ExperienceComponentWrapper}
    />
  );
}

export { EslProductFamilyExperience as EslProductFamilyPage };
