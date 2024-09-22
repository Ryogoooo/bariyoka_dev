'use server'
import { NextRequest, NextResponse } from "next/server";
import { ObjectNode } from "@/app/edit/interfaces";
import path from "path";
import fs from "fs";
import sharp from "sharp"; // 画像処理ライブラリ


// 仮想的なデータベース（テストデータ）
let previousNodes: ObjectNode[] = [
    {
        id: "existing-node-id-1",
        name: "ノード1",
        properties: { backgroundColor: "lightblue" },
        coordinates: { x: 10, y: 10 },
        shape: "rectangle",
        size: { width: 10, height: 10 },
    },
    // 他のノード...
];

// 各条件に対応する関数のプレースホルダー
function handleNameOrPropertiesChange(node: ObjectNode) {
    // 名前またはプロパティが変更された場合の処理
    console.log(`名前またはプロパティが変更されました: ${node.id}`);
}

function handlePositionOrSizeChange(node: ObjectNode) {
    // 位置、形状、またはサイズが変更された場合の処理
    console.log(`位置、形状、またはサイズが変更されました: ${node.id}`);
}

function handleNewNode(node: ObjectNode) {
    // 新しいノードの場合の処理
    console.log(`新しいノードが追加されました: ${node.id}`);
}
export async function POST(request: NextRequest) {

    try {
        const node  = await request.json();

            // マスク画像のパスを生成
            const maskImagePath = `/masked_images/${node.id}_mask.png`;
            const absolutePath = path.join(process.cwd(), "public", maskImagePath);

            // マスク画像を生成（単純なプレースホルダーとして黒い画像を生成）
            const canvasSize = 800; // キャンバスサイズを固定（必要に応じて調整）

            // ノードの位置とサイズをピクセル単位で計算
            const x = (node.coordinates.x / 100) * canvasSize;
            const y = (node.coordinates.y / 100) * canvasSize;
            const width = (node.size.width / 100) * canvasSize;
            const height = (node.size.height / 100) * canvasSize;

            // 黒い背景画像を作成
            const background = sharp({
                create: {
                    width: canvasSize,
                    height: canvasSize,
                    channels: 3,
                    background: { r: 0, g: 0, b: 0 },
                },
            });

            // 白い矩形を描画
            const mask = Buffer.alloc(Math.floor(width) * Math.floor(height) * 3, 255); // 白色

            const overlay = sharp(mask, {
                raw: {
                    width: Math.floor(width),
                    height: Math.floor(height),
                    channels: 3,
                },
            });

            // 背景と白い矩形を合成
            const compositeImage = await background
                .composite([
                    {
                        input: await overlay.png().toBuffer(),
                        left: Math.floor(x),
                        top: Math.floor(y),
                    },
                ])
                .png()
                .toBuffer();

            // マスク画像を保存
            await fs.promises.mkdir(path.dirname(absolutePath), { recursive: true });
            await fs.promises.writeFile(absolutePath, compositeImage);

            // ノードにマスク画像のパスを追加
            node.maskImagePath = maskImagePath;
            const updatedNode:ObjectNode = node;
        

        return NextResponse.json({ node: updatedNode });
    } catch (error) {
        console.error("エラーが発生しました:", error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}
