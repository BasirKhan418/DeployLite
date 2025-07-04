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
  Zap
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
}

interface KnowledgeBaseManagerProps {
  chatbotId: string;
  knowledgeBase: any[];
  onUpdate: () => void;
}

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
  const fileInputRef = useRef<HTMLInputElement>(null);

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
    const k = 1024;
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
          status: 'uploading'
        };

        setFiles(prev => [...prev, tempFile]);

        // Simulate upload progress
        const formData = new FormData();
        formData.append('file', file);
        formData.append('chatbotId', chatbotId);

        // Simulate API call for S3 upload
        const response = await fetch('/api/chatbot/knowledge-base/upload', {
          method: 'POST',
          body: formData
        });

        const result = await response.json();
        
        if (result.success) {
          // Update file status to processing
          setFiles(prev => prev.map(f => 
            f.id === tempFile.id 
              ? { ...f, status: 'processing', id: result.fileId, url: result.url }
              : f
          ));

          // Start vectorization process
          await processFile(result.fileId);
          
        } else {
          // Update file status to failed
          setFiles(prev => prev.map(f => 
            f.id === tempFile.id 
              ? { ...f, status: 'failed' }
              : f
          ));
          toast.error(`Failed to upload ${file.name}: ${result.message}`);
        }

        // Update progress
        setUploadProgress(((i + 1) / fileArray.length) * 100);
      }

      toast.success(`Successfully uploaded ${fileArray.length} file(s)`);
      onUpdate();
      
    } catch (error) {
      console.error('Upload error:', error);
      toast.error('Upload failed. Please try again.');
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  };

  const processFile = async (fileId: string) => {
    try {
      const response = await fetch('/api/chatbot/knowledge-base/process', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fileId,
          chatbotId
        })
      });

      const result = await response.json();
      
      if (result.success) {
        setFiles(prev => prev.map(f => 
          f.id === fileId 
            ? { ...f, status: 'ready', vectorized: true }
            : f
        ));
        toast.success('File processed and vectorized successfully');
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
        body: JSON.stringify({ chatbotId })
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

  return (
    <div className="space-y-6">
      {/* Upload Area */}
      <Card className="bg-gradient-to-br from-black via-gray-900/90 to-black backdrop-blur-xl border border-pink-500/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-3 text-xl text-gray-200">
            <Database className="w-6 h-6 text-pink-400" />
            Knowledge Base Manager
          </CardTitle>
          <CardDescription className="text-gray-400">
            Upload documents, images, and other files to train your chatbot
          </CardDescription>
        </CardHeader>

        <CardContent>
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
                <p className="text-gray-400 mb-4">
                  Drag and drop files here, or click to browse
                </p>

                {uploading && (
                  <div className="space-y-2">
                    <Progress value={uploadProgress} className="h-2" />
                    <p className="text-sm text-amber-400">
                      Upload progress: {uploadProgress.toFixed(0)}%
                    </p>
                  </div>
                )}

                {!uploading && (
                  <Button
                    variant="outline"
                    className="border-pink-500/50 text-pink-400 hover:bg-pink-500/10"
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

      {/* Files List */}
      <Card className="bg-gradient-to-br from-black via-gray-900/90 to-black backdrop-blur-xl border border-pink-500/20">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-gray-200">Uploaded Files</CardTitle>
              <CardDescription>
                {files.length} files in knowledge base
              </CardDescription>
            </div>
            
            {files.some(f => f.status === 'failed') && (
              <Button
                onClick={retryProcessing}
                disabled={processing}
                variant="outline"
                className="border-amber-500/50 text-amber-400 hover:bg-amber-500/10"
              >
                {processing ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <Zap className="w-4 h-4 mr-2" />
                )}
                Retry Processing
              </Button>
            )}
          </div>
        </CardHeader>

        <CardContent>
          {files.length === 0 ? (
            <div className="text-center py-12">
              <Database className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-200 mb-2">No files uploaded yet</h3>
              <p className="text-gray-400">
                Upload your first document to start building your knowledge base
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              <AnimatePresence>
                {files.map((file) => {
                  const { icon: FileIcon, color } = getFileIcon(file.name);
                  const category = getFileCategory(file.name);
                  
                  return (
                    <motion.div
                      key={file.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      className="flex items-center justify-between p-4 bg-gray-800/50 rounded-lg border border-gray-700 hover:border-gray-600 transition-colors"
                    >
                      <div className="flex items-center space-x-4 flex-1 min-w-0">
                        <div className={`p-2 rounded-lg ${category?.bgColor || 'bg-gray-700'}`}>
                          <FileIcon className={`w-5 h-5 ${color}`} />
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <h4 className="text-gray-200 font-medium truncate">{file.name}</h4>
                          <div className="flex items-center gap-3 text-sm text-gray-400">
                            <span>{formatFileSize(file.size)}</span>
                            <span>•</span>
                            <span>{new Date(file.uploadDate).toLocaleDateString()}</span>
                            {file.vectorized && (
                              <>
                                <span>•</span>
                                <div className="flex items-center gap-1">
                                  <Brain className="w-3 h-3 text-pink-400" />
                                  <span className="text-pink-400">Vectorized</span>
                                </div>
                              </>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center space-x-3">
                        <div className="flex items-center gap-2">
                          {getStatusIcon(file.status)}
                          <Badge className={`${getStatusColor(file.status)} text-xs`}>
                            {file.status}
                          </Badge>
                        </div>

                        <div className="flex items-center space-x-1">
                          {file.url && file.status === 'ready' && (
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => window.open(file.url, '_blank')}
                              className="text-gray-400 hover:text-blue-300"
                            >
                              <Eye className="w-4 h-4" />
                            </Button>
                          )}
                          
                          {file.url && (
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => window.open(file.url, '_blank')}
                              className="text-gray-400 hover:text-green-300"
                            >
                              <Download className="w-4 h-4" />
                            </Button>
                          )}
                          
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => deleteFile(file.id)}
                            className="text-gray-400 hover:text-red-300"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Processing Status */}
      {files.some(f => f.status === 'processing') && (
        <Card className="bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-500/30">
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <Loader2 className="w-6 h-6 text-amber-400 animate-spin" />
              <div>
                <h3 className="text-amber-300 font-semibold">Processing Files</h3>
                <p className="text-amber-200/80 text-sm">
                  Your files are being processed and vectorized for optimal search performance.
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