// app/interfaces/index.ts

export interface Coordinates {
    x: number; // パーセンテージ (0-100)
    y: number; // パーセンテージ (0-100)
}

export type Shape = 'rectangle' | 'circle' | 'ellipse' | 'polygon' | CustomShape;

export interface CustomShape {
    type: string;
    // 必要に応じて追加のプロパティ
}

export interface ObjectNodeProperties {
    backgroundColor?: string;
    // 他のプロパティをここに追加
}

export interface Size {
    width: number;  // パーセンテージ (0-100)
    height: number; // パーセンテージ (0-100)
}

export interface ObjectNodeInput {
    imageId: string;
    projectId: string;
    name?: string;
    properties?: Record<string, any>;
    coordinates: { x: number; y: number };
    shape?: string;
    size: { width: number; height: number };
    cropImageUrl?: string;
    maskImageUrl?: string;
}

export interface ObjectNode extends ObjectNodeInput {
    id: string; // UUID
    createdAt: string; // ISO 8601形式
    updatedAt: string; // ISO 8601形式
}