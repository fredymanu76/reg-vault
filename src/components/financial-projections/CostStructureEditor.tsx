// REG-VAULT Cost Structure Editor
// Define fixed and variable costs by category

import { useState } from 'react';
import { useFinancialStore } from '@/lib/stores/financialStore';
import { useJourneyStore } from '@/lib/stores/journeyStore';
import { CostItem, CostCategory } from '@/types/journey';
import { COST_TEMPLATES, getCostTemplatesForLicence, generateIdForItems } from '@/data/financial-templates';
import { Plus, Trash2, Edit2, Save, X, FileDown, Receipt } from 'lucide-react';

const CATEGORY_LABELS: Record<CostCategory, string> = {
  staff: 'Staff Costs',
  technology: 'Technology',
  compliance: 'Compliance',
  professional_fees: 'Professional Fees',
  premises: 'Premises',
  marketing: 'Marketing',
  insurance: 'Insurance',
  other: 'Other',
};

const CATEGORY_COLORS: Record<CostCategory, string> = {
  staff: 'bg-blue-500/20 text-blue-400',
  technology: 'bg-purple-500/20 text-purple-400',
  compliance: 'bg-amber-500/20 text-amber-400',
  professional_fees: 'bg-emerald-500/20 text-emerald-400',
  premises: 'bg-rose-500/20 text-rose-400',
  marketing: 'bg-cyan-500/20 text-cyan-400',
  insurance: 'bg-indigo-500/20 text-indigo-400',
  other: 'bg-gray-500/20 text-gray-400',
};

export function CostStructureEditor() {
  const financialStore = useFinancialStore();
  const journeyStore = useJourneyStore();

  const costs = financialStore.getCosts();
  const costsByCategory = financialStore.getCostsByCategory();
  const licenceType = journeyStore.getJourneyData().licenceType;

  const [editingId, setEditingId] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<CostCategory | 'all'>('all');
  const [newCost, setNewCost] = useState<Partial<CostItem>>({
    name: '',
    category: 'staff',
    type: 'fixed',
    amount: 0,
    frequency: 'monthly',
  });

  const handleAddCost = () => {
    if (!newCost.name || newCost.amount === undefined) return;

    financialStore.addCost(newCost as Omit<CostItem, 'id'>);
    setNewCost({
      name: '',
      category: 'staff',
      type: 'fixed',
      amount: 0,
      frequency: 'monthly',
    });
    setShowAddForm(false);
  };

  const handleUpdateCost = (id: string, updates: Partial<CostItem>) => {
    financialStore.updateCost(id, updates);
    setEditingId(null);
  };

  const handleDeleteCost = (id: string) => {
    if (window.confirm('Delete this cost item?')) {
      financialStore.removeCost(id);
    }
  };

  const handleLoadTemplate = (template: typeof COST_TEMPLATES[number]) => {
    const costsWithIds = generateIdForItems(template.costs);
    costsWithIds.forEach((cost) => {
      financialStore.addCost(cost);
    });
  };

  const availableTemplates = licenceType
    ? getCostTemplatesForLicence(licenceType)
    : COST_TEMPLATES;

  // Calculate totals
  const totalAnnualCosts = costs.reduce((sum, cost) => {
    let annual = cost.amount;
    if (cost.frequency === 'monthly') annual *= 12;
    return sum + annual;
  }, 0);

  const filteredCosts = selectedCategory === 'all'
    ? costs
    : costs.filter((c) => c.category === selectedCategory);

  return (
    <div className="space-y-6">
      {/* Templates */}
      <div>
        <h4 className="text-sm font-medium text-photon-white mb-3">Cost Structure Templates</h4>
        <div className="flex flex-wrap gap-2">
          {availableTemplates.map((template) => (
            <button
              key={template.name}
              onClick={() => handleLoadTemplate(template)}
              className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/5 text-mist-gray
                hover:bg-white/10 hover:text-photon-white transition-colors text-sm"
            >
              <FileDown size={14} />
              {template.name}
            </button>
          ))}
        </div>
      </div>

      {/* Category Filter */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setSelectedCategory('all')}
          className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${
            selectedCategory === 'all'
              ? 'bg-pellucid-cyan/20 text-pellucid-cyan'
              : 'bg-white/5 text-mist-gray hover:bg-white/10'
          }`}
        >
          All ({costs.length})
        </button>
        {(Object.keys(CATEGORY_LABELS) as CostCategory[]).map((category) => {
          const count = costsByCategory[category].length;
          if (count === 0) return null;
          return (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${
                selectedCategory === category
                  ? CATEGORY_COLORS[category]
                  : 'bg-white/5 text-mist-gray hover:bg-white/10'
              }`}
            >
              {CATEGORY_LABELS[category]} ({count})
            </button>
          );
        })}
      </div>

      {/* Costs List */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-sm font-medium text-photon-white">
            Cost Items ({filteredCosts.length})
          </h4>
          <button
            onClick={() => setShowAddForm(true)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-pellucid-cyan/20 text-pellucid-cyan
              hover:bg-pellucid-cyan/30 transition-colors text-sm"
          >
            <Plus size={14} />
            Add Cost
          </button>
        </div>

        {filteredCosts.length === 0 ? (
          <div className="text-center py-8 bg-white/5 rounded-lg">
            <Receipt size={32} className="mx-auto text-mist-gray mb-3" />
            <p className="text-mist-gray">No costs defined</p>
            <p className="text-xs text-mist-gray mt-1">Add costs or load a template above</p>
          </div>
        ) : (
          <div className="space-y-2">
            {filteredCosts.map((cost) => (
              <CostItemCard
                key={cost.id}
                cost={cost}
                isEditing={editingId === cost.id}
                onEdit={() => setEditingId(cost.id)}
                onSave={(updates) => handleUpdateCost(cost.id, updates)}
                onCancel={() => setEditingId(null)}
                onDelete={() => handleDeleteCost(cost.id)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Add Form */}
      {showAddForm && (
        <div className="bg-white/5 border border-white/10 rounded-lg p-4">
          <h4 className="text-sm font-medium text-photon-white mb-4">Add Cost Item</h4>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-mist-gray mb-1">Name</label>
              <input
                type="text"
                value={newCost.name}
                onChange={(e) => setNewCost({ ...newCost, name: e.target.value })}
                className="w-full bg-white/5 border border-white/10 rounded px-3 py-2 text-photon-white text-sm
                  focus:outline-none focus:ring-1 focus:ring-pellucid-cyan/50"
                placeholder="e.g., Compliance Officer"
              />
            </div>
            <div>
              <label className="block text-xs text-mist-gray mb-1">Category</label>
              <select
                value={newCost.category}
                onChange={(e) => setNewCost({ ...newCost, category: e.target.value as CostCategory })}
                className="w-full bg-white/5 border border-white/10 rounded px-3 py-2 text-photon-white text-sm
                  focus:outline-none focus:ring-1 focus:ring-pellucid-cyan/50"
              >
                {(Object.keys(CATEGORY_LABELS) as CostCategory[]).map((cat) => (
                  <option key={cat} value={cat}>{CATEGORY_LABELS[cat]}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs text-mist-gray mb-1">Type</label>
              <select
                value={newCost.type}
                onChange={(e) => setNewCost({ ...newCost, type: e.target.value as 'fixed' | 'variable' })}
                className="w-full bg-white/5 border border-white/10 rounded px-3 py-2 text-photon-white text-sm
                  focus:outline-none focus:ring-1 focus:ring-pellucid-cyan/50"
              >
                <option value="fixed">Fixed</option>
                <option value="variable">Variable (% of revenue)</option>
              </select>
            </div>
            <div>
              <label className="block text-xs text-mist-gray mb-1">
                {newCost.type === 'variable' ? 'Percentage' : 'Amount (£)'}
              </label>
              <input
                type="number"
                value={newCost.type === 'variable' ? newCost.variableRate || 0 : newCost.amount}
                onChange={(e) =>
                  newCost.type === 'variable'
                    ? setNewCost({ ...newCost, variableRate: Number(e.target.value) })
                    : setNewCost({ ...newCost, amount: Number(e.target.value) })
                }
                className="w-full bg-white/5 border border-white/10 rounded px-3 py-2 text-photon-white text-sm
                  focus:outline-none focus:ring-1 focus:ring-pellucid-cyan/50"
              />
            </div>
            {newCost.type === 'fixed' && (
              <div>
                <label className="block text-xs text-mist-gray mb-1">Frequency</label>
                <select
                  value={newCost.frequency}
                  onChange={(e) => setNewCost({ ...newCost, frequency: e.target.value as CostItem['frequency'] })}
                  className="w-full bg-white/5 border border-white/10 rounded px-3 py-2 text-photon-white text-sm
                    focus:outline-none focus:ring-1 focus:ring-pellucid-cyan/50"
                >
                  <option value="monthly">Monthly</option>
                  <option value="annual">Annual</option>
                  <option value="one_time">One-time</option>
                </select>
              </div>
            )}
          </div>
          <div className="flex justify-end gap-2 mt-4">
            <button
              onClick={() => setShowAddForm(false)}
              className="px-3 py-1.5 rounded text-mist-gray hover:text-photon-white transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleAddCost}
              disabled={!newCost.name}
              className="px-4 py-1.5 rounded bg-pellucid-cyan text-void-black font-medium
                hover:bg-pellucid-cyan/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Add Cost
            </button>
          </div>
        </div>
      )}

      {/* Summary by Category */}
      {costs.length > 0 && (
        <div className="bg-white/5 border border-white/10 rounded-lg p-4">
          <h4 className="text-sm font-medium text-photon-white mb-4">Annual Cost Summary</h4>
          <div className="space-y-2">
            {(Object.keys(CATEGORY_LABELS) as CostCategory[]).map((category) => {
              const categoryTotal = costsByCategory[category].reduce((sum, cost) => {
                let annual = cost.amount;
                if (cost.frequency === 'monthly') annual *= 12;
                return sum + annual;
              }, 0);

              if (categoryTotal === 0) return null;

              const percentage = (categoryTotal / totalAnnualCosts) * 100;

              return (
                <div key={category} className="flex items-center gap-3">
                  <span className="w-32 text-sm text-mist-gray">{CATEGORY_LABELS[category]}</span>
                  <div className="flex-1 h-2 bg-white/10 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${CATEGORY_COLORS[category].split(' ')[0]}`}
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                  <span className="w-24 text-sm text-photon-white text-right">
                    £{categoryTotal.toLocaleString()}
                  </span>
                </div>
              );
            })}
            <div className="pt-2 border-t border-white/10 flex items-center justify-between">
              <span className="text-sm font-medium text-photon-white">Total Annual Costs</span>
              <span className="text-lg font-bold text-photon-white">
                £{totalAnnualCosts.toLocaleString()}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Cost Item Card Component
interface CostItemCardProps {
  cost: CostItem;
  isEditing: boolean;
  onEdit: () => void;
  onSave: (updates: Partial<CostItem>) => void;
  onCancel: () => void;
  onDelete: () => void;
}

function CostItemCard({ cost, isEditing, onEdit, onSave, onCancel, onDelete }: CostItemCardProps) {
  const [editedCost, setEditedCost] = useState(cost);

  const annualAmount = cost.type === 'variable'
    ? `${cost.variableRate}% of revenue`
    : cost.frequency === 'monthly'
    ? `£${(cost.amount * 12).toLocaleString()}/year`
    : `£${cost.amount.toLocaleString()}/${cost.frequency === 'annual' ? 'year' : 'once'}`;

  if (isEditing) {
    return (
      <div className="bg-white/10 border border-pellucid-cyan/30 rounded-lg p-3">
        <div className="grid md:grid-cols-3 gap-3 mb-3">
          <input
            type="text"
            value={editedCost.name}
            onChange={(e) => setEditedCost({ ...editedCost, name: e.target.value })}
            className="bg-white/5 border border-white/10 rounded px-2 py-1 text-photon-white text-sm"
          />
          <input
            type="number"
            value={editedCost.amount}
            onChange={(e) => setEditedCost({ ...editedCost, amount: Number(e.target.value) })}
            className="bg-white/5 border border-white/10 rounded px-2 py-1 text-photon-white text-sm"
          />
          <select
            value={editedCost.frequency}
            onChange={(e) => setEditedCost({ ...editedCost, frequency: e.target.value as CostItem['frequency'] })}
            className="bg-white/5 border border-white/10 rounded px-2 py-1 text-photon-white text-sm"
          >
            <option value="monthly">Monthly</option>
            <option value="annual">Annual</option>
            <option value="one_time">One-time</option>
          </select>
        </div>
        <div className="flex justify-end gap-2">
          <button onClick={onCancel} className="p-1 text-mist-gray hover:text-photon-white">
            <X size={14} />
          </button>
          <button
            onClick={() => onSave(editedCost)}
            className="flex items-center gap-1 px-2 py-1 bg-pellucid-cyan text-void-black rounded text-sm"
          >
            <Save size={12} />
            Save
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-between bg-white/5 border border-white/10 rounded-lg px-4 py-3
      hover:bg-white/10 transition-colors">
      <div className="flex items-center gap-3">
        <span className={`text-xs px-2 py-0.5 rounded ${CATEGORY_COLORS[cost.category]}`}>
          {CATEGORY_LABELS[cost.category]}
        </span>
        <span className="text-photon-white">{cost.name}</span>
      </div>
      <div className="flex items-center gap-3">
        <span className="text-sm text-mist-gray">{annualAmount}</span>
        <button onClick={onEdit} className="p-1 text-mist-gray hover:text-photon-white">
          <Edit2 size={14} />
        </button>
        <button onClick={onDelete} className="p-1 text-mist-gray hover:text-red-400">
          <Trash2 size={14} />
        </button>
      </div>
    </div>
  );
}
