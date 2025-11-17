import { NextRequest, NextResponse } from 'next/server';

export async function GET() {
  try {
    const getWebhookUrl = process.env.NEXT_PUBLIC_N8N_GET_WEBHOOK_URL;

    if (!getWebhookUrl) {
      // Return empty array if webhook not configured
      return NextResponse.json([]);
    }

    const response = await fetch(getWebhookUrl);

    if (!response.ok) {
      console.warn('Webhook fetch failed:', response.statusText);
      return NextResponse.json([]);
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching prompts:', error);
    return NextResponse.json([]);
  }
}

export async function POST(request: NextRequest) {
  try {
    const createWebhookUrl = process.env.NEXT_PUBLIC_N8N_CREATE_WEBHOOK_URL;

    if (!createWebhookUrl) {
      return NextResponse.json(
        { error: 'Webhook not configured' },
        { status: 500 }
      );
    }

    const body = await request.json();

    const response = await fetch(createWebhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      throw new Error(`Webhook error: ${response.statusText}`);
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error: any) {
    console.error('Error creating prompt:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to create prompt' },
      { status: 500 }
    );
  }
}
