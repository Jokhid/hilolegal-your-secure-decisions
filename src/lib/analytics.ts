// Centralized event tracking. Pushes to the GTM dataLayer (for whenever
// tags get built inside the GTM-NVXKNWS2 container — hoy vacío, verificado
// el 22/09/2026: "Aún no tiene ninguna etiqueta") y, además, llama a
// gtag('event', ...) directamente, para que cada evento llegue a GA4 ya
// mismo sin depender de esa configuración pendiente. gtag solo existe tras
// aceptar cookies (ver Analytics.tsx / loadAnalyticsConsent) — sin
// consentimiento, esta función solo hace el push a dataLayer, como antes.
declare global {
  interface Window {
    dataLayer?: Record<string, unknown>[];
    gtag?: (...args: unknown[]) => void;
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
  | "tool_arras_checklist"
  | "contact_start"
  | "contact_submit"
  | "cta_contact"
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
  | "josecarlos_contact_submit"
  | "chat_open"
  | "chat_message_sent"
  | "chat_reply_received"
  | "chat_error"
  | "report_download"
  | "legal_area_view";

export function trackEvent(event: AnalyticsEvent, params: Record<string, string | number | boolean> = {}) {
  if (typeof window === "undefined") return;
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({ event, ...params });
  if (typeof window.gtag === "function") {
    window.gtag("event", event, params);
  }
}
