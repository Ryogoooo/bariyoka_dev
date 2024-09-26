// src/app/edit/[projectId]/upload-image/page.tsx
'use client';

import React, { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import axios from "axios";

const UploadImagePage: React.FC = () => {
    const { projectId } = useParams<{ projectId: string }>();
    const router = useRouter();

    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            setSelectedFile(e.target.files[0]);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!selectedFile) {
            setError("画像ファイルを選択してください。");
            return;
        }

        if (!projectId) {
            setError("プロジェクトIDが取得できません。");
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const formData = new FormData();
            formData.append('file', selectedFile);
            formData.append('projectId', projectId);

            const response = await axios.put("/api/upload-image", formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            if (response.data.success) {
                alert("画像が正常にアップロードされました。");
                router.push(`/edit/${projectId}`);
            } else {
                setError(`画像のアップロードに失敗しました: ${response.data.error}`);
            }
        } catch (error: any) {
            console.error("画像のアップロード中にエラーが発生しました:", error);
            setError("画像のアップロード中にエラーが発生しました。");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-3xl mb-4">初期画像のアップロード</h1>
            <form onSubmit={handleSubmit} className="max-w-md mx-auto">
                <div className="mb-4">
                    <label htmlFor="file" className="block text-gray-700 mb-2">
                        画像ファイル:
                    </label>
                    <input
                        type="file"
                        id="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        required
                        className="w-full px-3 py-2 border rounded"
                    />
                </div>
                {error && <div className="mb-4 text-red-500">{error}</div>}
                <button
                    type="submit"
                    disabled={loading}
                    className={`w-full px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600 ${loading ? "opacity-50 cursor-not-allowed" : ""
                        }`}
                >
                    {loading ? "アップロード中..." : "アップロード"}
                </button>
            </form>
        </div>
    );
};

export default UploadImagePage;
