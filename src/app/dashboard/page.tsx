// src/app/dashboard/page.tsx
"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Project, ProjectInput } from "../interfaces/global";
import { mockProjects } from "../mock";
import axios from "axios";

const Dashboard: React.FC = () => {

    const [projects, setProjects] = useState<Project[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const router = useRouter();

    useEffect(() => {
        // 初期データのフェッチ
        const fetchProjects = async () => {
            try {
                const response = await axios.get("/api/projects");
                if (response.data.success) {
                    setProjects(response.data.projects);
                } else {
                    console.error("プロジェクトの取得に失敗しました:", response.data.error);
                }
            } catch (error) {
                console.error("プロジェクトの取得中にエラーが発生しました:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchProjects();
    }, []);

    const handleSelectProject = (projectId: string) => {
        // プロジェクトIDを取得し、プロジェクト詳細ページに遷移
        router.push(`/edit/${projectId}`);
    };

    const handleCreateProject = async () => {
        const projectName = prompt("新しいプロジェクトの名前を入力してください:");
        if (!projectName) return;

        const projectDescription = prompt("プロジェクトの説明を入力してください:") || "";

        const newProjectInput: ProjectInput = {
            userId: "b834bf01-a4bc-4a79-ac0b-8ca793e05a16", // モックユーザーID
            name: projectName,
            description: projectDescription,
        };

        try {
            const response = await axios.post("/api/projects", newProjectInput);

            if (response.data.success) {
                setProjects([...projects, response.data.project]);
                handleSelectProject(response.data.project.id);
            } else {
                alert(`プロジェクトの作成に失敗しました: ${response.data.error}`);
            }
        } catch (error) {
            console.error("プロジェクトの作成中にエラーが発生しました:", error);
            alert("プロジェクトの作成中にエラーが発生しました。");
        }
    };

    if (loading) {
        return <div>読み込み中...</div>;
    }


    return (
        <div className="container mx-auto p-4">
            <h1 className="text-3xl mb-4">ダッシュボード</h1>
            <button
                onClick={handleCreateProject}
                className="mb-4 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
            >
                新しいプロジェクトを作成
            </button>
            {projects.length === 0 ? (
                <div>プロジェクトがありません。新しいプロジェクトを作成してください。</div>
            ) : (
                <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {projects.map((project) => (
                        <li
                            key={project.id}
                            className="border rounded p-4 flex flex-col justify-between"
                        >
                            <div>
                                <h2 className="text-xl font-semibold">{project.name}</h2>
                                <p className="text-gray-600">{project.description}</p>
                            </div>
                            <button
                                onClick={() => handleSelectProject(project.id)}
                                className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                            >
                                プロジェクトを編集
                            </button>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default Dashboard;
