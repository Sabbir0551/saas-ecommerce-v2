'use client';

import React, { useState, useRef, useEffect } from 'react';
import {
  Bold,
  Italic,
  Strikethrough,
  List,
  ListOrdered,
  Quote,
  Minus,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  Link as LinkIcon,
  Unlink,
  Maximize2,
  Minimize2,
  Underline as UnderlineIcon,
  RotateCcw,
  RotateCw,
  RemoveFormatting,
  HelpCircle,
  Camera,
  Image as ImageIcon,
  Palette,
  Upload,
  X,
  FileCode,
  Type,
  ChevronDown,
} from 'lucide-react';

interface RichTextEditorProps {
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
  minHeight?: string;
  className?: string;
  label?: string;
}

export default function RichTextEditor({
  value,
  onChange,
  placeholder = 'Write detailed product specifications, highlights, warranty, and features...',
  minHeight = '180px',
  className = '',
  label,
}: RichTextEditorProps) {
  const [activeTab, setActiveTab] = useState<'visual' | 'text'>('visual');
  const [showRow2, setShowRow2] = useState<boolean>(true);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [showMediaModal, setShowMediaModal] = useState<boolean>(false);
  const [mediaUrlInput, setMediaUrlInput] = useState<string>('');
  const [showLinkModal, setShowLinkModal] = useState<boolean>(false);
  const [linkUrlInput, setLinkUrlInput] = useState<string>('');
  const [showColorPicker, setShowColorPicker] = useState<boolean>(false);
  const [showSpecialChars, setShowSpecialChars] = useState<boolean>(false);
  const [showHelpModal, setShowHelpModal] = useState<boolean>(false);
  const [selectedFormat, setSelectedFormat] = useState<string>('p');

  const editorRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const savedSelectionRef = useRef<Range | null>(null);

  // Sync value to visual editor when not focused or value changed externally
  useEffect(() => {
    if (editorRef.current && activeTab === 'visual') {
      if (editorRef.current.innerHTML !== (value || '')) {
        editorRef.current.innerHTML = value || '';
      }
    }
  }, [value, activeTab]);

  const saveSelection = () => {
    const sel = window.getSelection();
    if (sel && sel.rangeCount > 0) {
      savedSelectionRef.current = sel.getRangeAt(0).cloneRange();
    }
  };

  const restoreSelection = () => {
    const sel = window.getSelection();
    if (sel && savedSelectionRef.current) {
      sel.removeAllRanges();
      sel.addRange(savedSelectionRef.current);
    }
  };

  const executeCmd = (command: string, val: string | undefined = undefined) => {
    if (activeTab !== 'visual') return;
    if (editorRef.current) {
      editorRef.current.focus();
    }
    restoreSelection();
    document.execCommand(command, false, val);
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML);
    }
  };

  const handleVisualInput = () => {
    if (editorRef.current) {
      const html = editorRef.current.innerHTML;
      onChange(html === '<p><br></p>' || html === '<br>' ? '' : html);
    }
  };

  const handleFormatBlock = (tag: string) => {
    setSelectedFormat(tag);
    executeCmd('formatBlock', tag ? `<${tag}>` : '<p>');
  };

  // Media Insertion
  const handleInsertImage = (imgSrc: string) => {
    if (!imgSrc) return;
    executeCmd(
      'insertHTML',
      `<p><img src="${imgSrc}" alt="Product Image" style="max-width: 100%; height: auto; border-radius: 8px; margin: 8px 0;" /></p>`
    );
    setShowMediaModal(false);
    setMediaUrlInput('');
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (uploadEvent) => {
        const base64 = uploadEvent.target?.result as string;
        if (base64) {
          handleInsertImage(base64);
        }
      };
      reader.readAsDataURL(file);
    }
    if (e.target) e.target.value = '';
  };

  const handleInsertLink = () => {
    if (!linkUrlInput.trim()) return;
    executeCmd('createLink', linkUrlInput.trim());
    setShowLinkModal(false);
    setLinkUrlInput('');
  };

  const commonColors = [
    '#000000',
    '#333333',
    '#666666',
    '#e11d48',
    '#4f46e5',
    '#059669',
    '#d97706',
    '#dc2626',
    '#2563eb',
    '#7c3aed',
    '#0284c7',
  ];

  const specialCharacters = [
    '©', '®', '™', '°', '±', '×', '÷', '€', '£', '¥', '৳', '§', '¶', '•', '…', '–', '—', '“', '”', '‘', '’', '★', '✓', '⚡', '✔'
  ];

  return (
    <div
      className={`border border-slate-300 rounded-xl overflow-hidden bg-white shadow-xs transition-all ${
        isFullscreen
          ? 'fixed inset-4 z-50 shadow-2xl flex flex-col bg-white border-2 border-slate-800'
          : className
      }`}
    >
      {/* 1. TOP HEADER: Add Media button & Visual / Text Tab Switcher */}
      <div className="flex items-center justify-between px-3 py-2 bg-slate-100 border-b border-slate-200">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => {
              saveSelection();
              setShowMediaModal(true);
            }}
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold border border-slate-300 shadow-2xs transition"
          >
            <Camera className="w-3.5 h-3.5 text-slate-500" />
            <span className="font-sans">Add Media</span>
          </button>

          {label && (
            <span className="text-[11px] font-bold text-slate-500 hidden sm:inline ml-2">
              {label}
            </span>
          )}
        </div>

        {/* Visual & Text Tabs (WordPress Style) */}
        <div className="flex items-center">
          <button
            type="button"
            onClick={() => setActiveTab('visual')}
            className={`px-3 py-1 text-xs font-bold transition border-t border-l border-r rounded-t-md ${
              activeTab === 'visual'
                ? 'bg-white text-slate-900 border-slate-300 shadow-2xs font-extrabold relative -mb-2 pb-2 bg-gradient-to-b from-white to-slate-50'
                : 'text-slate-500 hover:text-slate-800 border-transparent bg-transparent'
            }`}
          >
            Visual
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('text')}
            className={`px-3 py-1 text-xs font-bold transition border-t border-l border-r rounded-t-md ml-1 ${
              activeTab === 'text'
                ? 'bg-white text-slate-900 border-slate-300 shadow-2xs font-extrabold relative -mb-2 pb-2 bg-gradient-to-b from-white to-slate-50'
                : 'text-slate-500 hover:text-slate-800 border-transparent bg-transparent'
            }`}
          >
            Text
          </button>
        </div>
      </div>

      {/* 2. TOOLBAR ROW 1 (Icons) */}
      {activeTab === 'visual' && (
        <div className="flex items-center flex-wrap gap-0.5 p-1.5 bg-slate-50 border-b border-slate-200 text-slate-700">
          <button
            type="button"
            onClick={() => executeCmd('bold')}
            className="p-1.5 rounded hover:bg-slate-200/80 text-slate-800 transition font-black text-xs"
            title="Bold (Ctrl+B)"
          >
            <Bold className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => executeCmd('italic')}
            className="p-1.5 rounded hover:bg-slate-200/80 text-slate-800 transition text-xs"
            title="Italic (Ctrl+I)"
          >
            <Italic className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => executeCmd('strikeThrough')}
            className="p-1.5 rounded hover:bg-slate-200/80 text-slate-800 transition text-xs"
            title="Strikethrough"
          >
            <Strikethrough className="w-4 h-4" />
          </button>

          <span className="w-px h-5 bg-slate-300 mx-1 self-center" />

          <button
            type="button"
            onClick={() => executeCmd('insertUnorderedList')}
            className="p-1.5 rounded hover:bg-slate-200/80 text-slate-800 transition"
            title="Bulleted list"
          >
            <List className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => executeCmd('insertOrderedList')}
            className="p-1.5 rounded hover:bg-slate-200/80 text-slate-800 transition"
            title="Numbered list"
          >
            <ListOrdered className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => executeCmd('formatBlock', '<blockquote>')}
            className="p-1.5 rounded hover:bg-slate-200/80 text-slate-800 transition"
            title="Blockquote"
          >
            <Quote className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => executeCmd('insertHorizontalRule')}
            className="p-1.5 rounded hover:bg-slate-200/80 text-slate-800 transition"
            title="Horizontal Line"
          >
            <Minus className="w-4 h-4" />
          </button>

          <span className="w-px h-5 bg-slate-300 mx-1 self-center" />

          <button
            type="button"
            onClick={() => executeCmd('justifyLeft')}
            className="p-1.5 rounded hover:bg-slate-200/80 text-slate-800 transition"
            title="Align Left"
          >
            <AlignLeft className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => executeCmd('justifyCenter')}
            className="p-1.5 rounded hover:bg-slate-200/80 text-slate-800 transition"
            title="Align Center"
          >
            <AlignCenter className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => executeCmd('justifyRight')}
            className="p-1.5 rounded hover:bg-slate-200/80 text-slate-800 transition"
            title="Align Right"
          >
            <AlignRight className="w-4 h-4" />
          </button>

          <span className="w-px h-5 bg-slate-300 mx-1 self-center" />

          <button
            type="button"
            onClick={() => {
              saveSelection();
              setShowLinkModal(true);
            }}
            className="p-1.5 rounded hover:bg-slate-200/80 text-slate-800 transition"
            title="Insert/edit link (Ctrl+K)"
          >
            <LinkIcon className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => executeCmd('unlink')}
            className="p-1.5 rounded hover:bg-slate-200/80 text-slate-800 transition"
            title="Remove link"
          >
            <Unlink className="w-4 h-4" />
          </button>

          <span className="w-px h-5 bg-slate-300 mx-1 self-center" />

          {/* Toolbar Toggle (Kitchen Sink) */}
          <button
            type="button"
            onClick={() => setShowRow2((prev) => !prev)}
            className={`p-1.5 rounded hover:bg-slate-200/80 text-slate-800 transition ${
              showRow2 ? 'bg-slate-200' : ''
            }`}
            title="Toolbar Toggle"
          >
            <ChevronDown className="w-4 h-4" />
          </button>

          {/* Fullscreen */}
          <button
            type="button"
            onClick={() => setIsFullscreen((prev) => !prev)}
            className="p-1.5 rounded hover:bg-slate-200/80 text-slate-800 transition ml-auto"
            title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
          >
            {isFullscreen ? (
              <Minimize2 className="w-4 h-4 text-rose-600" />
            ) : (
              <Maximize2 className="w-4 h-4" />
            )}
          </button>
        </div>
      )}

      {/* 3. TOOLBAR ROW 2 (Paragraph, Underline, Justify, Color, Special, Undo/Redo) */}
      {activeTab === 'visual' && showRow2 && (
        <div className="flex items-center flex-wrap gap-1 p-1.5 bg-slate-50/90 border-b border-slate-200 text-slate-700">
          {/* Format dropdown */}
          <select
            value={selectedFormat}
            onChange={(e) => handleFormatBlock(e.target.value)}
            className="px-2 py-1 rounded border border-slate-300 bg-white text-xs font-semibold text-slate-800 focus:outline-none focus:ring-1 focus:ring-slate-900"
          >
            <option value="p">Paragraph</option>
            <option value="h1">Heading 1</option>
            <option value="h2">Heading 2</option>
            <option value="h3">Heading 3</option>
            <option value="h4">Heading 4</option>
            <option value="h5">Heading 5</option>
            <option value="h6">Heading 6</option>
            <option value="pre">Preformatted</option>
          </select>

          <button
            type="button"
            onClick={() => executeCmd('underline')}
            className="p-1.5 rounded hover:bg-slate-200/80 text-slate-800 transition"
            title="Underline (Ctrl+U)"
          >
            <UnderlineIcon className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => executeCmd('justifyFull')}
            className="p-1.5 rounded hover:bg-slate-200/80 text-slate-800 transition"
            title="Justify"
          >
            <AlignJustify className="w-4 h-4" />
          </button>

          {/* Color picker popup */}
          <div className="relative">
            <button
              type="button"
              onClick={() => {
                saveSelection();
                setShowColorPicker((prev) => !prev);
              }}
              className="p-1.5 rounded hover:bg-slate-200/80 text-slate-800 transition flex items-center gap-0.5"
              title="Text Color"
            >
              <Palette className="w-4 h-4" />
            </button>
            {showColorPicker && (
              <div className="absolute top-full left-0 mt-1 p-2 bg-white rounded-lg shadow-xl border border-slate-200 z-50 flex items-center gap-1.5 flex-wrap w-44">
                {commonColors.map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => {
                      executeCmd('foreColor', c);
                      setShowColorPicker(false);
                    }}
                    style={{ backgroundColor: c }}
                    className="w-5 h-5 rounded-full border border-slate-300 hover:scale-110 transition shrink-0"
                    title={c}
                  />
                ))}
              </div>
            )}
          </div>

          <button
            type="button"
            onClick={() => executeCmd('removeFormat')}
            className="p-1.5 rounded hover:bg-slate-200/80 text-slate-800 transition"
            title="Clear Formatting"
          >
            <RemoveFormatting className="w-4 h-4" />
          </button>

          {/* Special character */}
          <div className="relative">
            <button
              type="button"
              onClick={() => {
                saveSelection();
                setShowSpecialChars((prev) => !prev);
              }}
              className="p-1.5 rounded hover:bg-slate-200/80 text-slate-800 transition font-bold text-xs"
              title="Special Character (Ω)"
            >
              Ω
            </button>
            {showSpecialChars && (
              <div className="absolute top-full left-0 mt-1 p-2 bg-white rounded-lg shadow-xl border border-slate-200 z-50 grid grid-cols-5 gap-1 w-48">
                {specialCharacters.map((char) => (
                  <button
                    key={char}
                    type="button"
                    onClick={() => {
                      executeCmd('insertText', char);
                      setShowSpecialChars(false);
                    }}
                    className="p-1 text-center font-bold text-xs hover:bg-slate-100 rounded text-slate-800"
                  >
                    {char}
                  </button>
                ))}
              </div>
            )}
          </div>

          <span className="w-px h-5 bg-slate-300 mx-1 self-center" />

          <button
            type="button"
            onClick={() => executeCmd('undo')}
            className="p-1.5 rounded hover:bg-slate-200/80 text-slate-800 transition"
            title="Undo (Ctrl+Z)"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => executeCmd('redo')}
            className="p-1.5 rounded hover:bg-slate-200/80 text-slate-800 transition"
            title="Redo (Ctrl+Y)"
          >
            <RotateCw className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={() => setShowHelpModal(true)}
            className="p-1.5 rounded hover:bg-slate-200/80 text-slate-800 transition ml-auto"
            title="Keyboard Shortcuts"
          >
            <HelpCircle className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* 4. MAIN EDITING CANVAS */}
      <div className="flex-1 relative bg-white">
        {activeTab === 'visual' ? (
          <div
            ref={editorRef}
            contentEditable
            onInput={handleVisualInput}
            onBlur={handleVisualInput}
            onKeyUp={saveSelection}
            onMouseUp={saveSelection}
            data-placeholder={placeholder}
            style={{ minHeight }}
            className={`p-4 outline-none text-xs sm:text-sm text-slate-800 leading-relaxed font-sans overflow-y-auto ${
              isFullscreen ? 'h-full max-h-[calc(100vh-220px)]' : ''
            } [&>h1]:text-2xl [&>h1]:font-black [&>h1]:my-2 [&>h2]:text-xl [&>h2]:font-extrabold [&>h2]:my-2 [&>h3]:text-lg [&>h3]:font-bold [&>h3]:my-1.5 [&>p]:my-1 [&>ul]:list-disc [&>ul]:pl-5 [&>ol]:list-decimal [&>ol]:pl-5 [&>blockquote]:border-l-4 [&>blockquote]:border-slate-300 [&>blockquote]:pl-3 [&>blockquote]:italic [&>blockquote]:text-slate-600 [&>hr]:my-3 [&>hr]:border-slate-300`}
          />
        ) : (
          <textarea
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            style={{ minHeight }}
            className={`w-full p-4 font-mono text-xs text-slate-800 bg-white outline-none resize-y border-0 leading-relaxed ${
              isFullscreen ? 'h-full max-h-[calc(100vh-220px)]' : ''
            }`}
          />
        )}
      </div>

      {/* 5. FOOTER STATUS BAR */}
      <div className="flex items-center justify-between px-3 py-1.5 bg-slate-50 border-t border-slate-200 text-[10.5px] text-slate-500">
        <span className="font-mono">
          Mode: <strong className="uppercase">{activeTab}</strong>
        </span>
        <div className="flex items-center gap-3">
          <span>Words: {((value || '').replace(/<[^>]*>?/gm, '').trim().split(/\s+/).filter(Boolean).length) || 0}</span>
          <span className="text-slate-300">|</span>
          <span>Chars: {(value || '').length}</span>
        </div>
      </div>

      {/* MODAL: ADD MEDIA */}
      {showMediaModal && (
        <div className="fixed inset-0 z-60 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-5 space-y-4 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <Camera className="w-5 h-5 text-indigo-600" />
                <h3 className="text-sm font-black text-slate-900">Insert Media / Product Photo</h3>
              </div>
              <button
                type="button"
                onClick={() => setShowMediaModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  1. Upload Image from Computer / Phone:
                </label>
                <input
                  type="file"
                  accept="image/*"
                  ref={fileInputRef}
                  onChange={handleFileUpload}
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full py-3 px-4 rounded-xl border-2 border-dashed border-indigo-300 hover:border-indigo-500 bg-indigo-50/50 hover:bg-indigo-50 text-indigo-700 text-xs font-bold flex items-center justify-center gap-2 transition"
                >
                  <Upload className="w-4 h-4" />
                  <span>Choose Image File (JPG, PNG, WebP)</span>
                </button>
              </div>

              <div className="relative flex items-center justify-center">
                <div className="border-t border-slate-200 w-full" />
                <span className="bg-white px-2 text-[10px] uppercase font-bold text-slate-400 absolute">
                  OR
                </span>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  2. Direct Web Image URL:
                </label>
                <div className="flex gap-2">
                  <input
                    type="url"
                    placeholder="https://example.com/photo.jpg"
                    value={mediaUrlInput}
                    onChange={(e) => setMediaUrlInput(e.target.value)}
                    className="flex-1 px-3 py-2 rounded-xl border border-slate-300 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                  <button
                    type="button"
                    onClick={() => handleInsertImage(mediaUrlInput.trim())}
                    disabled={!mediaUrlInput.trim()}
                    className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 disabled:opacity-50 text-white text-xs font-bold transition"
                  >
                    Insert
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: INSERT LINK */}
      {showLinkModal && (
        <div className="fixed inset-0 z-60 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-5 space-y-4 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <div className="flex items-center gap-2">
                <LinkIcon className="w-4 h-4 text-indigo-600" />
                <h4 className="text-sm font-black text-slate-900">Insert Hyperlink</h4>
              </div>
              <button
                type="button"
                onClick={() => setShowLinkModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Link URL</label>
                <input
                  type="url"
                  placeholder="https://..."
                  value={linkUrlInput}
                  onChange={(e) => setLinkUrlInput(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowLinkModal(false)}
                  className="px-3 py-1.5 rounded-lg text-xs font-bold text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleInsertLink}
                  disabled={!linkUrlInput.trim()}
                  className="px-4 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white text-xs font-bold"
                >
                  Apply Link
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: HELP / SHORTCUTS */}
      {showHelpModal && (
        <div className="fixed inset-0 z-60 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-5 space-y-4 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <h4 className="text-sm font-black text-slate-900">Keyboard Shortcuts</h4>
              <button
                type="button"
                onClick={() => setShowHelpModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-2 text-xs text-slate-700 divide-y divide-slate-100">
              <div className="flex justify-between py-1">
                <span>Bold</span>
                <kbd className="px-2 py-0.5 bg-slate-100 rounded text-[10px] font-mono">Ctrl + B</kbd>
              </div>
              <div className="flex justify-between py-1">
                <span>Italic</span>
                <kbd className="px-2 py-0.5 bg-slate-100 rounded text-[10px] font-mono">Ctrl + I</kbd>
              </div>
              <div className="flex justify-between py-1">
                <span>Underline</span>
                <kbd className="px-2 py-0.5 bg-slate-100 rounded text-[10px] font-mono">Ctrl + U</kbd>
              </div>
              <div className="flex justify-between py-1">
                <span>Undo</span>
                <kbd className="px-2 py-0.5 bg-slate-100 rounded text-[10px] font-mono">Ctrl + Z</kbd>
              </div>
              <div className="flex justify-between py-1">
                <span>Redo</span>
                <kbd className="px-2 py-0.5 bg-slate-100 rounded text-[10px] font-mono">Ctrl + Y</kbd>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
