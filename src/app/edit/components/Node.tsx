// app/components/Node.tsx
"use client";

import React, { useState, useEffect, useRef } from "react";
import Draggable, { DraggableData, DraggableEvent } from "react-draggable";
import { Resizable } from "react-resizable";
import { ObjectNode } from "../../interfaces/ObjectNode";

interface NodeProps {
    node: ObjectNode;
    onChange: (id: string, changes: Partial<ObjectNode>) => void;
    onDelete: (id: string) => void;
    canvasSize: number;
}

const Node: React.FC<NodeProps> = ({
    node,
    onChange,
    onDelete,
    canvasSize,
}) => {
    const [position, setPosition] = useState({
        x: (node.coordinates.x / 100) * canvasSize,
        y: (node.coordinates.y / 100) * canvasSize,
    });
    const [size, setSize] = useState({
        width: (node.size.width / 100) * canvasSize,
        height: (node.size.height / 100) * canvasSize,
    });
    const [properties, setProperties] = useState(node.properties);

    const nodeRef = useRef<HTMLDivElement>(null);

    // キャンバスサイズが変更された場合にノードの位置とサイズを更新
    useEffect(() => {
        setPosition({
            x: (node.coordinates.x / 100) * canvasSize,
            y: (node.coordinates.y / 100) * canvasSize,
        });
        setSize({
            width: (node.size.width / 100) * canvasSize,
            height: (node.size.height / 100) * canvasSize,
        });
    }, [canvasSize, node.coordinates, node.size]);

    // ドラッグ時のハンドラ
    const handleDrag = (e: DraggableEvent, data: DraggableData) => {
        let newX = data.x;
        let newY = data.y;

        // キャンバスの境界内に制限
        newX = Math.max(0, Math.min(newX, canvasSize - size.width));
        newY = Math.max(0, Math.min(newY, canvasSize - size.height));

        setPosition({ x: newX, y: newY });

        const newCoordinates = {
            x: (newX / canvasSize) * 100,
            y: (newY / canvasSize) * 100,
        };
        onChange(node.id, { coordinates: newCoordinates });
    };

    // リサイズ時のハンドラ
    const handleResize = (
        e: React.SyntheticEvent,
        { size: newSize }: { size: { width: number; height: number } }
    ) => {
        let newWidth = newSize.width;
        let newHeight = newSize.height;

        // 最大サイズをキャンバスに制限
        newWidth = Math.min(newWidth, canvasSize - position.x);
        newHeight = Math.min(newHeight, canvasSize - position.y);

        setSize({
            width: newWidth,
            height: newHeight,
        });

        const updatedSize = {
            width: (newWidth / canvasSize) * 100,
            height: (newHeight / canvasSize) * 100,
        };
        onChange(node.id, { size: updatedSize });
    };

    // プロパティが変更されたときのハンドラ
    const handleBackgroundColorChange = (
        e: React.ChangeEvent<HTMLInputElement>
    ) => {
        const newColor = e.target.value;
        const updatedProperties = { ...properties, backgroundColor: newColor };
        setProperties(updatedProperties);
        onChange(node.id, { properties: updatedProperties });
    };

    return (
        <Draggable
            nodeRef={nodeRef}
            position={position}
            onDrag={handleDrag}
            cancel=".resize-handle"
            bounds="parent"
        >
            <div
                ref={nodeRef}
                className="absolute"
                style={{
                    width: size.width,
                    height: size.height,
                }}
            >
                <Resizable
                    width={size.width}
                    height={size.height}
                    onResize={handleResize}
                    handle={
                        <span className="absolute w-4 h-4 bg-gray-500 rounded-full cursor-se-resize resize-handle right-0 bottom-0" />
                    }
                    minConstraints={[20, 20]}
                    maxConstraints={[
                        canvasSize - position.x,
                        canvasSize - position.y,
                    ]}
                >
                    <div
                        className="relative border border-black flex items-center justify-center select-none"
                        style={{
                            width: "100%",
                            height: "100%",
                            backgroundColor: properties.backgroundColor
                                ? `${properties.backgroundColor}80` // カスタム色 + 50% 透明
                                : "#FFFFFF80", // 白 + 50% 透明
                        }}
                    >
                        <span>{node.name}</span>
                        {/* プロパティ編集用のUI */}
                        <div className="absolute bottom-1 left-1">
                            <input
                                type="color"
                                value={properties.backgroundColor || "#ffffff"}
                                onChange={handleBackgroundColorChange}
                                title="背景色を変更"
                                className="w-6 h-6 p-0 border-none"
                            />
                        </div>
                        {/* ノード削除ボタン */}
                        <button
                            className="absolute top-[-10px] right-[-10px] bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs cursor-pointer"
                            onClick={() => onDelete(node.id)}
                            title="ノードを削除"
                        >
                            ×
                        </button>
                    </div>
                </Resizable>
            </div>
        </Draggable>
    );
};

export default Node;
