// Below are built-in components that are available in the app, it's recommended to keep them as is
import { BYOCWrapper, NextjsContentSdkComponent, FEaaSWrapper } from '@sitecore-content-sdk/nextjs';
import { Form } from '@sitecore-content-sdk/nextjs';
// end of built-in components

// Components imported from the app itself
import * as PartialDesignDynamicPlaceholder from 'src/components/partial-design-dynamic-placeholder/PartialDesignDynamicPlaceholder';
import * as MyListUsingGraphQL from 'src/components/list-page/MyListUsingGraphQL';
import * as RichText from 'src/components/7KFArea/RichText';
import * as D7KFArea from 'src/components/7KFArea/7KFArea';

// Components must be registered within the map to match the string key with component name in Sitecore
export const componentMap = new Map<string, NextjsContentSdkComponent>([
  ['BYOCWrapper', BYOCWrapper],
  ['FEaaSWrapper', FEaaSWrapper],
  ['Form', Form],
  ['PartialDesignDynamicPlaceholder', PartialDesignDynamicPlaceholder],
  ['MyListUsingGraphQL', MyListUsingGraphQL],
  ['RichText', RichText],
  ['7KFArea', D7KFArea],
]);

export default componentMap;

