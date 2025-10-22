import type { ScriptProps } from "next/script";

type ScriptStrategy = NonNullable<ScriptProps["strategy"]>;

type DataAttributeKey = `data-${string}`;

type BaseMarketingScript = {
  /** Unique identifier used as Script.id */
  id: string;
  /** Loading strategy used by next/script */
  strategy: ScriptStrategy;
  /** Additional attributes added to the script tag */
  attributes?: Record<DataAttributeKey, string>;
  /** Optional HTML for a <noscript> fallback */
  noScriptFallback?: string;
};

type ExternalMarketingScript = BaseMarketingScript & {
  type: "external";
  src: string;
};

type InlineMarketingScript = BaseMarketingScript & {
  type: "inline";
  content: string;
};

export type MarketingScript = ExternalMarketingScript | InlineMarketingScript;

type MarketingScriptFactory = () => MarketingScript[];

type MarketingScriptRegistry = Record<string, MarketingScriptFactory>;

const marketingScriptRegistry: MarketingScriptRegistry = {
  "google-tag-manager": createGoogleTagManagerScripts,
  "meta-pixel": createMetaPixelScripts,
  "linkedin-insight-tag": createLinkedInScripts
};

function createGoogleTagManagerScripts(): MarketingScript[] {
  const containerId = process.env.NEXT_PUBLIC_GTM_ID;

  if (!containerId) {
    return [];
  }

  return [
    {
      id: "gtm-inline",
      type: "inline",
      strategy: "beforeInteractive",
      content: `((w,d,s,l,i)=>{w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});const f=d.getElementsByTagName(s)[0];const j=d.createElement(s);const dl=l!=='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode?.insertBefore(j,f);})(window,document,'script','dataLayer','${containerId}');`,
      noScriptFallback:
        `<iframe src="https://www.googletagmanager.com/ns.html?id=${containerId}" height="0" width="0" style="display:none;visibility:hidden"></iframe>`,
      attributes: {
        "data-privacy-policy-url": "/privacy-policy",
        "data-gtm-id": containerId
      }
    }
  ];
}

function createMetaPixelScripts(): MarketingScript[] {
  const pixelId = process.env.NEXT_PUBLIC_META_PIXEL_ID;

  if (!pixelId) {
    return [];
  }

  return [
    {
      id: "fb-pixel",
      type: "inline",
      strategy: "afterInteractive",
      content: `!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode?.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');fbq('init','${pixelId}');fbq('track','PageView');`,
      noScriptFallback:
        `<img height="1" width="1" style="display:none" src="https://www.facebook.com/tr?id=${pixelId}&ev=PageView&noscript=1" alt="" />`,
      attributes: {
        "data-privacy-policy-url": "/privacy-policy",
        "data-meta-pixel-id": pixelId
      }
    }
  ];
}

function createLinkedInScripts(): MarketingScript[] {
  const partnerId = process.env.NEXT_PUBLIC_LINKEDIN_PARTNER_ID;

  if (!partnerId) {
    return [];
  }

  return [
    {
      id: "linkedin-insight",
      type: "inline",
      strategy: "afterInteractive",
      content: `!function(l){if(!l){window.lintrk=function(a,b){window.lintrk.q.push([a,b])};window.lintrk.q=[]}const s=document.createElement('script');s.async=true;s.src='https://snap.licdn.com/li.lms-analytics/insight.min.js';document.head.appendChild(s)}(window.lintrk);window._linkedin_data_partner_ids=window._linkedin_data_partner_ids||[];window._linkedin_data_partner_ids.push('${partnerId}');`,
      attributes: {
        "data-privacy-policy-url": "/privacy-policy",
        "data-linkedin-partner-id": partnerId
      }
    }
  ];
}

export function getMarketingScripts(): MarketingScript[] {
  return Object.values(marketingScriptRegistry).flatMap((factory) => factory());
}
