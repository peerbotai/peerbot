import { NextRequest, NextResponse } from 'next/server';
import { app } from '@/lib/slack/app';

export async function POST(request: NextRequest) {
  const body = await request.json();

  // Handle Slack URL verification
  if (body.type === 'url_verification') {
    return NextResponse.json({ challenge: body.challenge });
  }

  // Process other events
  try {
    await app.processWebhookEvent(body);
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error('Error processing event:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}