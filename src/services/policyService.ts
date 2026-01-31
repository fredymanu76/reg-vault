/**
 * Policy Service
 *
 * Handles policy template management, generation, and database operations.
 */

import { supabase } from '@/lib/supabase';
import { policyTemplates, PolicyTemplate, getPoliciesByLicenceType } from '@/data/policy-templates';

// Types
export interface Policy {
  id: string;
  application_id: string;
  policy_module_id?: string;
  name: string;
  content: string;
  version: number;
  status: 'draft' | 'generating' | 'review_pending' | 'approved' | 'rejected' | 'final';
  approved_by?: string;
  approved_at?: string;
  created_at: string;
  updated_at: string;
  metadata?: Record<string, unknown>;
}

export interface PolicyModule {
  id: string;
  name: string;
  description?: string;
  risk_domain: string;
  is_reusable: boolean;
  licence_types: string[];
  version: number;
  created_at: string;
  updated_at: string;
}

export interface GeneratePolicyRequest {
  applicationId: string;
  policyTemplateId: string;
  companyName: string;
  licenceType: string;
  customFields?: Record<string, string>;
}

export interface PolicyGenerationResult {
  success: boolean;
  policy?: Policy;
  error?: string;
}

// Policy Template Service
export const policyTemplateService = {
  /**
   * Get all policy templates
   */
  getAll(): PolicyTemplate[] {
    return policyTemplates;
  },

  /**
   * Get policy template by ID
   */
  getById(id: string): PolicyTemplate | undefined {
    return policyTemplates.find(p => p.id === id);
  },

  /**
   * Get policies required for a specific licence type
   */
  getForLicenceType(licenceType: string): PolicyTemplate[] {
    return getPoliciesByLicenceType(licenceType);
  },

  /**
   * Get policy template content (placeholder - would read from file in production)
   */
  async getTemplateContent(templateId: string): Promise<string | null> {
    const template = policyTemplates.find(p => p.id === templateId);
    if (!template) return null;

    // In production, this would read and parse the DOCX file
    // For now, return a placeholder indicating the template exists
    return `[Template: ${template.name}]\n\nThis policy template will be parsed from: ${template.filename}`;
  },
};

// Database Policy Service
export const policyService = {
  /**
   * Get all policies for an application
   */
  async getByApplicationId(applicationId: string): Promise<Policy[]> {
    const { data, error } = await supabase
      .from('policies')
      .select('*')
      .eq('application_id', applicationId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching policies:', error);
      return [];
    }

    return data || [];
  },

  /**
   * Get a single policy by ID
   */
  async getById(id: string): Promise<Policy | null> {
    const { data, error } = await supabase
      .from('policies')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error('Error fetching policy:', error);
      return null;
    }

    return data;
  },

  /**
   * Create a new policy
   */
  async create(policy: Partial<Policy>): Promise<Policy | null> {
    const { data, error } = await supabase
      .from('policies')
      .insert([{
        ...policy,
        version: 1,
        status: 'draft',
      }])
      .select()
      .single();

    if (error) {
      console.error('Error creating policy:', error);
      return null;
    }

    return data;
  },

  /**
   * Update a policy
   */
  async update(id: string, updates: Partial<Policy>): Promise<Policy | null> {
    const { data, error } = await supabase
      .from('policies')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating policy:', error);
      return null;
    }

    return data;
  },

  /**
   * Delete a policy
   */
  async delete(id: string): Promise<boolean> {
    const { error } = await supabase
      .from('policies')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting policy:', error);
      return false;
    }

    return true;
  },

  /**
   * Approve a policy
   */
  async approve(id: string, userId: string): Promise<Policy | null> {
    return this.update(id, {
      status: 'approved',
      approved_by: userId,
      approved_at: new Date().toISOString(),
    });
  },

  /**
   * Reject a policy
   */
  async reject(id: string): Promise<Policy | null> {
    return this.update(id, {
      status: 'rejected',
    });
  },

  /**
   * Finalize a policy
   */
  async finalize(id: string): Promise<Policy | null> {
    return this.update(id, {
      status: 'final',
    });
  },
};

// Policy Module Service (for reusable policy building blocks)
export const policyModuleService = {
  /**
   * Get all policy modules
   */
  async getAll(): Promise<PolicyModule[]> {
    const { data, error } = await supabase
      .from('policy_modules')
      .select('*')
      .order('name');

    if (error) {
      console.error('Error fetching policy modules:', error);
      return [];
    }

    return data || [];
  },

  /**
   * Get policy modules by licence type
   */
  async getByLicenceType(licenceType: string): Promise<PolicyModule[]> {
    const { data, error } = await supabase
      .from('policy_modules')
      .select('*')
      .contains('licence_types', [licenceType])
      .order('name');

    if (error) {
      console.error('Error fetching policy modules:', error);
      return [];
    }

    return data || [];
  },

  /**
   * Get a single policy module with its sections
   */
  async getWithSections(id: string): Promise<PolicyModule & { sections: unknown[] } | null> {
    const { data, error } = await supabase
      .from('policy_modules')
      .select(`
        *,
        policy_module_sections (*)
      `)
      .eq('id', id)
      .single();

    if (error) {
      console.error('Error fetching policy module:', error);
      return null;
    }

    return data;
  },
};

// Policy Generation Service
export const policyGenerationService = {
  /**
   * Generate a policy from a template
   * This is a placeholder - in production, this would call an AI service
   */
  async generateFromTemplate(request: GeneratePolicyRequest): Promise<PolicyGenerationResult> {
    try {
      const template = policyTemplateService.getById(request.policyTemplateId);
      if (!template) {
        return { success: false, error: 'Template not found' };
      }

      // Create a draft policy with placeholder content
      // In production, this would call the AI service to generate content
      const content = await this.createPolicyContent(template, request);

      const policy = await policyService.create({
        application_id: request.applicationId,
        name: template.name,
        content,
        metadata: {
          templateId: template.id,
          licenceType: request.licenceType,
          companyName: request.companyName,
          customFields: request.customFields,
        },
      });

      if (!policy) {
        return { success: false, error: 'Failed to create policy' };
      }

      return { success: true, policy };
    } catch (error) {
      console.error('Error generating policy:', error);
      return { success: false, error: 'Policy generation failed' };
    }
  },

  /**
   * Create policy content from template
   * Placeholder - would use AI in production
   */
  async createPolicyContent(
    template: PolicyTemplate,
    request: GeneratePolicyRequest
  ): Promise<string> {
    const { companyName, licenceType, customFields } = request;

    // This is a placeholder - in production, AI would customize the template
    return `
# ${template.name}

**Company:** ${companyName}
**Licence Type:** ${licenceType}
**Version:** 1.0
**Date:** ${new Date().toLocaleDateString('en-GB')}

---

## 1. Purpose

This ${template.name.toLowerCase()} has been prepared for ${companyName} as part of the FCA ${licenceType} authorisation application.

## 2. Scope

This policy applies to all employees, directors, and agents of ${companyName}.

## 3. Regulatory Framework

This policy addresses the requirements set out in:
${template.fcaReference.map(ref => `- ${ref}`).join('\n')}

## 4. Policy Content

[Content to be generated from template: ${template.filename}]

${customFields ? `
## 5. Custom Provisions

${Object.entries(customFields).map(([key, value]) => `**${key}:** ${value}`).join('\n')}
` : ''}

---

**Document Control**
- Status: Draft
- Review Date: ${new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toLocaleDateString('en-GB')}
- Owner: Compliance Officer
    `.trim();
  },

  /**
   * Generate all required policies for an application
   */
  async generateAllForApplication(
    applicationId: string,
    companyName: string,
    licenceType: string
  ): Promise<{ generated: number; failed: number; errors: string[] }> {
    const templates = policyTemplateService.getForLicenceType(licenceType);
    const results = { generated: 0, failed: 0, errors: [] as string[] };

    for (const template of templates) {
      const result = await this.generateFromTemplate({
        applicationId,
        policyTemplateId: template.id,
        companyName,
        licenceType,
      });

      if (result.success) {
        results.generated++;
      } else {
        results.failed++;
        results.errors.push(`${template.name}: ${result.error}`);
      }
    }

    return results;
  },
};

export default {
  templates: policyTemplateService,
  policies: policyService,
  modules: policyModuleService,
  generation: policyGenerationService,
};
