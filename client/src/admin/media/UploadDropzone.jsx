import React, { useState, useRef } from 'react';
import { UploadCloud, CheckCircle2, AlertCircle, X, Loader2, Image as ImageIcon } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function UploadDropzone({ onUploadSuccess, className = '' }) {
  const { token } = useAuth();
  const fileInputRef = useRef(null);
  
  const [dragOver, setDragOver] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const [uploadSuccessCount, setUploadSuccessCount] = useState(0);

  const handleFiles = (files) => {
    setUploadError('');
    setUploadSuccessCount(0);
    const validList = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      // Client-side quick check
      if (!file.type.startsWith('image/')) {
        setUploadError(`Skipped "${file.name}": Only image files (PNG, JPEG, WebP, SVG) are permitted.`);
        continue;
      }
      if (file.size > 10 * 1024 * 1024) {
        setUploadError(`Skipped "${file.name}": File exceeds maximum 10 MB limit.`);
        continue;
      }

      validList.push({
        file,
        id: `${file.name}-${Date.now()}-${i}`,
        previewUrl: URL.createObjectURL(file),
        name: file.name,
        size: (file.size / 1024).toFixed(1) + ' KB',
        altText: file.name.replace(/\.[^.]+$/, '').replace(/[-_]/g, ' ')
      });
    }

    setSelectedFiles(prev => [...prev, ...validList]);
  };

  const onDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const removeFile = (id) => {
    setSelectedFiles(prev => prev.filter(f => f.id !== id));
  };

  const updateAlt = (id, altText) => {
    setSelectedFiles(prev => prev.map(f => f.id === id ? { ...f, altText } : f));
  };

  const handleUpload = async () => {
    if (selectedFiles.length === 0) return;
    setIsUploading(true);
    setUploadError('');

    try {
      const formData = new FormData();
      selectedFiles.forEach(item => {
        formData.append('files', item.file);
      });
      // Pass primary alt text or first file's alt text
      if (selectedFiles[0]?.altText) {
        formData.append('altText', selectedFiles[0].altText);
      }

      const res = await fetch('/api/admin/media/upload', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`
        },
        body: formData
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setUploadSuccessCount(data.assets?.length || selectedFiles.length);
        setSelectedFiles([]);
        if (onUploadSuccess) {
          onUploadSuccess(data.assets);
        }
      } else {
        setUploadError(data.message || 'Upload failed. Please check file formats.');
      }
    } catch (err) {
      setUploadError('Network error uploading files to server.');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className={`bg-white rounded-xl border border-brand-border p-6 shadow-sm space-y-4 ${className}`}>
      
      {/* Drag & Drop Target Area */}
      <div
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={onDrop}
        onClick={() => fileInputRef.current && fileInputRef.current.click()}
        className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all flex flex-col items-center justify-center ${
          dragOver 
            ? 'border-brand-blue bg-blue-50/60 ring-4 ring-brand-blue/10 scale-[0.99]' 
            : 'border-slate-300 hover:border-brand-blue/60 hover:bg-slate-50/80 bg-slate-50/40'
        }`}
      >
        <input
          type="file"
          ref={fileInputRef}
          onChange={(e) => handleFiles(e.target.files)}
          multiple
          accept="image/png, image/jpeg, image/webp, image/svg+xml"
          className="hidden"
        />

        <div className="w-14 h-14 rounded-full bg-brand-blue/10 text-brand-blue flex items-center justify-center mb-3">
          <UploadCloud className="w-7 h-7 stroke-[2]" />
        </div>

        <h4 className="text-sm font-bold text-brand-slate">
          Drag &amp; drop media files here, or <span className="text-brand-blue underline">browse</span>
        </h4>
        
        <p className="text-xs text-slate-500 mt-1 max-w-sm">
          Supports multiple uploads (WebP, PNG, JPEG, SVG). Auto-compresses to high-efficiency WebP with automatic dimension metadata.
        </p>

        <div className="mt-3 flex items-center gap-3 text-[11px] font-mono text-slate-400">
          <span>Max file size: 10 MB</span>
          <span>•</span>
          <span>Auto WebP Compression</span>
          <span>•</span>
          <span>EXIF Stripped</span>
        </div>
      </div>

      {/* Error and Success Notifications */}
      {uploadError && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2 text-xs text-red-700">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
          <span>{uploadError}</span>
        </div>
      )}

      {uploadSuccessCount > 0 && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg flex items-center gap-2 text-xs text-emerald-700 font-medium">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>Successfully uploaded and optimized {uploadSuccessCount} media asset(s)!</span>
        </div>
      )}

      {/* Selected Files Queue Preview */}
      {selectedFiles.length > 0 && (
        <div className="space-y-3 pt-2">
          <div className="flex items-center justify-between text-xs font-bold text-brand-slate">
            <span>Ready for Upload ({selectedFiles.length})</span>
            <button
              type="button"
              onClick={() => setSelectedFiles([])}
              className="text-slate-400 hover:text-red-600 transition-colors"
            >
              Clear Queue
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-64 overflow-y-auto pr-1">
            {selectedFiles.map((item) => (
              <div 
                key={item.id}
                className="flex items-center gap-3 p-2.5 rounded-lg border border-slate-200 bg-white shadow-xs"
              >
                <img
                  src={item.previewUrl}
                  alt={item.name}
                  className="w-12 h-12 rounded object-cover border border-slate-200 bg-slate-100 shrink-0"
                />
                
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-semibold text-brand-slate truncate" title={item.name}>
                    {item.name}
                  </div>
                  <div className="text-[10px] text-slate-400 font-mono">
                    {item.size}
                  </div>
                  <input
                    type="text"
                    value={item.altText}
                    onChange={(e) => updateAlt(item.id, e.target.value)}
                    placeholder="SEO Alt text..."
                    className="w-full text-[11px] p-1 mt-1 border border-slate-200 rounded focus:border-brand-blue outline-none"
                  />
                </div>

                <button
                  type="button"
                  onClick={() => removeFile(item.id)}
                  className="p-1 text-slate-400 hover:text-red-500 rounded transition-colors"
                  aria-label="Remove item"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>

          <div className="pt-2 flex justify-end">
            <button
              type="button"
              disabled={isUploading}
              onClick={handleUpload}
              className="btn-accent text-xs py-2.5 px-6 font-bold flex items-center gap-2 shadow-sm disabled:opacity-50"
            >
              {isUploading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Compressing &amp; Uploading...</span>
                </>
              ) : (
                <>
                  <UploadCloud className="w-4 h-4" />
                  <span>Upload &amp; Optimize {selectedFiles.length} File(s)</span>
                </>
              )}
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
