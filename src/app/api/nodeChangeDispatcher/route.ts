// src/app/api/process_nodes/route.ts
import { NextRequest, NextResponse } from "next/server";
import { ObjectNode } from "@/app/edit/interfaces";

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

export async function POST(request: NextRequest) {
    try {
        const { nodes } = await request.json();

        // 変更を検出するための処理
        for (const node of nodes) {
            const previousNode = previousNodes.find((n) => n.id === node.id);

            if (previousNode) {
                // 既存のノードの場合、差分を比較
                const nameOrPropertiesChanged =
                    previousNode.name !== node.name ||
                    JSON.stringify(previousNode.properties) !==
                    JSON.stringify(node.properties);

                const positionOrSizeChanged =
                    previousNode.coordinates.x !== node.coordinates.x ||
                    previousNode.coordinates.y !== node.coordinates.y ||
                    previousNode.shape !== node.shape ||
                    previousNode.size.width !== node.size.width ||
                    previousNode.size.height !== node.size.height;

                if (nameOrPropertiesChanged) {

                }

                if (positionOrSizeChanged) {
 
                }
            } else {
                // 新しいノードの場合
             
            }
        }

        // 仮想的にデータベースを更新
        previousNodes = nodes;

        return NextResponse.json({ nodes });
    } catch (error) {
        console.error("エラーが発生しました:", error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}
