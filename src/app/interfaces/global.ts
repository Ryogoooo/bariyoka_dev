export interface User {
    id: string; // UUID
    googleId: string; // Google のユーザー ID
    email: string;
    name?: string;
    iconUrl?: string;
    createdAt: string; // ISO 8601 形式の日時文字列
    updatedAt: string; // ISO 8601 形式の日時文字列
}

export interface Project {
    id: string; // UUID
    userId: string; // ユーザー ID（外部キー）
    name?: string;
    description?: string;
    createdAt: string; // ISO 8601 形式の日時文字列
    updatedAt: string; // ISO 8601 形式の日時文字列
}

export interface Image {
    id: string; // UUID
    projectId: string; // プロジェクト ID（外部キー）
    imageUrl: string;
    version: number; // バージョン番号（int2）
    createdAt: string; // ISO 8601 形式の日時文字列
    updatedAt: string; // ISO 8601 形式の日時文字列
}
export interface ProcessedImage {
    id: string; // UUID
    imageId: string; // 画像 ID（外部キー）
    processedImageUrl: string;
    maskImageUrl?: string;
    createdAt: string; // ISO 8601 形式の日時文字列
    updatedAt: string; // ISO 8601 形式の日時文字列
    projectId: string; // プロジェクト ID（外部キー）
}
