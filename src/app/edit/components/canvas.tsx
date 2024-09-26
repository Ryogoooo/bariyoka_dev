// src/app/edit/components/canvas.tsx
'use client';

import React, { useState, useRef, useEffect } from "react";
import Node from "./Node";
import { ObjectNode } from "../../interfaces/ObjectNode";
import { v4 as uuidv4 } from "uuid";
import axios from "axios";

interface CanvasProps {
    projectId: string;
    imageUrl: string;
}

const Canvas: React.FC<CanvasProps> = ({
    projectId,
    imageUrl
}) => {
    const initialNodes: ObjectNode[] = []; // データベースから取得したノード情報を格納
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
                node.id === id ? { ...node, ...changes, updatedAt: new Date().toISOString() } : node
            )
        );
    };

    // ノードを追加する関数
    const addNode = async () => {
        const newNode: ObjectNode = {
            id: uuidv4(), // 固有のIDを生成
            imageId: 'default', // 適切な imageId を設定
            name: `新規ノード`,
            properties: { backgroundColor: "lightyellow" },
            coordinates: { x: 50, y: 50 },
            shape: "rectangle",
            size: { width: 100, height: 100 },
            projectId: projectId, // 正しいプロジェクトIDを設定
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        };
        setNodes([...nodes, newNode]);

        // 必要に応じてデータベースに新しいノードを保存
        try {
            const response = await axios.post("/api/nodes", newNode);
            if (response.data.success) {
                console.log("ノードが正常に保存されました:", response.data.node);
            } else {
                console.error("ノードの保存に失敗しました:", response.data.error);
            }
        } catch (error) {
            console.error("ノードの保存中にエラーが発生しました:", error);
        }
    };

    // ノードを削除する関数
    const removeNode = (id: string) => {
        setNodes(nodes.filter((node) => node.id !== id));

        // 必要に応じてデータベースからノードを削除
        axios.delete(`/api/nodes/${id}`)
            .then(response => {
                if (response.data.success) {
                    console.log("ノードが正常に削除されました:", response.data.message);
                } else {
                    console.error("ノードの削除に失敗しました:", response.data.error);
                }
            })
            .catch(error => {
                console.error("ノードの削除中にエラーが発生しました:", error);
            });
    };

    // 決定ボタンをクリックしたとき、ノード情報をAPIに送信
    const handleConfirm = async () => {
        try {
            setLoading(true);
            // ノード情報をAPIに送信
            const response = await axios.post("/api/nodeChangeDispatcher", { nodes });
            if (response.data.success) {
                alert("ノード情報が正常に送信されました。");
                console.log("ノード情報を送信しました:", response.data);
            } else {
                alert(`ノード情報の送信に失敗しました: ${response.data.error}`);
            }
        } catch (error) {
            console.error("エラーが発生しました:", error);
            alert("ノード情報の送信中にエラーが発生しました。");
        } finally {
            setLoading(false);
        }
    };

    const [loadingConfirm, setLoading] = useState<boolean>(false);

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
                    backgroundImage: `url(${imageUrl})`, // ここに背景画像のURLを指定
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
                disabled={loadingConfirm}
            >
                {loadingConfirm ? "送信中..." : "決定"}
            </button>
        </div>
    );
};

export default Canvas;
