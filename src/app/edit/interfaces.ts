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

export interface ObjectNode {
    id: string;
    name: string;
    properties: ObjectNodeProperties;
    coordinates: Coordinates;
    shape: Shape;
    size: Size;
    maskImagePath?: string; // マスク画像のパスを追加
}
