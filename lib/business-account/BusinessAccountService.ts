import { BusinessProfile } from "@/types/businessTypes";
import { BusinessMetricsService } from "./BusinessMetricsService";
import { BusinessProfileService } from "./BusinessProfileService";
import { ValidationService } from "./ValidationService";

// lib/business-account/BusinessAccountService.ts
export class BusinessAccountService {
    private static instance: BusinessAccountService;
    private readonly validationService: ValidationService;
    private readonly metricsService: BusinessMetricsService;
    private readonly profileService: BusinessProfileService;

    private constructor() {
        this.validationService = ValidationService.getInstance();
        this.metricsService = BusinessMetricsService.getInstance();
        this.profileService = BusinessProfileService.getInstance();
    }

    public static getInstance(): BusinessAccountService {
        if (!BusinessAccountService.instance) {
            BusinessAccountService.instance = new BusinessAccountService();
        }
        return BusinessAccountService.instance;
    }

    public async isBusinessAccount(userId: string): Promise<boolean> {
        const profile = await this.profileService.getProfile(userId);
        return profile !== null;
    }

    public async createBusinessAccount(profile: Omit<BusinessProfile, 'createdAt' | 'updatedAt' | 'status'>): Promise<void> {
        const isValidEmail = await this.validationService.validateBusinessEmail(profile.contact.email);
        const isValidParticipant = await this.validationService.validateUserParticipation(profile.userId);

        if (!isValidEmail || !isValidParticipant) {
            throw new Error('Invalid business account request');
        }

        await this.profileService.createProfile(profile);
    }

    public async getBusinessAccount(userId: string) {
        const [profile, metrics] = await Promise.all([
            this.profileService.getProfile(userId),
            this.metricsService.getMetrics(userId)
        ]);

        return { profile, metrics };
    }

    public async updateBusinessAccount(userId: string, updates: Partial<BusinessProfile>) {
        await this.profileService.updateProfile(userId, updates);
    }

    public async deleteBusinessAccount(userId: string) {
        await this.profileService.deleteProfile(userId);
    }
}