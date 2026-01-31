// REG-VAULT Revenue Modeler
// Add and configure revenue streams with projections

import { useState } from 'react';
import { useFinancialStore } from '@/lib/stores/financialStore';
import { useJourneyStore } from '@/lib/stores/journeyStore';
import { RevenueStream } from '@/types/journey';
import { REVENUE_TEMPLATES, getRevenueTemplatesForLicence, generateIdForItems } from '@/data/financial-templates';
import { Plus, Trash2, Edit2, Save, X, FileDown, TrendingUp } from 'lucide-react';

export function RevenueModeler() {
  const financialStore = useFinancialStore();
  const journeyStore = useJourneyStore();

  const revenueStreams = financialStore.getRevenueStreams();
  const assumptions = financialStore.getAssumptions();
  const licenceType = journeyStore.getJourneyData().licenceType;

  const [editingId, setEditingId] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newStream, setNewStream] = useState<Partial<RevenueStream>>({
    name: '',
    type: 'transaction_fee',
    baseValue: 0,
    unit: 'per_transaction',
    volumeAssumptions: [],
    growthRate: 0.2,
  });

  const handleAddStream = () => {
    if (!newStream.name || newStream.baseValue === undefined) return;

    financialStore.addRevenueStream(newStream as Omit<RevenueStream, 'id'>);
    setNewStream({
      name: '',
      type: 'transaction_fee',
      baseValue: 0,
      unit: 'per_transaction',
      volumeAssumptions: [],
      growthRate: 0.2,
    });
    setShowAddForm(false);
  };

  const handleUpdateStream = (id: string, updates: Partial<RevenueStream>) => {
    financialStore.updateRevenueStream(id, updates);
    setEditingId(null);
  };

  const handleDeleteStream = (id: string) => {
    if (window.confirm('Delete this revenue stream?')) {
      financialStore.removeRevenueStream(id);
    }
  };

  const handleLoadTemplate = (template: typeof REVENUE_TEMPLATES[number]) => {
    const streamsWithIds = generateIdForItems(template.streams);
    streamsWithIds.forEach((stream) => {
      financialStore.addRevenueStream(stream);
    });
  };

  const availableTemplates = licenceType
    ? getRevenueTemplatesForLicence(licenceType)
    : REVENUE_TEMPLATES;

  // Calculate total projected revenue
  const totalYearOneRevenue = revenueStreams.reduce((sum, stream) => {
    let amount = stream.baseValue;
    if (stream.unit === 'per_transaction' && stream.volumeAssumptions[0]) {
      amount = stream.baseValue * stream.volumeAssumptions[0];
    } else if (stream.unit === 'monthly') {
      amount = stream.baseValue * 12;
    }
    return sum + amount;
  }, 0);

  return (
    <div className="space-y-6">
      {/* Templates */}
      <div>
        <h4 className="text-sm font-medium text-photon-white mb-3">Quick Start Templates</h4>
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

      {/* Revenue Streams List */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-sm font-medium text-photon-white">
            Revenue Streams ({revenueStreams.length})
          </h4>
          <button
            onClick={() => setShowAddForm(true)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-pellucid-cyan/20 text-pellucid-cyan
              hover:bg-pellucid-cyan/30 transition-colors text-sm"
          >
            <Plus size={14} />
            Add Stream
          </button>
        </div>

        {revenueStreams.length === 0 ? (
          <div className="text-center py-8 bg-white/5 rounded-lg">
            <TrendingUp size={32} className="mx-auto text-mist-gray mb-3" />
            <p className="text-mist-gray">No revenue streams yet</p>
            <p className="text-xs text-mist-gray mt-1">Add a stream or load a template above</p>
          </div>
        ) : (
          <div className="space-y-3">
            {revenueStreams.map((stream) => (
              <RevenueStreamCard
                key={stream.id}
                stream={stream}
                isEditing={editingId === stream.id}
                projectionYears={assumptions.projectionYears}
                onEdit={() => setEditingId(stream.id)}
                onSave={(updates) => handleUpdateStream(stream.id, updates)}
                onCancel={() => setEditingId(null)}
                onDelete={() => handleDeleteStream(stream.id)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Add Form */}
      {showAddForm && (
        <div className="bg-white/5 border border-white/10 rounded-lg p-4">
          <h4 className="text-sm font-medium text-photon-white mb-4">Add Revenue Stream</h4>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-mist-gray mb-1">Name</label>
              <input
                type="text"
                value={newStream.name}
                onChange={(e) => setNewStream({ ...newStream, name: e.target.value })}
                className="w-full bg-white/5 border border-white/10 rounded px-3 py-2 text-photon-white text-sm
                  focus:outline-none focus:ring-1 focus:ring-pellucid-cyan/50"
                placeholder="e.g., Transaction Fees"
              />
            </div>
            <div>
              <label className="block text-xs text-mist-gray mb-1">Type</label>
              <select
                value={newStream.type}
                onChange={(e) => setNewStream({ ...newStream, type: e.target.value as RevenueStream['type'] })}
                className="w-full bg-white/5 border border-white/10 rounded px-3 py-2 text-photon-white text-sm
                  focus:outline-none focus:ring-1 focus:ring-pellucid-cyan/50"
              >
                <option value="transaction_fee">Transaction Fee</option>
                <option value="subscription">Subscription</option>
                <option value="fx_margin">FX Margin</option>
                <option value="interest">Interest</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div>
              <label className="block text-xs text-mist-gray mb-1">Base Value</label>
              <input
                type="number"
                step={0.01}
                value={newStream.baseValue}
                onChange={(e) => setNewStream({ ...newStream, baseValue: Number(e.target.value) })}
                className="w-full bg-white/5 border border-white/10 rounded px-3 py-2 text-photon-white text-sm
                  focus:outline-none focus:ring-1 focus:ring-pellucid-cyan/50"
              />
            </div>
            <div>
              <label className="block text-xs text-mist-gray mb-1">Unit</label>
              <select
                value={newStream.unit}
                onChange={(e) => setNewStream({ ...newStream, unit: e.target.value as RevenueStream['unit'] })}
                className="w-full bg-white/5 border border-white/10 rounded px-3 py-2 text-photon-white text-sm
                  focus:outline-none focus:ring-1 focus:ring-pellucid-cyan/50"
              >
                <option value="per_transaction">Per Transaction</option>
                <option value="monthly">Monthly</option>
                <option value="annual">Annual</option>
                <option value="percentage">Percentage</option>
              </select>
            </div>
          </div>
          <div className="flex justify-end gap-2 mt-4">
            <button
              onClick={() => setShowAddForm(false)}
              className="px-3 py-1.5 rounded text-mist-gray hover:text-photon-white transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleAddStream}
              disabled={!newStream.name}
              className="px-4 py-1.5 rounded bg-pellucid-cyan text-void-black font-medium
                hover:bg-pellucid-cyan/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Add Stream
            </button>
          </div>
        </div>
      )}

      {/* Summary */}
      {revenueStreams.length > 0 && (
        <div className="bg-deep-teal/10 border border-deep-teal/20 rounded-lg p-4">
          <h4 className="text-sm font-medium text-deep-teal mb-2">Year 1 Projected Revenue</h4>
          <p className="text-2xl font-bold text-photon-white">
            £{totalYearOneRevenue.toLocaleString()}
          </p>
          <p className="text-xs text-mist-gray mt-1">
            Based on {revenueStreams.length} revenue stream{revenueStreams.length !== 1 ? 's' : ''}
          </p>
        </div>
      )}
    </div>
  );
}

// Revenue Stream Card Component
interface RevenueStreamCardProps {
  stream: RevenueStream;
  isEditing: boolean;
  projectionYears: number;
  onEdit: () => void;
  onSave: (updates: Partial<RevenueStream>) => void;
  onCancel: () => void;
  onDelete: () => void;
}

function RevenueStreamCard({
  stream,
  isEditing,
  projectionYears,
  onEdit,
  onSave,
  onCancel,
  onDelete,
}: RevenueStreamCardProps) {
  const [editedStream, setEditedStream] = useState(stream);

  if (isEditing) {
    return (
      <div className="bg-white/10 border border-pellucid-cyan/30 rounded-lg p-4">
        <div className="grid md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-xs text-mist-gray mb-1">Name</label>
            <input
              type="text"
              value={editedStream.name}
              onChange={(e) => setEditedStream({ ...editedStream, name: e.target.value })}
              className="w-full bg-white/5 border border-white/10 rounded px-3 py-2 text-photon-white text-sm"
            />
          </div>
          <div>
            <label className="block text-xs text-mist-gray mb-1">Base Value</label>
            <input
              type="number"
              value={editedStream.baseValue}
              onChange={(e) => setEditedStream({ ...editedStream, baseValue: Number(e.target.value) })}
              className="w-full bg-white/5 border border-white/10 rounded px-3 py-2 text-photon-white text-sm"
            />
          </div>
        </div>

        {/* Volume Assumptions */}
        <div className="mb-4">
          <label className="block text-xs text-mist-gray mb-2">
            Volume Assumptions (for transaction-based revenue)
          </label>
          <div className="grid grid-cols-3 md:grid-cols-5 gap-2">
            {Array.from({ length: projectionYears }, (_, i) => (
              <div key={i}>
                <span className="text-xs text-mist-gray">Year {i + 1}</span>
                <input
                  type="number"
                  value={editedStream.volumeAssumptions[i] || ''}
                  onChange={(e) => {
                    const newVolumes = [...(editedStream.volumeAssumptions || [])];
                    newVolumes[i] = Number(e.target.value);
                    setEditedStream({ ...editedStream, volumeAssumptions: newVolumes });
                  }}
                  className="w-full bg-white/5 border border-white/10 rounded px-2 py-1 text-photon-white text-sm"
                  placeholder="0"
                />
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-end gap-2">
          <button onClick={onCancel} className="px-3 py-1.5 text-mist-gray hover:text-photon-white">
            <X size={16} />
          </button>
          <button
            onClick={() => onSave(editedStream)}
            className="flex items-center gap-1 px-3 py-1.5 bg-pellucid-cyan text-void-black rounded"
          >
            <Save size={14} />
            Save
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white/5 border border-white/10 rounded-lg p-4 hover:bg-white/10 transition-colors">
      <div className="flex items-start justify-between">
        <div>
          <h5 className="font-medium text-photon-white">{stream.name}</h5>
          <p className="text-sm text-mist-gray">
            £{stream.baseValue.toLocaleString()} {stream.unit.replace('_', ' ')}
          </p>
        </div>
        <div className="flex items-center gap-1">
          <span className="text-xs px-2 py-0.5 rounded bg-white/10 text-mist-gray">
            {stream.type.replace('_', ' ')}
          </span>
          <button onClick={onEdit} className="p-1 text-mist-gray hover:text-photon-white">
            <Edit2 size={14} />
          </button>
          <button onClick={onDelete} className="p-1 text-mist-gray hover:text-red-400">
            <Trash2 size={14} />
          </button>
        </div>
      </div>
      {stream.volumeAssumptions.length > 0 && (
        <div className="mt-2 flex gap-2 text-xs">
          {stream.volumeAssumptions.map((vol, i) => (
            <span key={i} className="text-mist-gray">
              Y{i + 1}: {vol.toLocaleString()}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
