// Below are built-in components that are available in the app, it's recommended to keep them as is
import { NextjsContentSdkComponent } from '@sitecore-content-sdk/nextjs';


import { BYOCWrapper, FEaaSWrapper } from '@sitecore-content-sdk/nextjs';
import { Form } from '@sitecore-content-sdk/nextjs';

// end of built-in import section
import * as Title from 'src/components/title/Title';
import * as Zipdownload from 'src/components/test-component/Zipdownload';
import * as TestComponent from 'src/components/test-component/TestComponent';
import * as DetailsHtmlTest from 'src/components/test-component/DetailsHtmlTest';
import * as BlogBanner from 'src/components/test-component/BlogBanner';
import * as Banner from 'src/components/test-component/Banner';
import * as RowSplitter from 'src/components/row-splitter/RowSplitter';
import * as Sitecoreaiplainhtml from 'src/components/rich-text/Sitecoreaiplainhtml';
import * as RichText from 'src/components/rich-text/RichText';
import * as Promo from 'src/components/promo/Promo';
import * as PartialDesignDynamicPlaceholder from 'src/components/partial-design-dynamic-placeholder/PartialDesignDynamicPlaceholder';
import * as PageContent from 'src/components/page-content/PageContent';
import * as Navigation from 'src/components/navigation/Navigation';
import * as LinkList from 'src/components/link-list/LinkList';
import * as LayoutColumn from 'src/components/layout-column/LayoutColumn';
import * as LayoutBackgroundColor from 'src/components/layout-column/LayoutBackgroundColor';
import * as Image from 'src/components/image/Image';
import * as MyUseEffectListGetDataPassword from 'src/components/graphql-components/MyUseEffectListGetDataPassword';
import * as MyUseEffectListGetData from 'src/components/graphql-components/MyUseEffectListGetData';
import * as MyUseEffectList from 'src/components/graphql-components/MyUseEffectList';
import * as MyGraphQlTest from 'src/components/graphql-components/MyGraphQlTest';
import * as ContentBlock from 'src/components/content-block/ContentBlock';
import * as Container from 'src/components/container/Container';
import * as ColumnSplitter from 'src/components/column-splitter/ColumnSplitter';

export const componentMap = new Map<string, NextjsContentSdkComponent>([
  ['BYOCWrapper', BYOCWrapper],
  ['FEaaSWrapper', FEaaSWrapper],
  ['Form', Form],
  ['Title', { ...Title }],
  ['Zipdownload', { ...Zipdownload }],
  ['TestComponent', { ...TestComponent }],
  ['DetailsHtmlTest', { ...DetailsHtmlTest }],
  ['BlogBanner', { ...BlogBanner }],
  ['Banner', { ...Banner }],
  ['RowSplitter', { ...RowSplitter }],
  ['Sitecoreaiplainhtml', { ...Sitecoreaiplainhtml }],
  ['RichText', { ...RichText }],
  ['Promo', { ...Promo }],
  ['PartialDesignDynamicPlaceholder', { ...PartialDesignDynamicPlaceholder }],
  ['PageContent', { ...PageContent }],
  ['Navigation', { ...Navigation }],
  ['LinkList', { ...LinkList }],
  ['LayoutColumn', { ...LayoutColumn }],
  ['LayoutBackgroundColor', { ...LayoutBackgroundColor }],
  ['Image', { ...Image }],
  ['MyUseEffectListGetDataPassword', { ...MyUseEffectListGetDataPassword }],
  ['MyUseEffectListGetData', { ...MyUseEffectListGetData }],
  ['MyUseEffectList', { ...MyUseEffectList }],
  ['MyGraphQlTest', { ...MyGraphQlTest }],
  ['ContentBlock', { ...ContentBlock }],
  ['Container', { ...Container }],
  ['ColumnSplitter', { ...ColumnSplitter }],
]);

export default componentMap;
