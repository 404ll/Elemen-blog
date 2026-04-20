# 可观测与性能基线（Phase C）

## 1) 已落地能力

### A. 轻量可观测埋点

- 客户端指标采集：`components/ui/ObservabilityClient.tsx`
  - FCP（first-contentful-paint）
  - LCP（largest-contentful-paint）
  - CLS（layout-shift）
  - TTFB（navigation timing）
- 客户端错误采集：
  - `window.onerror`
  - `unhandledrejection`
- 上报方式：优先 `navigator.sendBeacon`，fallback 到 `fetch keepalive`
- 接收端：`app/api/telemetry/route.ts`
  - 当前先写入服务端日志（`console.info / console.error`）

### B. 性能预算配置

- 预算常量：`lib/performance-budget.ts`
  - LCP: 2500ms
  - FCP: 1800ms
  - CLS: 0.1
  - TTFB: 800ms
- 预算判断：`isMetricOverBudget()`

### C. 站点级基础优化

- `next.config.ts`
  - 开启图片格式：`avif/webp`
  - 关闭 `poweredByHeader`

---

## 2) 如何查看数据

当前 telemetry 已通过 `/api/telemetry` 进入服务端日志。

你可以在开发/部署环境的日志中检索：
- `[telemetry:metric]`
- `[telemetry:error]`

建议观察：
- 高频超预算页面（`overBudget: true`）
- 重复出现的错误 message + path

---

## 3) 后续可升级（按投入递增）

1. **接入真实可观测平台**（Sentry / Datadog / Grafana）
   - 把 `/api/telemetry` 日志转为结构化事件存储。
2. **按页面聚合预算报表**
   - 汇总 p75 LCP/FCP/CLS，并按路由输出周报。
3. **构建时性能守门**
   - 对关键页面引入 Lighthouse CI 阈值检查。

---

## 4) 学习重点

- Web Vitals 从“单次值”到“分位值”思维
- 客户端上报通道设计（sendBeacon vs fetch keepalive）
- 从日志到告警再到治理闭环
