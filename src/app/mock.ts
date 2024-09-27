import {  ObjectNode } from './interfaces/ObjectNode';
import { User, Project, Image, } from './interfaces/global';

// テストユーザーデータ
export const mockUser: User = {
    id: 'user-uuid-1234',
    googleId: 'google-id-5678',
    email: 'testuser@example.com',
    name: 'テストユーザー',
    iconUrl: 'https://example.com/avatar.png',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
};

// テストプロジェクトデータ
export const mockProjects: Project[] = [
    {
        id: 'project-uuid-1',
        userId: mockUser.id,
        name: 'プロジェクトA',
        description: 'これはプロジェクトAの説明です。',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    },
    {
        id: 'project-uuid-2',
        userId: mockUser.id,
        name: 'プロジェクトB',
        description: 'これはプロジェクトBの説明です。',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    },
];

// テスト画像データ
export const mockImages: Image[] = [
    {
        id: 'image-uuid-1',
        projectId: 'project-uuid-1',
        imageUrl: 'https://example.com/image1.png',
        version: 1,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    },
    {
        id: 'image-uuid-2',
        projectId: 'project-uuid-1',
        imageUrl: 'https://example.com/image2.png',
        version: 2,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    },
    {
        id: 'image-uuid-3',
        projectId: 'project-uuid-2',
        imageUrl: 'https://example.com/image3.png',
        version: 1,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    },
];

// テストノードデータ
export const mockNodes: ObjectNode[] = [
    {
        id: 'node-uuid-1',
        imageId: 'image-uuid-1',
        name: 'ノード1',
        properties: { backgroundColor: 'lightyellow' },
        coordinates: { x: 50, y: 50 },
        shape: 'rectangle',
        size: { width: 100, height: 100 },
        cropImageUrl: 'https://example.com/crop1.png',
        maskImageUrl: 'https://example.com/mask1.png',
        projectId: 'project-uuid-1', // 追加
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    },
    {
        id: 'node-uuid-2',
        imageId: 'image-uuid-2',
        name: 'ノード2',
        properties: { backgroundColor: 'lightblue' },
        coordinates: { x: 50, y: 50 },
        shape: 'rectangle',
        size: { width: 100, height: 100 },
        cropImageUrl: 'https://example.com/crop2.png',
        maskImageUrl: 'https://example.com/mask2.png',
        projectId: 'project-uuid-2', // 追加
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    },
];