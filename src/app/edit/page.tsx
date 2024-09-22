"use client";
import React, { useState } from "react";
import Canvas from "./components/canvas";


export default function Page() {
    const [targetImagePath, _setTargetImagePath] = useState("images/sample.jpg");
    return (
        <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 p-8">
            <div className="max-w-6xl mx-auto">
                <h1 className="text-4xl font-bold text-green-800 mb-8 text-center">
                    ノードエディタ
                </h1>
                <div className="bg-white rounded-lg shadow-xl overflow-hidden">
                    <div className="p-6">
                        <Canvas targetImagePath={targetImagePath} />
                    </div>
                </div>
            </div>
        </div>
    )
}