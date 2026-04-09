export type DataLayerEvent = Record<string, unknown>;

export function pushDataLayerEvent(event: DataLayerEvent) {
  if (typeof window === "undefined") {
    return;
  }
  const dataLayerWindow = window as Window & { dataLayer?: unknown[] };
  dataLayerWindow.dataLayer = dataLayerWindow.dataLayer ?? [];
  dataLayerWindow.dataLayer.push(event);
}
