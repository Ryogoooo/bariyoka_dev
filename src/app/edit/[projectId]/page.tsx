"use client";
import React, { useState } from "react";
import { useParams } from "next/navigation";
import Canvas from "../components/canvas";


export default function Page() {
    const { projectId } = useParams<{ projectId: string }>();

    return (
        <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 p-8">
            <div className="max-w-6xl mx-auto">
                <h1 className="text-4xl font-bold text-green-800 mb-8 text-center">
                    ノードエディタ
                </h1>
                <div className="bg-white rounded-lg shadow-xl overflow-hidden">
                    <div className="p-6">
                        <Canvas projectId={projectId} />
                    </div>
                </div>
            </div>
        </div>
    )
}