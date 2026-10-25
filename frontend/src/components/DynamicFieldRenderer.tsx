'use client';

import React from 'react';
import { HelpCircle, Check, Upload, Calendar, Hash, Type, ToggleLeft, ToggleRight, List, Layers } from 'lucide-react';

export interface FieldDefinition {
  key: string;
  label_bn: string;
  label_en: string;
  type: 'text' | 'textarea' | 'number' | 'select' | 'multiselect' | 'boolean' | 'date' | 'file';
  options?: string[];
  unit?: string;
  required: boolean;
  filterable: boolean;
  searchable?: boolean;
  show_on_card?: boolean;
  show_in_detail?: boolean;
  help_text_bn?: string;
  help_text_en?: string;
}

interface DynamicFieldRendererProps {
  fields: FieldDefinition[];
  values: Record<string, any>;
  onChange: (key: string, value: any) => void;
  lang?: 'bn' | 'en';
  readOnly?: boolean;
}

export function DynamicFieldRenderer({
  fields,
  values,
  onChange,
  lang = 'bn',
  readOnly = false,
}: DynamicFieldRendererProps) {
  if (!fields || fields.length === 0) return null;

  const handleMultiselectToggle = (key: string, option: string) => {
    if (readOnly) return;
    const currentList: string[] = Array.isArray(values[key]) ? values[key] : [];
    if (currentList.includes(option)) {
      onChange(key, currentList.filter((item) => item !== option));
    } else {
      onChange(key, [...currentList, option]);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {fields.map((field) => {
        const label = lang === 'bn' ? field.label_bn : field.label_en;
        const helpText = lang === 'bn' ? field.help_text_bn : field.help_text_en;
        const curValue = values[field.key] !== undefined ? values[field.key] : '';

        return (
          <div
            key={field.key}
            className={`space-y-1.5 p-3.5 rounded-2xl border transition-all text-slate-900 ${
              field.type === 'textarea' || field.type === 'multiselect' ? 'md:col-span-2' : ''
            } ${
              field.required
                ? 'bg-amber-50/40 border-amber-200'
                : 'bg-white border-slate-200 shadow-sm hover:border-slate-300'
            }`}
          >
            {/* Header: Label, Required badge, Unit, Help tooltip */}
            <div className="flex items-center justify-between text-xs">
              <label className="font-bold text-slate-900 flex items-center gap-1.5">
                <span>{label}</span>
                {field.required && (
                  <span className="text-[10px] text-rose-600 bg-rose-50 px-1.5 py-0.5 rounded font-bold border border-rose-100">
                    Required
                  </span>
                )}
                {field.filterable && (
                  <span className="text-[10px] text-blue-700 bg-blue-50 px-1.5 py-0.5 rounded font-bold border border-blue-100">
                    Filterable
                  </span>
                )}
              </label>

              {field.unit && (
                <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full border border-slate-200">
                  Unit: {field.unit}
                </span>
              )}
            </div>

            {/* Field Types */}
            {field.type === 'text' && (
              <div className="relative">
                <input
                  type="text"
                  disabled={readOnly}
                  value={curValue}
                  onChange={(e) => onChange(field.key, e.target.value)}
                  placeholder={helpText || `Enter ${label}...`}
                  className="w-full text-xs font-semibold px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white text-slate-950 placeholder:text-slate-400 placeholder:font-normal focus:bg-white focus:text-slate-950 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 outline-none transition shadow-sm"
                />
              </div>
            )}

            {field.type === 'number' && (
              <div className="relative flex items-center">
                <input
                  type="number"
                  disabled={readOnly}
                  value={curValue}
                  onChange={(e) => onChange(field.key, e.target.value === '' ? '' : Number(e.target.value))}
                  placeholder="0"
                  className="w-full text-xs font-bold px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white text-slate-950 placeholder:text-slate-400 placeholder:font-normal focus:bg-white focus:text-slate-950 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 outline-none transition shadow-sm"
                />
                {field.unit && (
                  <span className="absolute right-3 text-xs font-bold text-slate-600 select-none">
                    {field.unit}
                  </span>
                )}
              </div>
            )}

            {field.type === 'textarea' && (
              <textarea
                rows={3}
                disabled={readOnly}
                value={curValue}
                onChange={(e) => onChange(field.key, e.target.value)}
                placeholder={helpText || `Enter detailed ${label}...`}
                className="w-full text-xs font-semibold p-3 rounded-xl border border-slate-300 bg-white text-slate-950 placeholder:text-slate-400 placeholder:font-normal focus:bg-white focus:text-slate-950 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 outline-none transition shadow-sm"
              />
            )}

            {field.type === 'select' && (
              <select
                disabled={readOnly}
                value={curValue}
                onChange={(e) => onChange(field.key, e.target.value)}
                className="w-full text-xs font-bold px-3 py-2.5 rounded-xl border border-slate-300 bg-white text-slate-950 focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 outline-none transition shadow-sm"
              >
                <option value="" className="text-slate-500 font-normal">-- Select {label} --</option>
                {(field.options || []).map((opt) => (
                  <option key={opt} value={opt} className="text-slate-950 font-bold bg-white">
                    {opt}
                  </option>
                ))}
              </select>
            )}

            {field.type === 'multiselect' && (
              <div className="space-y-1.5 pt-1">
                <div className="flex flex-wrap gap-1.5">
                  {(field.options || []).map((opt) => {
                    const isSelected = Array.isArray(curValue) && curValue.includes(opt);
                    return (
                      <button
                        key={opt}
                        type="button"
                        onClick={() => handleMultiselectToggle(field.key, opt)}
                        className={`text-xs px-3 py-1.5 rounded-xl font-bold border transition flex items-center gap-1.5 ${
                          isSelected
                            ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm shadow-indigo-600/30'
                            : 'bg-slate-50 hover:bg-slate-100 text-slate-800 border-slate-200'
                        }`}
                      >
                        {isSelected && <Check className="w-3 h-3" />}
                        <span>{opt}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {field.type === 'boolean' && (
              <div className="flex items-center justify-between pt-1">
                <span className="text-xs text-slate-700 font-semibold">
                  {curValue ? 'Yes (Enabled/Active)' : 'No (Inactive)'}
                </span>
                <button
                  type="button"
                  disabled={readOnly}
                  onClick={() => onChange(field.key, !curValue)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                    curValue
                      ? 'bg-emerald-600 text-white shadow-sm shadow-emerald-600/30'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  {curValue ? (
                    <>
                      <ToggleRight className="w-4 h-4" />
                      <span>Yes</span>
                    </>
                  ) : (
                    <>
                      <ToggleLeft className="w-4 h-4 text-slate-500" />
                      <span>No</span>
                    </>
                  )}
                </button>
              </div>
            )}

            {field.type === 'date' && (
              <div className="relative">
                <input
                  type="date"
                  disabled={readOnly}
                  value={curValue}
                  onChange={(e) => onChange(field.key, e.target.value)}
                  className="w-full text-xs font-bold px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white text-slate-950 focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 outline-none transition shadow-sm"
                />
              </div>
            )}

            {field.type === 'file' && (
              <div className="space-y-1 pt-1">
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    disabled={readOnly}
                    value={curValue}
                    onChange={(e) => onChange(field.key, e.target.value)}
                    placeholder="Enter file URL or upload..."
                    className="flex-1 text-xs px-3 py-2 rounded-xl border border-slate-300 bg-white text-slate-950 placeholder:text-slate-400 outline-none font-semibold shadow-sm"
                  />
                  <label className="cursor-pointer px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold flex items-center gap-1 border border-slate-200">
                    <Upload className="w-3.5 h-3.5" />
                    <span>Upload</span>
                    <input
                      type="file"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          onChange(field.key, `/storage/uploads/${file.name}`);
                        }
                      }}
                    />
                  </label>
                </div>
              </div>
            )}

            {/* Helper Text */}
            {helpText && (
              <p className="text-[11px] text-slate-600 font-medium flex items-center gap-1 pt-0.5">
                <HelpCircle className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span>{helpText}</span>
              </p>
            )}
          </div>
        );
      })}
    </div>
  );
}

// Display specifications table for Storefront Product Details
export function SpecificationsTable({
  customAttributes,
  fields,
  lang = 'en',
}: {
  customAttributes: Record<string, any>;
  fields?: FieldDefinition[];
  lang?: 'bn' | 'en';
}) {
  if (!customAttributes || Object.keys(customAttributes).length === 0) return null;

  // Build key-label mapping if fields are provided
  const fieldMap: Record<string, FieldDefinition> = {};
  if (fields && Array.isArray(fields)) {
    fields.forEach((f) => {
      fieldMap[f.key] = f;
    });
  }

  const entries = Object.entries(customAttributes).filter(([_, val]) => {
    return val !== undefined && val !== null && val !== '' && !(Array.isArray(val) && val.length === 0);
  });

  if (entries.length === 0) return null;

  return (
    <div className="rounded-2xl border border-slate-200/90 overflow-hidden shadow-sm bg-white divide-y divide-slate-100">
      <div className="bg-slate-900 text-white px-4 py-2.5 text-xs font-bold flex items-center gap-2">
        <Layers className="w-3.5 h-3.5 text-indigo-400" />
        <span>Detailed Specifications & Features</span>
      </div>

      <div className="divide-y divide-slate-100 text-xs">
        {entries.map(([key, val], idx) => {
          const fieldDef = fieldMap[key];
          const label = fieldDef ? (lang === 'bn' ? fieldDef.label_bn : fieldDef.label_en) : key.replace(/_/g, ' ');
          const unit = fieldDef?.unit ? ` ${fieldDef.unit}` : '';

          let displayVal = '';
          if (typeof val === 'boolean') {
            displayVal = val ? 'Yes (Included)' : 'No';
          } else if (Array.isArray(val)) {
            displayVal = val.join(', ');
          } else {
            displayVal = `${val}${unit}`;
          }

          return (
            <div
              key={key}
              className={`grid grid-cols-2 sm:grid-cols-3 px-4 py-3 transition hover:bg-slate-50/80 ${
                idx % 2 === 0 ? 'bg-white' : 'bg-slate-50/40'
              }`}
            >
              <span className="font-semibold text-slate-500 sm:col-span-1">{label}</span>
              <span className="font-bold text-slate-900 sm:col-span-2 text-right sm:text-left">
                {displayVal}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
