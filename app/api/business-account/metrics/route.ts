import { BusinessMetricsService } from "@/lib/business-account/BusinessMetricsService";
import { NextRequest, NextResponse } from "next/server";

// app/api/business-account/metrics/route.ts
export async function GET(request: NextRequest) {
    try {
        const userId = request.headers.get('userId');
        const metricsService = BusinessMetricsService.getInstance();
        const metrics = await metricsService.getMetrics(userId);

        return NextResponse.json({
            status: 'success',
            data: metrics
        });
    } catch (error) {
        return NextResponse.json({
            status: 'error',
            message: 'Failed to fetch metrics'
        }, { status: 500 });
    }
}