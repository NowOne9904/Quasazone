import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const code = searchParams.get("code");
    const error = searchParams.get("error");

    if (error || !code) {
        return new NextResponse(`<h2>❌ 인증 실패: ${error ?? "code 없음"}</h2>`, {
            headers: { "Content-Type": "text/html; charset=utf-8" }
        });
    }

    const clientId = process.env.NAVER_CLIENT_ID!;
    const clientSecret = process.env.NAVER_CLIENT_SECRET!;
    const redirectUri = `${process.env.NEXT_PUBLIC_BASE_URL ?? "https://quasazone.vercel.app"}/api/naver/callback`;

    // 인가코드 → 토큰 교환
    const tokenRes = await fetch(
        `https://nid.naver.com/oauth2.0/token` +
        `?grant_type=authorization_code` +
        `&client_id=${clientId}` +
        `&client_secret=${clientSecret}` +
        `&redirect_uri=${encodeURIComponent(redirectUri)}` +
        `&code=${code}`,
        { method: "GET" }
    );

    if (!tokenRes.ok) {
        return new NextResponse(`<h2>❌ 토큰 발급 실패 (${tokenRes.status})</h2>`, {
            headers: { "Content-Type": "text/html; charset=utf-8" }
        });
    }

    const tokens = await tokenRes.json();
    const refreshToken: string = tokens.refresh_token ?? "";
    const accessToken: string = tokens.access_token ?? "";

    const html = `
<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="utf-8">
  <title>네이버 인증 완료</title>
  <style>
    body { font-family: sans-serif; max-width: 700px; margin: 60px auto; padding: 0 20px; background: #111; color: #eee; }
    h2 { color: #4ade80; }
    .box { background: #1e1e1e; border: 1px solid #333; border-radius: 8px; padding: 16px; margin: 16px 0; word-break: break-all; }
    .label { color: #888; font-size: 12px; margin-bottom: 4px; }
    .token { color: #60a5fa; font-family: monospace; font-size: 13px; }
    .warn { color: #fbbf24; font-size: 13px; margin-top: 20px; }
    button { background: #3b82f6; color: white; border: none; padding: 8px 16px; border-radius: 6px; cursor: pointer; margin-top: 8px; }
  </style>
</head>
<body>
  <h2>✅ 네이버 인증 완료!</h2>
  <p>아래 <strong>Refresh Token</strong>을 복사해서 Vercel 환경변수에 등록하세요.</p>

  <div class="box">
    <div class="label">NAVER_REFRESH_TOKEN (Vercel에 등록할 값)</div>
    <div class="token" id="rt">${refreshToken}</div>
    <button onclick="navigator.clipboard.writeText('${refreshToken}')">📋 복사</button>
  </div>

  <div class="box">
    <div class="label">Access Token (현재 세션용, 1시간 유효)</div>
    <div class="token">${accessToken}</div>
  </div>

  <div class="warn">
    ⚠️ 이 페이지를 닫기 전에 Refresh Token을 반드시 복사하세요.<br>
    Vercel Dashboard → Settings → Environment Variables → <strong>NAVER_REFRESH_TOKEN</strong> 으로 등록 후 재배포하면 실데이터가 연동됩니다.
  </div>
</body>
</html>`;

    return new NextResponse(html, {
        headers: { "Content-Type": "text/html; charset=utf-8" }
    });
}
