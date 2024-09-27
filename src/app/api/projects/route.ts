// src/app/api/projects/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabaseClient';
import { Project, ProjectInput } from '@/app/interfaces/global';

export async function POST(request: NextRequest) {
    try {
        const projectInput: ProjectInput = await request.json();

        // データベースにプロジェクトを挿入
        const { data, error } = await supabase
            .from('Projects')
            .insert([{
            user_id: projectInput.userId,
            name: projectInput.name,
            description: projectInput.description,
            // 他のフィールドも同様に変換
            }])
            .select();

        if (error) {
            console.error('プロジェクトの作成に失敗しました:', error);
            return NextResponse.json({ success: false, error: error.message }, { status: 500 });
        }

        return NextResponse.json({ success: true, project: data[0] }, { status: 201 });
    } catch (error) {
        console.error('リクエストの処理中にエラーが発生しました:', error);
        return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
    }
}

export async function GET(request: NextRequest) {
    try {
        // モックユーザーIDを使用
        const userId = 'b834bf01-a4bc-4a79-ac0b-8ca793e05a16';

        const { data, error } = await supabase
            .from('Projects')
            .select('*')
            .eq('user_id', userId);

        if (error) {
            console.error('プロジェクトの取得に失敗しました:', error);
            return NextResponse.json({ success: false, error: error.message }, { status: 500 });
        }

        return NextResponse.json({ success: true, projects: data }, { status: 200 });
    } catch (error) {
        console.error('リクエストの処理中にエラーが発生しました:', error);
        return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
    }
}