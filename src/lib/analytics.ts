// Centralized event tracking. Pushes to the GTM dataLayer that's already
// initialized in __root.tsx — GTM's own tag config decides what (if
// anything) forwards each event to GA4 or elsewhere, this file just makes
// sure every push uses one of a known, agreed set of event names instead
// of ad-hoc strings scattered across components.

declare global {
  interface Window {
    dataLayer?: Record<string, unknown>[];
  }
}

export type AnalyticsEvent =
  | "nav_service_legal"
  | "nav_service_mortgage"
  | "nav_service_wealth"
  | "nav_service_property"
  | "cta_legal"
  | "cta_mortgage"
  | "cta_wealth"
  | "cta_property"
  | "tool_mortgage"
  | "tool_financial_health"
  | "tool_wealth_audit"
  | "contact_start"
  | "contact_submit"
  | "blog_article_click"
  | "property_management_view"
  | "property_management_proposal_start"
  | "property_management_proposal_submit"
  | "property_change_admin_click"
  | "property_president_click"
  | "property_new_community_click"
  | "property_financial_management_click"
  | "property_form_submit"
  | "josecarlos_finance_click"
  | "josecarlos_protection_click"
  | "josecarlos_planning_click"
  | "josecarlos_mortgage_start"
  | "josecarlos_wealth_start"
  | "josecarlos_retirement_click"
  | "josecarlos_autonomos_click"
  | "josecarlos_property_management_click"
  | "josecarlos_contact_submit";

export function trackEvent(event: AnalyticsEvent, params: Record<string, string | number | boolean> = {}) {
  if (typeof window === "undefined") return;
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({ event, ...params });
}
