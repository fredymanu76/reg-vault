/**
 * Single Policy API Routes
 *
 * GET /api/policies/[id] - Get a policy by ID
 * PATCH /api/policies/[id] - Update a policy
 * DELETE /api/policies/[id] - Delete a policy
 */

import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = createServerSupabaseClient();
    const { id } = params;

    const { data, error } = await supabase
      .from('policies')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json(
          { error: 'Policy not found' },
          { status: 404 }
        );
      }
      console.error('Error fetching policy:', error);
      return NextResponse.json(
        { error: 'Failed to fetch policy' },
        { status: 500 }
      );
    }

    return NextResponse.json({ policy: data });
  } catch (error) {
    console.error('Error in GET /api/policies/[id]:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = createServerSupabaseClient();
    const { id } = params;
    const body = await request.json();

    // Remove fields that shouldn't be directly updated
    const { id: _, created_at, ...updates } = body;

    // Add updated_at timestamp
    updates.updated_at = new Date().toISOString();

    const { data, error } = await supabase
      .from('policies')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json(
          { error: 'Policy not found' },
          { status: 404 }
        );
      }
      console.error('Error updating policy:', error);
      return NextResponse.json(
        { error: 'Failed to update policy' },
        { status: 500 }
      );
    }

    return NextResponse.json({ policy: data });
  } catch (error) {
    console.error('Error in PATCH /api/policies/[id]:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = createServerSupabaseClient();
    const { id } = params;

    const { error } = await supabase
      .from('policies')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting policy:', error);
      return NextResponse.json(
        { error: 'Failed to delete policy' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error in DELETE /api/policies/[id]:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
