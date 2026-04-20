"use client";

import { useEffect } from "react";
import { isMetricOverBudget } from "@/lib/performance-budget";

type MetricPayload = {
  type: "metric";
  name: "lcp" | "fcp" | "cls" | "ttfb";
  value: number;
  overBudget: boolean;
  path: string;
};

type ErrorPayload = {
  type: "error";
  message: string;
  stack?: string;
  path: string;
};

function sendTelemetry(payload: MetricPayload | ErrorPayload) {
  const body = JSON.stringify({
    ...payload,
    timestamp: new Date().toISOString(),
    userAgent: navigator.userAgent,
  });

  const endpoint = "/api/telemetry";
  if (navigator.sendBeacon) {
    const blob = new Blob([body], { type: "application/json" });
    navigator.sendBeacon(endpoint, blob);
    return;
  }

  void fetch(endpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body,
    keepalive: true,
  });
}

export default function ObservabilityClient() {
  useEffect(() => {
    const path = window.location.pathname;
    let clsValue = 0;

    const sendMetric = (name: MetricPayload["name"], value: number) => {
      if (!Number.isFinite(value)) return;
      sendTelemetry({
        type: "metric",
        name,
        value,
        overBudget: isMetricOverBudget(name, value),
        path,
      });
    };

    const onLoad = () => {
      const navigation = performance.getEntriesByType("navigation")[0] as PerformanceNavigationTiming | undefined;
      if (navigation) {
        sendMetric("ttfb", navigation.responseStart);
      }
    };

    window.addEventListener("load", onLoad, { once: true });

    const paintObserver = new PerformanceObserver((list) => {
      list.getEntries().forEach((entry) => {
        if (entry.name === "first-contentful-paint") {
          sendMetric("fcp", entry.startTime);
        }
      });
    });

    const lcpObserver = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      const lastEntry = entries[entries.length - 1];
      if (lastEntry) {
        sendMetric("lcp", lastEntry.startTime);
      }
    });

    const clsObserver = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        const layoutShift = entry as PerformanceEntry & {
          hadRecentInput?: boolean;
          value?: number;
        };

        if (!layoutShift.hadRecentInput && typeof layoutShift.value === "number") {
          clsValue += layoutShift.value;
        }
      }
      sendMetric("cls", Number(clsValue.toFixed(4)));
    });

    try {
      paintObserver.observe({ type: "paint", buffered: true });
      lcpObserver.observe({ type: "largest-contentful-paint", buffered: true });
      clsObserver.observe({ type: "layout-shift", buffered: true });
    } catch {
      // 浏览器不支持 PerformanceObserver 对应条目时，直接跳过
    }

    const onError = (event: ErrorEvent) => {
      sendTelemetry({
        type: "error",
        message: event.message,
        stack: event.error?.stack,
        path,
      });
    };

    const onUnhandledRejection = (event: PromiseRejectionEvent) => {
      const reason = event.reason;
      sendTelemetry({
        type: "error",
        message: typeof reason === "string" ? reason : reason?.message || "Unhandled rejection",
        stack: reason?.stack,
        path,
      });
    };

    window.addEventListener("error", onError);
    window.addEventListener("unhandledrejection", onUnhandledRejection);

    return () => {
      paintObserver.disconnect();
      lcpObserver.disconnect();
      clsObserver.disconnect();
      window.removeEventListener("load", onLoad);
      window.removeEventListener("error", onError);
      window.removeEventListener("unhandledrejection", onUnhandledRejection);
    };
  }, []);

  return null;
}
