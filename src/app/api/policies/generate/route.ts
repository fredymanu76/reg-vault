/**
 * Policy Generation API Route
 *
 * POST /api/policies/generate - Generate policies from templates
 */

import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase';
import { policyTemplates, PolicyTemplate } from '@/data/policy-templates';

interface GenerateRequest {
  applicationId: string;
  templateId: string;
  companyName: string;
  licenceType: string;
  customFields?: Record<string, string>;
}

/**
 * Generate policy content from template
 * In production, this would integrate with an AI service (OpenAI, Anthropic, etc.)
 */
function generatePolicyContent(
  template: PolicyTemplate,
  companyName: string,
  licenceType: string,
  customFields?: Record<string, string>
): string {
  return `
# ${template.name}

**Company:** ${companyName}
**Licence Type:** ${licenceType}
**Version:** 1.0
**Date:** ${new Date().toLocaleDateString('en-GB')}

---

## 1. Purpose

This ${template.name.toLowerCase()} has been prepared for ${companyName} as part of the FCA ${licenceType} authorisation application.

## 2. Scope and Application

This policy applies to all employees, directors, and agents of ${companyName}.

## 3. Regulatory Framework

This policy addresses the requirements set out in:
${template.fcaReference.map(ref => `- ${ref}`).join('\n')}

## 4. Policy Content

${template.description}

[Detailed policy content to be generated from template: ${template.filename}]

${customFields ? `
## 5. Custom Provisions

${Object.entries(customFields).map(([key, value]) => `**${key}:** ${value}`).join('\n')}
` : ''}

---

**Document Control**
- Status: Draft (Pending Review)
- Review Date: ${new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toLocaleDateString('en-GB')}
- Owner: Compliance Officer
- Category: ${template.category}
`.trim();
}

export async function POST(request: NextRequest) {
  try {
    const supabase = createServerSupabaseClient();
    const body: GenerateRequest = await request.json();

    const { applicationId, templateId, companyName, licenceType, customFields } = body;

    // Validate required fields
    if (!applicationId || !templateId || !companyName || !licenceType) {
      return NextResponse.json(
        { error: 'applicationId, templateId, companyName, and licenceType are required' },
        { status: 400 }
      );
    }

    // Find the template
    const template = policyTemplates.find(t => t.id === templateId);
    if (!template) {
      return NextResponse.json(
        { error: `Template not found: ${templateId}` },
        { status: 404 }
      );
    }

    // Generate policy content
    const content = generatePolicyContent(template, companyName, licenceType, customFields);

    // Create the policy in the database
    const { data, error } = await supabase
      .from('policies')
      .insert([
        {
          application_id: applicationId,
          name: template.name,
          content,
          version: 1,
          status: 'draft',
          metadata: {
            templateId: template.id,
            licenceType,
            companyName,
            category: template.category,
            fcaReference: template.fcaReference,
            customFields,
            generatedAt: new Date().toISOString(),
          },
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

    return NextResponse.json({
      success: true,
      policy: data,
    }, { status: 201 });
  } catch (error) {
    console.error('Error in POST /api/policies/generate:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
