import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export class ExternalBlob {
    getBytes(): Promise<Uint8Array<ArrayBuffer>>;
    getDirectURL(): string;
    static fromURL(url: string): ExternalBlob;
    static fromBytes(blob: Uint8Array<ArrayBuffer>): ExternalBlob;
    withUploadProgress(onProgress: (percentage: number) => void): ExternalBlob;
}
export interface ContactInfo {
    tel: string;
    email: string;
    socialMedia: Array<SocialMediaLink>;
}
export interface Stats {
    videoViews: Array<[string, bigint]>;
    totalVisits: bigint;
}
export interface SocialMediaLink {
    url: string;
    platform: string;
}
export interface AboutPageContent {
    title: string;
    content: string;
    placeholder: boolean;
}
export interface VideoProject {
    id: string;
    title: string;
    thumbnail?: ExternalBlob;
    video?: ExternalBlob;
    description: string;
    visible: boolean;
    youtubeUrl?: string;
}
export interface UserProfile {
    name: string;
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    addVideoProject(id: string, title: string, description: string, video: ExternalBlob | null, thumbnail: ExternalBlob | null, youtubeUrl: string | null): Promise<void>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    deleteVideoProject(id: string): Promise<void>;
    getAboutPageContent(): Promise<AboutPageContent | null>;
    getAllVideoProjects(): Promise<Array<VideoProject>>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getContactInfo(): Promise<ContactInfo | null>;
    getStats(): Promise<Stats>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    getVideoOrder(): Promise<Array<string>>;
    getVideoProject(id: string): Promise<VideoProject | null>;
    getVideoProjects(): Promise<Array<VideoProject>>;
    incrementTotalVisits(): Promise<void>;
    incrementVideoView(videoId: string): Promise<void>;
    initializeAccessControl(): Promise<void>;
    isCallerAdmin(): Promise<boolean>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    setAboutPageContent(title: string, content: string, placeholder: boolean): Promise<void>;
    setContactInfo(email: string, tel: string, socialMedia: Array<SocialMediaLink>): Promise<void>;
    toggleVideoVisibility(id: string, visible: boolean): Promise<void>;
    updateThumbnail(id: string, thumbnail: ExternalBlob): Promise<void>;
    updateVideoOrder(newOrder: Array<string>): Promise<void>;
    updateVideoProject(id: string, title: string, description: string, video: ExternalBlob | null, thumbnail: ExternalBlob | null, youtubeUrl: string | null): Promise<void>;
}
