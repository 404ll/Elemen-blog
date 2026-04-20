import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const payload = await request.json();

    if (payload?.type === "metric") {
      console.info("[telemetry:metric]", {
        name: payload.name,
        value: payload.value,
        overBudget: payload.overBudget,
        path: payload.path,
        timestamp: payload.timestamp,
      });
    } else if (payload?.type === "error") {
      console.error("[telemetry:error]", {
        message: payload.message,
        path: payload.path,
        stack: payload.stack,
        timestamp: payload.timestamp,
      });
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("[telemetry:parse-error]", error);
    return NextResponse.json({ ok: false }, { status: 400 });
  }
}
