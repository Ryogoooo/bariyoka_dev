// src/app/api/upload-image/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { put } from '@vercel/blob';
import { supabase } from '@/lib/supabaseClient';
import { Image } from '@/app/interfaces/global';

export async function PUT(request: NextRequest) {
    try {
        const form = await request.formData();
        const file = form.get('file') as File | null;
        const projectId = form.get('projectId') as string | null;

        if (!file || !projectId) {
            return NextResponse.json(
                { success: false, error: '必要なパラメータが不足しています。' },
                { status: 400 }
            );
        }

        // Vercel Blob SDK を使用してファイルをアップロード
        const blob = await put(file.name, file, { access: 'public' });
        const imageUrl = blob.url;

        // データベースに新しいImageレコードを挿入
        const { data, error } = await supabase
            .from('Images')
            .insert([
                {
                    project_id: projectId,
                    image_url: imageUrl,
                    version: 1,
                },
            ])
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
