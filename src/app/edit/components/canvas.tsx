// src/app/edit/components/canvas.tsx
'use client';

import React, { useState, useRef, useEffect, MouseEvent } from "react";
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
    const [loadingConfirm, setLoadingConfirm] = useState<boolean>(false);
    const [isProcessing, setIsProcessing] = useState<boolean>(false); // API処理中かどうか
    const [maskImageUrl, setMaskImageUrl] = useState<string | null>(null); // 取得したマスク画像のURL
    const [_maskData, setMaskData] = useState<HTMLImageElement>(null); // マスクに関連するデータ
    const [showMaskOptions, setShowMaskOptions] = useState<boolean>(false); // マスクの承認/再生成オプションを表示するか
    const [clickCoordinates, setClickCoordinates] = useState<{ x: number; y: number } | null>(null); // クリック位置


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

    // キャンバスがクリックされたときの処理
    const handleCanvasClick = async (e: MouseEvent<HTMLDivElement>) => {
        if (isProcessing || showMaskOptions) return; // 処理中またはマスク確認中は無視

        setIsProcessing(true);

        // クリック位置の取得
        const rect = canvasRef.current?.getBoundingClientRect();
        if (!rect) {
            setIsProcessing(false);
            return;
        }

        const clickX = e.clientX - rect.left;
        const clickY = e.clientY - rect.top;

        // キャンバスサイズに対する相対座標に変換
        const relativeX = (clickX / canvasSize) * 100; // パーセンテージ
        const relativeY = (clickY / canvasSize) * 100; // パーセンテージ

        setClickCoordinates({ x: relativeX, y: relativeY });

        // APIにデータを送信
        try {
            // モックの API エンドポイントにリクエストを送信
            const response = await axios.post("/api", {
                projectId,
                imageUrl,
                clickCoordinates: { x: relativeX, y: relativeY },
            });

            if (response.data.success) {
                // マスク画像のURLを取得
                const maskUrl = response.data.maskImageUrl;
                setMaskImageUrl(maskUrl);
                setMaskData(response.data.maskData); // 必要に応じて追加データを保存

                // マスクの承認/再生成オプションを表示
                setShowMaskOptions(true);
            } else {
                alert(`マスク画像の取得に失敗しました: ${response.data.error}`);
            }
        } catch (error) {
            console.error("API呼び出し中にエラーが発生しました:", error);
            alert("オブジェクトの検出中にエラーが発生しました。");
        } finally {
            setIsProcessing(false);
        }
    };



    // マスクからノードを作成する関数
    const createNodeFromMask = async () => {
        if (!maskImageUrl) return;

        // マスク画像を読み込み、矩形の位置とサイズを取得
        const maskImage = new Image();
        maskImage.crossOrigin = "Anonymous"; // CORS回避
        maskImage.src = maskImageUrl;
        maskImage.onload = async () => {
            // マスク画像のキャンバスを作成
            const tempCanvas = document.createElement("canvas");
            tempCanvas.width = maskImage.width;
            tempCanvas.height = maskImage.height;
            const ctx = tempCanvas.getContext("2d");
            if (!ctx) return;

            ctx.drawImage(maskImage, 0, 0);

            // マスク画像のピクセルデータを取得
            const imageData = ctx.getImageData(0, 0, tempCanvas.width, tempCanvas.height);
            const data = imageData.data;

            // マスク部分の境界を計算
            let minX = tempCanvas.width, minY = tempCanvas.height, maxX = 0, maxY = 0;
            for (let y = 0; y < tempCanvas.height; y++) {
                for (let x = 0; x < tempCanvas.width; x++) {
                    const index = (y * tempCanvas.width + x) * 4;
                    const alpha = data[index + 3];
                    if (alpha > 0) { // マスク部分
                        if (x < minX) minX = x;
                        if (x > maxX) maxX = x;
                        if (y < minY) minY = y;
                        if (y > maxY) maxY = y;
                    }
                }
            }

            // ノードの位置とサイズを計算（キャンバスサイズに対する割合）
            const nodeX = ((minX + maxX) / 2) / tempCanvas.width * 100;
            const nodeY = ((minY + maxY) / 2) / tempCanvas.height * 100;
            const nodeWidth = (maxX - minX) / tempCanvas.width * 100;
            const nodeHeight = (maxY - minY) / tempCanvas.height * 100;

            // ノード名をユーザーに入力させる
            const nodeName = prompt("ノードの名前を入力してください:") || "新しいノード";

            // 新しいノードを作成
            const newNode: ObjectNode = {
                id: uuidv4(),
                imageId: 'default', // 適切な imageId を設定
                name: nodeName,
                properties: { backgroundColor: "lightyellow" },
                coordinates: { x: nodeX, y: nodeY },
                shape: "rectangle",
                size: { width: nodeWidth, height: nodeHeight },
                projectId: projectId,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
            };

            setNodes([...nodes, newNode]);

            // データベースにノードを保存
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

            // マスク関連の状態をリセット
            setMaskImageUrl(null);
            setShowMaskOptions(false);
            setMaskData(null);
            setClickCoordinates(null);
        };
    };

    const handleAcceptMask = () => {
        createNodeFromMask();
    };
    // マスクを再生成する処理
    const handleRegenerateMask = async () => {
        if (!clickCoordinates) return;

        setIsProcessing(true);

        try {
            // 同じクリック座標でAPIを再呼び出し
            const response = await axios.post("/api/click-mask", {
                projectId,
                imageUrl,
                clickCoordinates,
            });

            if (response.data.success) {
                // マスク画像のURLを更新
                const maskUrl = response.data.maskImageUrl;
                setMaskImageUrl(maskUrl);
                setMaskData(response.data.maskData); // 必要に応じて追加データを保存

                // マスクの承認/再生成オプションを表示
                setShowMaskOptions(true);
            } else {
                alert(`マスク画像の取得に失敗しました: ${response.data.error}`);
            }
        } catch (error) {
            console.error("API呼び出し中にエラーが発生しました:", error);
            alert("オブジェクトの検出中にエラーが発生しました。");
        } finally {
            setIsProcessing(false);
        }
    };

    // マスクをキャンセルする処理
    const handleRejectMask = () => {
        // マスク関連の状態をリセット
        setMaskImageUrl(null);
        setShowMaskOptions(false);
        setMaskData(null);
        setClickCoordinates(null);
    };

    // ノードの変更を処理する関数
    const handleNodeChange = (id: string, changes: Partial<ObjectNode>) => {
        setNodes((prevNodes) =>
            prevNodes.map((node) =>
                node.id === id ? { ...node, ...changes, updatedAt: new Date().toISOString() } : node
            )
        );
    };

    // ノードを削除する関数
    const removeNode = (id: string) => {
        setNodes(nodes.filter((node) => node.id !== id));

        // データベースからノードを削除
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
            setLoadingConfirm(true);
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
            setLoadingConfirm(false);
        }
    };

    return (
        <div className="flex flex-col items-center">
            <div
                ref={canvasRef}
                className="relative border-2 border-gray-300 overflow-hidden"
                style={{
                    width: `${canvasSize}px`,
                    height: `${canvasSize}px`,
                    backgroundImage: `url(${imageUrl})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    cursor: isProcessing || showMaskOptions ? 'not-allowed' : 'crosshair', // マスク確認中はクリック不可
                }}
                onClick={handleCanvasClick}
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
                {/* マスク画像をオーバーレイ表示 */}
                {maskImageUrl && (
                    <img
                        src={maskImageUrl}
                        alt="Mask"
                        className="absolute top-0 left-0 w-full h-full pointer-events-none"
                        style={{ objectFit: 'cover' }}
                    />
                )}
            </div>

            {/* マスクの承認/再生成オプション */}
            {showMaskOptions && (
                <div className="mt-4 flex space-x-4">
                    <button
                        onClick={handleAcceptMask}
                        className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                    >
                        マスクを承認
                    </button>
                    <button
                        onClick={handleRegenerateMask}
                        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                        disabled={isProcessing}
                    >
                        {isProcessing ? "再生成中..." : "マスクを再生成"}
                    </button>
                    <button
                        onClick={handleRejectMask}
                        className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                    >
                        キャンセル
                    </button>
                </div>
            )}

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
