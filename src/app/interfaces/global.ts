export interface User {
    id: string; // UUID
    googleId: string; // Google のユーザー ID
    email: string;
    name?: string;
    iconUrl?: string;
    createdAt: string; // ISO 8601 形式の日時文字列
    updatedAt: string; // ISO 8601 形式の日時文字列
}

export interface ProjectInput {
    userId: string; // 既に存在するユーザーのID
    name: string;
    description?: string;
}
export interface Project extends ProjectInput {
    id: string; // UUID
    createdAt: string; // ISO 8601形式
    updatedAt: string; // ISO 8601形式
}

export interface ImageInput {
    projectId: string;
    imageUrl: string;
    version: number;
}
export interface Image extends ImageInput {
    id: string; // UUID
    createdAt: string; // ISO 8601形式
    updatedAt: string; // ISO 8601形式
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
