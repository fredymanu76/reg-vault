/**
 * Policies API Routes
 *
 * GET /api/policies - List policies for an application
 * POST /api/policies - Create a new policy
 */

import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase';

export async function GET(request: NextRequest) {
  try {
    const supabase = createServerSupabaseClient();
    const { searchParams } = new URL(request.url);
    const applicationId = searchParams.get('applicationId');

    if (!applicationId) {
      return NextResponse.json(
        { error: 'applicationId is required' },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from('policies')
      .select('*')
      .eq('application_id', applicationId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching policies:', error);
      return NextResponse.json(
        { error: 'Failed to fetch policies' },
        { status: 500 }
      );
    }

    return NextResponse.json({ policies: data });
  } catch (error) {
    console.error('Error in GET /api/policies:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = createServerSupabaseClient();
    const body = await request.json();

    const { application_id, name, content, metadata } = body;

    if (!application_id || !name) {
      return NextResponse.json(
        { error: 'application_id and name are required' },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from('policies')
      .insert([
        {
          application_id,
          name,
          content: content || '',
          version: 1,
          status: 'draft',
          metadata,
        },
      ])
      .select()
      .single();

    if (error) {
      console.error('Error creating policy:', error);
      return NextResponse.json(
        { error: 'Failed to create policy' },
        { status: 500 }
      );
    }

    return NextResponse.json({ policy: data }, { status: 201 });
  } catch (error) {
    console.error('Error in POST /api/policies:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
