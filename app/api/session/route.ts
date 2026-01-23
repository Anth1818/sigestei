import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get("auth-token")?.value;

    if (!token) {
      return NextResponse.json({ 
        authenticated: false, 
        expiresAt: null,
        timeLeft: 0 
      });
    }

    // Decodificar el payload del JWT
    const base64Payload = token.split(".")[1];
    const payload = JSON.parse(Buffer.from(base64Payload, "base64").toString());

    if (!payload.exp) {
      return NextResponse.json({ 
        authenticated: true, 
        expiresAt: null,
        timeLeft: 0 
      });
    }

    const currentTime = Math.floor(Date.now() / 1000);
    const timeLeft = payload.exp - currentTime;

    return NextResponse.json({
      authenticated: true,
      expiresAt: payload.exp,
      timeLeft: Math.max(0, timeLeft * 1000), // Convertir a milisegundos
    });
  } catch {
    return NextResponse.json({ 
      authenticated: false, 
      expiresAt: null,
      timeLeft: 0 
    });
  }
}
