// app/page.tsx
"use client";

import React, { useState, useRef, useEffect } from "react";
import Node from "./Node";
import { ObjectNode } from "../interfaces";
import { v4 as uuidv4 } from "uuid";
import axios from "axios"; // Axiosをインポート

const initialNodes: ObjectNode[] = [
    {
        id: "node0",
        name: "ノード0",
        properties: { backgroundColor: "lightblue" },
        coordinates: { x: 10, y: 20 }, // パーセンテージ
        shape: "rectangle",
        size: { width: 10, height: 10 }, // パーセンテージ
    },
    {
        id: "node1",
        name: "ノード1",
        properties: { backgroundColor: "lightgreen" },
        coordinates: { x: 30, y: 10 }, // パーセンテージ
        shape: "rectangle",
        size: { width: 10, height: 10 }, // パーセンテージ
    },
];

interface CanvasProps {
    targetImagePath: string;
}
const Canvas: React.FC<CanvasProps> = ({
    targetImagePath
}) => {
    const [nodes, setNodes] = useState<ObjectNode[]>(initialNodes);
    const [canvasSize, setCanvasSize] = useState(800); // 初期キャンバスサイズ
    const canvasRef = useRef<HTMLDivElement>(null);

    // キャンバスのサイズを取得し、リサイズイベントに対応
    useEffect(() => {
        const updateCanvasSize = () => {
            const size = Math.min(window.innerWidth * 0.9, window.innerHeight * 0.9);
            setCanvasSize(size);
        };

        // 初回サイズ取得
        updateCanvasSize();

        // ウィンドウリサイズ時にキャンバスサイズを更新
        window.addEventListener("resize", updateCanvasSize);
        return () => window.removeEventListener("resize", updateCanvasSize);
    }, []);

    // ノードの変更を処理する関数
    const handleNodeChange = (id: string, changes: Partial<ObjectNode>) => {
        setNodes((prevNodes) =>
            prevNodes.map((node) =>
                node.id === id ? { ...node, ...changes } : node
            )
        );
    };

    // ノードを追加する関数
    const addNode = () => {
        const newNode: ObjectNode = {
            id: uuidv4(), // 固有のIDを生成
            name: `ノード${nodes.length + 1}`,
            properties: { backgroundColor: "lightyellow" },
            coordinates: { x: 50, y: 50 }, // パーセンテージ
            shape: "rectangle",
            size: { width: 10, height: 10 }, // パーセンテージ
        };
        setNodes([...nodes, newNode]);
    };

    // ノードを削除する関数
    const removeNode = (id: string) => {
        setNodes(nodes.filter((node) => node.id !== id));
    };

    // 決定ボタンをクリックしたとき、ノード情報をAPIに送信
    const handleConfirm = async () => {
        try {
            // ノード情報をAPIに送信
            const response = await axios.post("/api/process-nodes", { nodes });
            const updatedNodes = response.data.nodes;
            // マスク画像のパスを各ノードに追加
            setNodes(updatedNodes);
        } catch (error) {
            console.error("エラーが発生しました:", error);
        }
    };
    return (
        <div className="flex flex-col items-center">
            <button
                onClick={addNode}
                className="mb-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
                ノードを追加
            </button>
            <div
                ref={canvasRef}
                className="relative border-2 border-gray-300 overflow-hidden"
                style={{
                    width: `${canvasSize}px`,
                    height: `${canvasSize}px`,
                    backgroundImage: `url(${targetImagePath})`, // ここに背景画像のURLを指定
                    backgroundSize: 'cover', // 画像をコンテナに合わせてリサイズ
                    backgroundPosition: 'center', // 画像を中央に配置
                }}
            >
                {nodes.map((node) => (
                    <Node
                        key={node.id}
                        node={node}
                        onChange={handleNodeChange}
                        onDelete={removeNode}
                        canvasSize={canvasSize}
                    />
                ))}
            </div>
            {/* 「決定」ボタン */}
            <button
                onClick={handleConfirm}
                className="mt-4 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
            >
                決定
            </button>
        </div>
    );
};

export default Canvas;
