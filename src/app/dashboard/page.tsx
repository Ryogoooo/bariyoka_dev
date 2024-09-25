// src/app/dashboard/page.tsx
"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Project } from "../interfaces/global";
import { mockProjects } from "../mock";

const Dashboard: React.FC = () => {
    const [projects, setProjects] = useState<Project[]>(mockProjects);
    const router = useRouter();

    const handleSelectProject = (projectId: string) => {
        // プロジェクトIDを取得し、プロジェクト詳細ページに遷移
        router.push(`/dashboard/${projectId}`);
    };

    const handleCreateProject = () => {
        // 新しいプロジェクトを作成（テストデータの追加）
        const newProject: Project = {
            id: `project-uuid-${projects.length + 1}`,
            userId: "user-uuid-1234", // mockUser.id
            name: `プロジェクト${String.fromCharCode(65 + projects.length)}`, // プロジェクトC, D, ...
            description: `これはプロジェクト${String.fromCharCode(
                65 + projects.length
            )}の説明です。`,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        };
        setProjects([...projects, newProject]);
    };

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
                                プロジェクトを選択
                            </button>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default Dashboard;
