import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface SiteSettings {
    socialLinks?: Array<string>;
    businessName?: string;
    addressLine?: string;
    contactEmail: string;
    contactPhone: string;
}
export type Time = bigint;
export interface Inquiry {
    id: bigint;
    service: Service;
    consent: boolean;
    fullName: string;
    email: string;
    message: string;
    timestamp: Time;
    phone?: string;
    preferredContactMethod: ContactMethod;
}
export interface UserProfile {
    name: string;
}
export enum ContactMethod {
    email = "email",
    phone = "phone"
}
export enum Service {
    coaching = "coaching",
    consulting = "consulting",
    workshops = "workshops"
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    getAllInquiries(): Promise<Array<Inquiry>>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getSiteSettings(): Promise<SiteSettings | null>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    submitInquiry(fullName: string, email: string, phone: string | null, service: Service, preferredContactMethod: ContactMethod, message: string, consent: boolean): Promise<{
        id: bigint;
        timestamp: Time;
    }>;
    updateSiteSettings(settings: SiteSettings): Promise<void>;
}
