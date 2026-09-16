// app/api/hello/[id]/route.ts
// App Router の Route Handler サンプル
// アクセス例: GET /api/hello/1  → 200
//            GET /api/hello/999 → 404

import { NextRequest, NextResponse } from 'next/server';

// 疑似データ（本来は DB や外部 API から取得）
const items: Record<string, { id: string; name: string }> = {
  '1': { id: '1', name: 'Alice' },
  '2': { id: '2', name: 'Bob' },
};

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const item = items[id];

  if (!item) {
    // 見つからない場合は 404 を明示的に返す
    return NextResponse.json({ message: `Item ${id} not found` }, { status: 404 });
  }

  return NextResponse.json(item, { status: 200 });
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  return NextResponse.json({ message: 'created', data: body }, { status: 201 });
}
