"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import {
  Upload,
  File,
  FileText,
  Image,
  Video,
  Music,
  Archive,
  X,
  Download,
  Eye,
  Trash2,
  Loader2,
  CheckCircle,
  AlertCircle,
  Plus,
  Brain,
  Database,
  Zap,
  Sparkles,
  Bot
} from "lucide-react";

interface KnowledgeFile {
  id: string;
  name: string;
  type: string;
  size: number;
  uploadDate: string;
  status: 'uploading' | 'processing' | 'ready' | 'failed';
  url?: string;
  vectorized?: boolean;
  provider?: 'openai' | 'gemini';
}

interface KnowledgeBaseManagerProps {
  chatbotId: string;
  knowledgeBase: any[];
  onUpdate: () => void;
}

// AI Provider Toggle Component
const AIProviderToggle = ({ provider, onProviderChange }: { 
  provider: 'openai' | 'gemini', 
  onProviderChange: (provider: 'openai' | 'gemini') => void 
}) => {
  return (
    <div className="inline-flex bg-gray-800/80 rounded-lg p-1 border border-gray-600/50">
      <button
        onClick={() => onProviderChange('openai')}
        className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-all duration-200 ${
          provider === 'openai'
            ? 'bg-purple-500 text-white shadow-lg'
            : 'text-gray-400 hover:text-gray-300 hover:bg-gray-700/50'
        }`}
      >
        <Brain className="w-4 h-4" />
        OpenAI
      </button>
      <button
        onClick={() => onProviderChange('gemini')}
        className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-all duration-200 ${
          provider === 'gemini'
            ? 'bg-pink-500 text-white shadow-lg'
            : 'text-gray-400 hover:text-gray-300 hover:bg-gray-700/50'
        }`}
      >
        <Sparkles className="w-4 h-4" />
        Gemini
      </button>
    </div>
  );
};

const KnowledgeBaseManager: React.FC<KnowledgeBaseManagerProps> = ({
  chatbotId,
  knowledgeBase,
  onUpdate
}) => {
  const [files, setFiles] = useState<KnowledgeFile[]>(knowledgeBase || []);
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [processing, setProcessing] = useState(false);
  const [aiProvider, setAiProvider] = useState<'openai' | 'gemini'>('openai');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [url, setUrl] = useState<string | null>(null);

  // Supported file types based on backend capabilities
  const supportedTypes = {
    documents: {
      types: ['.pdf', '.doc', '.docx', '.txt', '.md', '.rtf'],
      icon: FileText,
      color: 'text-blue-400',
      bgColor: 'bg-blue-500/10',
      borderColor: 'border-blue-500/30'
    },
    images: {
      types: ['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.svg'],
      icon: Image,
      color: 'text-green-400',
      bgColor: 'bg-green-500/10',
      borderColor: 'border-green-500/30'
    },
    videos: {
      types: ['.mp4', '.avi', '.mov', '.wmv', '.flv', '.webm'],
      icon: Video,
      color: 'text-purple-400',
      bgColor: 'bg-purple-500/10',
      borderColor: 'border-purple-500/30'
    },
    audio: {
      types: ['.mp3', '.wav', '.flac', '.aac', '.ogg'],
      icon: Music,
      color: 'text-pink-400',
      bgColor: 'bg-pink-500/10',
      borderColor: 'border-pink-500/30'
    },
    archives: {
      types: ['.zip', '.rar', '.7z', '.tar', '.gz'],
      icon: Archive,
      color: 'text-orange-400',
      bgColor: 'bg-orange-500/10',
      borderColor: 'border-orange-500/30'
    }
  };

  const getAllSupportedTypes = () => {
    return Object.values(supportedTypes).flatMap(category => category.types);
  };

  const getFileIcon = (fileName: string) => {
    const extension = '.' + fileName.split('.').pop()?.toLowerCase();
    
    for (const [category, config] of Object.entries(supportedTypes)) {
      if (config.types.includes(extension)) {
        return { icon: config.icon, color: config.color, category };
      }
    }
    
    return { icon: File, color: 'text-gray-400', category: 'unknown' };
  };

  const getFileCategory = (fileName: string) => {
    const extension = '.' + fileName.split('.').pop()?.toLowerCase();
    
    for (const [category, config] of Object.entries(supportedTypes)) {
      if (config.types.includes(extension)) {
        return { ...config, name: category };
      }
    }
    
    return null;
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 100024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const validateFile = (file: File): { valid: boolean; error?: string } => {
    const extension = '.' + file.name.split('.').pop()?.toLowerCase();
    const supportedExtensions = getAllSupportedTypes();
    
    if (!supportedExtensions.includes(extension)) {
      return {
        valid: false,
        error: `File type ${extension} is not supported. Supported types: ${supportedExtensions.join(', ')}`
      };
    }

    // Check file size (max 10MB for demo)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      return {
        valid: false,
        error: `File size exceeds 10MB limit. Current size: ${formatFileSize(file.size)}`
      };
    }

    return { valid: true };
  };

  const handleFileUpload = async (selectedFiles: FileList | File[]) => {
    const fileArray = Array.from(selectedFiles);
    
    // Validate all files first
    for (const file of fileArray) {
      const validation = validateFile(file);
      if (!validation.valid) {
        toast.error(validation.error);
        return;
      }
    }

    setUploading(true);
    setUploadProgress(0);

    try {
      for (let i = 0; i < fileArray.length; i++) {
        const file = fileArray[i];
        
        // Create temporary file object
        const tempFile: KnowledgeFile = {
          id: `temp-${Date.now()}-${i}`,
          name: file.name,
          type: file.type || 'application/octet-stream',
          size: file.size,
          uploadDate: new Date().toISOString(),
          status: 'uploading',
          provider: aiProvider
        };

        setFiles(prev => [...prev, tempFile]);

        // Simulate upload progress
        const formData = new FormData();
        formData.append('file', file);
        formData.append('id', chatbotId);
        formData.append('storeType', aiProvider);

        // Simulate API call for S3 upload with provider
        const response = await fetch('/api/upload', {
          method: 'POST',
          body: formData
        });

        const result = await response.json();

        console.log('Upload result:', result);
        
        if (result.success) {
      

      toast.success(`Successfully uploaded ${fileArray.length} file(s) to ${aiProvider.toUpperCase()}`);
      onUpdate();
        }
        else{
          toast.error(`Failed to upload ${file.name}: ${result.error || 'Unknown error'}`);
        }
      }
    } catch (error) {
      console.error('Upload error:', error);
      toast.error('Upload failed. Please try again.');
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  };

  const processFile = async (fileId: string, provider: 'openai' | 'gemini') => {
    try {
      const response = await fetch('/api/chatbot/knowledge-base/process', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fileId,
          chatbotId,
          provider
        })
      });

      const result = await response.json();
      
      if (result.success) {
        setFiles(prev => prev.map(f => 
          f.id === fileId 
            ? { ...f, status: 'ready', vectorized: true, provider }
            : f
        ));
        toast.success(`File processed with ${provider.toUpperCase()} successfully`);
      } else {
        setFiles(prev => prev.map(f => 
          f.id === fileId 
            ? { ...f, status: 'failed' }
            : f
        ));
        toast.error('File processing failed');
      }
    } catch (error) {
      console.error('Processing error:', error);
      setFiles(prev => prev.map(f => 
        f.id === fileId 
          ? { ...f, status: 'failed' }
          : f
      ));
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    
    const droppedFiles = e.dataTransfer.files;
    if (droppedFiles.length > 0) {
      handleFileUpload(droppedFiles);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = e.target.files;
    if (selectedFiles && selectedFiles.length > 0) {
      handleFileUpload(selectedFiles);
    }
    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const deleteFile = async (fileId: string) => {
    try {
      const response = await fetch('/api/chatbot/knowledge-base/delete', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ fileId, chatbotId })
      });

      const result = await response.json();
      
      if (result.success) {
        setFiles(prev => prev.filter(f => f.id !== fileId));
        toast.success('File deleted successfully');
        onUpdate();
      } else {
        toast.error('Failed to delete file');
      }
    } catch (error) {
      console.error('Delete error:', error);
      toast.error('Error deleting file');
    }
  };

  const retryProcessing = async () => {
    setProcessing(true);
    
    try {
      const response = await fetch('/api/chatbot/knowledge-base/reprocess', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ chatbotId, provider: aiProvider })
      });

      const result = await response.json();
      
      if (result.success) {
        toast.success('Processing restarted successfully');
        onUpdate();
      } else {
        toast.error('Failed to restart processing');
      }
    } catch (error) {
      console.error('Reprocess error:', error);
      toast.error('Error restarting processing');
    } finally {
      setProcessing(false);
    }
  };

  const trainOnCustomData = async () => {
    try{
    const response = await fetch('/api/upload/custom', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        url,
        id: chatbotId,
        provider: aiProvider
      }),
    })
    const result = await response.json();
    if (result.success) {
      toast.success('Successfully trained on custom data');
      onUpdate();
    } else {
      toast.error(`Failed to train on custom data: ${result.error || 'Unknown error'}`);
    }
  }
    catch(error) {
      console.error('Error training on custom data:', error);
      toast.error('Failed to train on custom data');
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'ready':
        return <CheckCircle className="w-4 h-4 text-emerald-400" />;
      case 'failed':
        return <AlertCircle className="w-4 h-4 text-red-400" />;
      case 'uploading':
      case 'processing':
        return <Loader2 className="w-4 h-4 text-amber-400 animate-spin" />;
      default:
        return <File className="w-4 h-4 text-gray-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ready':
        return 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400';
      case 'failed':
        return 'bg-red-500/10 border-red-500/30 text-red-400';
      case 'uploading':
      case 'processing':
        return 'bg-amber-500/10 border-amber-500/30 text-amber-400';
      default:
        return 'bg-gray-500/10 border-gray-500/30 text-gray-400';
    }
  };

  const getProviderIcon = (provider?: 'openai' | 'gemini') => {
    if (provider === 'openai') {
      return <Brain className="w-3 h-3 text-purple-400" />;
    } else if (provider === 'gemini') {
      return <Sparkles className="w-3 h-3 text-pink-400" />;
    }
    return null;
  };

  return (
    <div className="space-y-6">
      {/* Upload Area */}
      <Card className="bg-gradient-to-br from-black via-gray-900/90 to-black backdrop-blur-xl border border-pink-500/20">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-3 text-xl text-gray-200">
                <Database className="w-6 h-6 text-pink-400" />
                Knowledge Base Manager
              </CardTitle>
              <CardDescription className="text-gray-400">
                Upload documents, images, and other files to train your chatbot
              </CardDescription>
            </div>
            
            {/* AI Provider Toggle */}
            <div className="flex flex-col items-end gap-2">
              <div className="text-xs text-gray-400 font-medium">AI Provider</div>
              <AIProviderToggle provider={aiProvider} onProviderChange={setAiProvider} />
            </div>
          </div>
        </CardHeader>

        <CardContent>
          {/* Provider Info Banner */}
          <div className={`mb-6 p-4 rounded-xl border ${
            aiProvider === 'openai' 
              ? 'bg-purple-500/10 border-purple-500/20' 
              : 'bg-pink-500/10 border-pink-500/20'
          }`}>
            <div className="flex items-center gap-3">
              {aiProvider === 'openai' ? (
                <Brain className="w-5 h-5 text-purple-400" />
              ) : (
                <Sparkles className="w-5 h-5 text-pink-400" />
              )}
              <div>
                <h4 className={`font-medium ${
                  aiProvider === 'openai' ? 'text-purple-400' : 'text-pink-400'
                }`}>
                  {aiProvider === 'openai' ? 'OpenAI GPT' : 'Google Gemini'} Selected
                </h4>
                <p className="text-gray-400 text-sm">
                  Files will be processed and vectorized using {aiProvider === 'openai' ? 'OpenAI embeddings' : 'Gemini embeddings'}
                </p>
              </div>
            </div>
          </div>

          {/* File Upload Zone */}
          <div
            className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-all duration-300 ${
              dragOver
                ? 'border-pink-500 bg-pink-500/10'
                : uploading
                ? 'border-amber-500 bg-amber-500/10'
                : 'border-gray-600 hover:border-pink-500/50 hover:bg-pink-500/5'
            }`}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
          >
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept={getAllSupportedTypes().join(',')}
              onChange={handleFileSelect}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              disabled={uploading}
            />

            <motion.div
              animate={{ 
                scale: dragOver ? 1.05 : 1,
                rotate: dragOver ? 2 : 0
              }}
              className="space-y-4"
            >
              <div className={`w-16 h-16 mx-auto rounded-full flex items-center justify-center ${
                uploading ? 'bg-amber-500/20' : 'bg-pink-500/20'
              }`}>
                {uploading ? (
                  <Loader2 className="w-8 h-8 text-amber-400 animate-spin" />
                ) : (
                  <Upload className="w-8 h-8 text-pink-400" />
                )}
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-200 mb-2">
                  {uploading ? 'Uploading Files...' : 'Upload Knowledge Base Files'}
                </h3>
                <p className="text-gray-400 mb-2">
                  Drag and drop files here, or click to browse
                </p>
                <p className="text-sm text-gray-500">
                  Files will be processed with {aiProvider.toUpperCase()}
                </p>

                {uploading && (
                  <div className="space-y-2 mt-4">
                    <Progress value={uploadProgress} className="h-2" />
                    <p className="text-sm text-amber-400">
                      Upload progress: {uploadProgress.toFixed(0)}%
                    </p>
                  </div>
                )}

                {!uploading && (
                  <Button
                    variant="outline"
                    className="border-pink-500/50 text-pink-400 hover:bg-pink-500/10 mt-4"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Choose Files
                  </Button>
                )}
              </div>
            </motion.div>
          </div>

          {/* Supported File Types */}
          <div className="mt-6 grid grid-cols-2 md:grid-cols-5 gap-4">
            {Object.entries(supportedTypes).map(([category, config]) => (
              <div
                key={category}
                className={`p-3 rounded-lg border ${config.bgColor} ${config.borderColor} text-center`}
              >
                <config.icon className={`w-6 h-6 mx-auto mb-2 ${config.color}`} />
                <h4 className="text-sm font-medium text-gray-200 capitalize">{category}</h4>
                <p className="text-xs text-gray-400 mt-1">
                  {config.types.slice(0, 2).join(', ')}
                  {config.types.length > 2 && ` +${config.types.length - 2}`}
                </p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
      <div className="flex items-center justify-between mt-4">
        <input type="text" onChange={(e)=>{
          setUrl((e.target as HTMLInputElement).value);
        }} className="w-full p-2 m-2 rounded"/>
        <Button
        onClick={trainOnCustomData}
        >Train Now</Button>
      </div>
       
      {/* Files List */}
     
     

      {/* Processing Status */}
      {files.some(f => f.status === 'processing') && (
        <Card className="bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-500/30">
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <Loader2 className="w-6 h-6 text-amber-400 animate-spin" />
              <div>
                <h3 className="text-amber-300 font-semibold">Processing Files</h3>
                <p className="text-amber-200/80 text-sm">
                  Your files are being processed and vectorized with {aiProvider.toUpperCase()} for optimal search performance.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default KnowledgeBaseManager;