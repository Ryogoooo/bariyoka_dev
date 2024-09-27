// src/app/edit/[project]/page.tsx
'use client';

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Canvas from "../components/canvas";
import axios from "axios";

export default function Page() {
    const { projectId } = useParams<{ projectId: string }>();
    const [imageUrl, setImageUrl] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchLatestImage = async () => {
            if (!projectId) {
                setError("プロジェクトIDが取得できません。");
                setLoading(false);
                return;
            }

            try {
                const response = await axios.get("/api/images", {
                    params: { projectId },
                });

                if (response.data.success) {
                    const images: any = response.data.images;
                    if (images.length === 0) {
                        // 画像が存在しない場合は初期画像アップロードページにリダイレクト
                        window.location.href = `/edit/${projectId}/upload-image`;
                        return;
                    }

                    // version が一番大きい画像を選択
                    const latestImage: any = images.reduce((prev: any, current: any) => {
                        return (prev.version > current.version) ? prev : current;
                    }, images[0]);

                    setImageUrl(latestImage.image_url);
                } else {
                    setError(`画像の取得に失敗しました: ${response.data.error}`);
                }
            } catch (err) {
                console.error("画像の取得中にエラーが発生しました:", err);
                setError("画像の取得中にエラーが発生しました。");
            } finally {
                setLoading(false);
            }
        };

        fetchLatestImage();
    }, [projectId]);

    if (loading) {
        return <div className="min-h-screen flex items-center justify-center">読み込み中...</div>;
    }

    if (error) {
        return <div className="min-h-screen flex items-center justify-center text-red-500">{error}</div>;
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 p-8">
            <div className="max-w-6xl mx-auto">
                <h1 className="text-4xl font-bold text-green-800 mb-8 text-center">
                    ノードエディタ
                </h1>
                <div className="bg-white rounded-lg shadow-xl overflow-hidden">
                    <div className="p-6">
                        {imageUrl ? (
                            <Canvas projectId={projectId} imageUrl={imageUrl} />
                        ) : (
                            <div className="text-center text-gray-500">画像が見つかりません。</div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}
