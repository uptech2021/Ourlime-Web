import { ValidationService } from "@/lib/business-account/ValidationService";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
    try {
        const { email } = await request.json();
        const validationService = ValidationService.getInstance();
        const isValid = await validationService.validateBusinessEmail(email);

        return NextResponse.json({
            status: 'success',
            data: { isValid }
        });
    } catch (error) {
        return NextResponse.json({
            status: 'error',
            message: 'Validation failed'
        }, { status: 500 });
    }
}