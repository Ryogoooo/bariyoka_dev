// src/app/api/nodes/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@//lib/supabaseClient';
import {  ObjectNodeInput } from '@/app/interfaces/ObjectNode';

export async function POST(request: NextRequest) {
    try {
        const nodeInput: ObjectNodeInput = await request.json();

        // 必須パラメータのチェック
        if (!nodeInput.imageId || !nodeInput.projectId || !nodeInput.coordinates || !nodeInput.size) {
            return NextResponse.json(
                { success: false, error: '必要なパラメータが不足しています。' },
                { status: 400 }
            );
        }

        const { data, error } = await supabase
            .from('Nodes')
            .insert<ObjectNodeInput>([nodeInput])
            .select();

        if (error) {
            console.error('ノードの作成に失敗しました:', error);
            return NextResponse.json({ success: false, error: error.message }, { status: 500 });
        }

        return NextResponse.json({ success: true, node: data[0] }, { status: 201 });
    } catch (error) {
        console.error('リクエストの処理中にエラーが発生しました:', error);
        return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
    }
}
