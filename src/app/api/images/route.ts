// src/app/api/images/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabaseClient';
import { ImageInput } from '@/app/interfaces/global';

export async function POST(request: NextRequest) {
    try {
        const imageInput: ImageInput = await request.json();

        // 必須パラメータのチェック
        if (!imageInput.projectId || !imageInput.imageUrl || imageInput.version === undefined) {
            return NextResponse.json(
                { success: false, error: '必要なパラメータが不足しています。' },
                { status: 400 }
            );
        }

        const { data, error } = await supabase
            .from('Images')
            .insert<ImageInput>([imageInput])
            .select();

        if (error) {
            console.error('画像の作成に失敗しました:', error);
            return NextResponse.json({ success: false, error: error.message }, { status: 500 });
        }

        return NextResponse.json({ success: true, image: data[0] }, { status: 201 });
    } catch (error) {
        console.error('リクエストの処理中にエラーが発生しました:', error);
        return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
    }
}

// GET: プロジェクトIDに基づいて画像を取得
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const projectId = searchParams.get('projectId');

        if (!projectId) {
            return NextResponse.json(
                { success: false, error: 'projectIdが必要です。' },
                { status: 400 }
            );
        }

        const { data, error } = await supabase
            .from('Images')
            .select('*')
            .eq('project_id', projectId);

        if (error) {
            console.error('画像の取得に失敗しました:', error);
            return NextResponse.json({ success: false, error: error.message }, { status: 500 });
        }

        return NextResponse.json({ success: true, images: data }, { status: 200 });
    } catch (error) {
        console.error('リクエストの処理中にエラーが発生しました:', error);
        return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
    }
}