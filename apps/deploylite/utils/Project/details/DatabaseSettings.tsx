import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { toast } from "sonner"
import {
  Settings,
  Shield,
  Database,
  Clock,
  Users,
  Key,
  AlertTriangle,
  Save,
  RotateCcw,
  Trash2,
  Download,
  Upload,
  Lock,
  Unlock,
  Bell,
  Mail,
  Smartphone,
  Globe,
  HardDrive,
  Cpu,
  MemoryStick,
  Zap,
  Calendar,
  Eye,
  EyeOff
} from 'lucide-react'

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
}

const stagger = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
}

export default function DatabaseSettings() {
  const [settings, setSettings] = useState({
    // Connection Settings
    maxConnections: 100,
    connectionTimeout: 30,
    idleTimeout: 300,
    
    // Security Settings
    sslEnabled: true,
    encryptionAtRest: true,
    requireAuth: true,
    whitelist: '192.168.1.0/24, 10.0.0.0/8',
    
    // Backup Settings
    autoBackup: true,
    backupFrequency: 'daily',
    backupRetention: 30,
    backupCompression: true,
    
    // Performance Settings
    queryCaching: true,
    slowQueryLogging: true,
    slowQueryThreshold: 1.0,
    
    // Monitoring Settings
    monitoring: true,
    alerting: true,
    
    // Notification Settings
    emailNotifications: true,
    slackNotifications: false,
    webhookUrl: '',
    
    // Maintenance Settings
    maintenanceWindow: '02:00',
    autoOptimize: true,
    autoVacuum: true
  })

  const [showAdvanced, setShowAdvanced] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [saving, setSaving] = useState(false)

  const handleSettingChange = (key: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }))
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500))
      toast.success('Settings saved successfully')
    } catch (error) {
      toast.error('Failed to save settings')
    } finally {
      setSaving(false)
    }
  }

  const handleReset = () => {
    // Reset to default values
    setSettings({
      maxConnections: 100,
      connectionTimeout: 30,
      idleTimeout: 300,
      sslEnabled: true,
      encryptionAtRest: true,
      requireAuth: true,
      whitelist: '192.168.1.0/24, 10.0.0.0/8',
      autoBackup: true,
      backupFrequency: 'daily',
      backupRetention: 30,
      backupCompression: true,
      queryCaching: true,
      slowQueryLogging: true,
      slowQueryThreshold: 1.0,
      monitoring: true,
      alerting: true,
      emailNotifications: true,
      slackNotifications: false,
      webhookUrl: '',
      maintenanceWindow: '02:00',
      autoOptimize: true,
      autoVacuum: true
    })
    toast.success('Settings reset to defaults')
  }

  return (
    <div className="space-y-8">
      <motion.div
        initial="hidden"
        animate="visible"
        variants={stagger}
        className="space-y-8"
      >
        {/* Header */}
        <motion.div variants={fadeIn}>
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-r from-purple-500/20 to-blue-500/20 rounded-lg">
                <Settings className="w-6 h-6 text-purple-400" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-100">Database Settings</h2>
                <p className="text-gray-400">Configure your database instance settings and preferences</p>
              </div>
            </div>
            
            <div className="flex gap-3">
              <Button 
                variant="outline" 
                onClick={handleReset}
                className="border-gray-600 text-gray-300 hover:bg-gray-800"
              >
                <RotateCcw className="w-4 h-4 mr-2" />
                Reset
              </Button>
              <Button 
                onClick={handleSave}
                disabled={saving}
                className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600"
              >
                {saving ? (
                  <>
                    <div className="w-4 h-4 mr-2 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    Save Changes
                  </>
                )}
              </Button>
            </div>
          </div>
        </motion.div>

        {/* Connection Settings */}
        <motion.div variants={fadeIn}>
          <Card className="bg-gradient-to-br from-black via-gray-900/90 to-black backdrop-blur-xl border border-purple-500/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-gray-100">
                <Database className="w-5 h-5 text-blue-400" />
                Connection Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-2">
                  <Label className="text-gray-200">Max Connections</Label>
                  <Input
                    type="number"
                    value={settings.maxConnections}
                    onChange={(e) => handleSettingChange('maxConnections', parseInt(e.target.value))}
                    className="bg-black/50 border-gray-700 text-white"
                  />
                  <p className="text-xs text-gray-400">Maximum number of concurrent connections</p>
                </div>
                
                <div className="space-y-2">
                  <Label className="text-gray-200">Connection Timeout (seconds)</Label>
                  <Input
                    type="number"
                    value={settings.connectionTimeout}
                    onChange={(e) => handleSettingChange('connectionTimeout', parseInt(e.target.value))}
                    className="bg-black/50 border-gray-700 text-white"
                  />
                  <p className="text-xs text-gray-400">Time to wait for new connections</p>
                </div>
                
                <div className="space-y-2">
                  <Label className="text-gray-200">Idle Timeout (seconds)</Label>
                  <Input
                    type="number"
                    value={settings.idleTimeout}
                    onChange={(e) => handleSettingChange('idleTimeout', parseInt(e.target.value))}
                    className="bg-black/50 border-gray-700 text-white"
                  />
                  <p className="text-xs text-gray-400">Time before idle connections are closed</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Security Settings */}
        <motion.div variants={fadeIn}>
          <Card className="bg-gradient-to-br from-black via-gray-900/90 to-black backdrop-blur-xl border border-purple-500/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-gray-100">
                <Shield className="w-5 h-5 text-red-400" />
                Security Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-6 md:grid-cols-2">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label className="text-gray-200">SSL/TLS Encryption</Label>
                    <p className="text-xs text-gray-400">Encrypt connections to the database</p>
                  </div>
                  <Switch
                    checked={settings.sslEnabled}
                    onCheckedChange={(checked) => handleSettingChange('sslEnabled', checked)}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label className="text-gray-200">Encryption at Rest</Label>
                    <p className="text-xs text-gray-400">Encrypt stored data files</p>
                  </div>
                  <Switch
                    checked={settings.encryptionAtRest}
                    onCheckedChange={(checked) => handleSettingChange('encryptionAtRest', checked)}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label className="text-gray-200">Require Authentication</Label>
                    <p className="text-xs text-gray-400">Require username/password for connections</p>
                  </div>
                  <Switch
                    checked={settings.requireAuth}
                    onCheckedChange={(checked) => handleSettingChange('requireAuth', checked)}
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label className="text-gray-200">IP Whitelist</Label>
                <Textarea
                  value={settings.whitelist}
                  onChange={(e) => handleSettingChange('whitelist', e.target.value)}
                  placeholder="192.168.1.0/24, 10.0.0.0/8"
                  className="bg-black/50 border-gray-700 text-white"
                  rows={3}
                />
                <p className="text-xs text-gray-400">Comma-separated list of allowed IP ranges (CIDR notation)</p>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Backup Settings */}
        <motion.div variants={fadeIn}>
          <Card className="bg-gradient-to-br from-black via-gray-900/90 to-black backdrop-blur-xl border border-purple-500/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-gray-100">
                <HardDrive className="w-5 h-5 text-green-400" />
                Backup Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label className="text-gray-200">Automatic Backups</Label>
                  <p className="text-xs text-gray-400">Enable scheduled database backups</p>
                </div>
                <Switch
                  checked={settings.autoBackup}
                  onCheckedChange={(checked) => handleSettingChange('autoBackup', checked)}
                />
              </div>
              
              {settings.autoBackup && (
                <div className="grid gap-6 md:grid-cols-3">
                  <div className="space-y-2">
                    <Label className="text-gray-200">Backup Frequency</Label>
                    <select
                      value={settings.backupFrequency}
                      onChange={(e) => handleSettingChange('backupFrequency', e.target.value)}
                      className="w-full px-3 py-2 bg-black/50 border border-gray-700 rounded text-white"
                    >
                      <option value="hourly">Hourly</option>
                      <option value="daily">Daily</option>
                      <option value="weekly">Weekly</option>
                    </select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label className="text-gray-200">Retention (days)</Label>
                    <Input
                      type="number"
                      value={settings.backupRetention}
                      onChange={(e) => handleSettingChange('backupRetention', parseInt(e.target.value))}
                      className="bg-black/50 border-gray-700 text-white"
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <Label className="text-gray-200">Compression</Label>
                      <p className="text-xs text-gray-400">Compress backup files</p>
                    </div>
                    <Switch
                      checked={settings.backupCompression}
                      onCheckedChange={(checked) => handleSettingChange('backupCompression', checked)}
                    />
                  </div>
                </div>
              )}
              
              <div className="flex gap-3">
                <Button variant="outline" className="border-green-500/30 text-green-300 hover:bg-green-500/10">
                  <Download className="w-4 h-4 mr-2" />
                  Create Backup Now
                </Button>
                <Button variant="outline" className="border-blue-500/30 text-blue-300 hover:bg-blue-500/10">
                  <Upload className="w-4 h-4 mr-2" />
                  Restore from Backup
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Performance Settings */}
        <motion.div variants={fadeIn}>
          <Card className="bg-gradient-to-br from-black via-gray-900/90 to-black backdrop-blur-xl border border-purple-500/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-gray-100">
                <Zap className="w-5 h-5 text-yellow-400" />
                Performance Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-6 md:grid-cols-2">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label className="text-gray-200">Query Caching</Label>
                    <p className="text-xs text-gray-400">Cache frequently used queries</p>
                  </div>
                  <Switch
                    checked={settings.queryCaching}
                    onCheckedChange={(checked) => handleSettingChange('queryCaching', checked)}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label className="text-gray-200">Slow Query Logging</Label>
                    <p className="text-xs text-gray-400">Log queries that exceed threshold</p>
                  </div>
                  <Switch
                    checked={settings.slowQueryLogging}
                    onCheckedChange={(checked) => handleSettingChange('slowQueryLogging', checked)}
                  />
                </div>
              </div>
              
              {settings.slowQueryLogging && (
                <div className="space-y-2">
                  <Label className="text-gray-200">Slow Query Threshold (seconds)</Label>
                  <Input
                    type="number"
                    step="0.1"
                    value={settings.slowQueryThreshold}
                    onChange={(e) => handleSettingChange('slowQueryThreshold', parseFloat(e.target.value))}
                    className="bg-black/50 border-gray-700 text-white"
                  />
                  <p className="text-xs text-gray-400">Queries taking longer than this will be logged</p>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Monitoring & Alerts */}
        <motion.div variants={fadeIn}>
          <Card className="bg-gradient-to-br from-black via-gray-900/90 to-black backdrop-blur-xl border border-purple-500/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-gray-100">
                <Bell className="w-5 h-5 text-orange-400" />
                Monitoring & Alerts
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-6 md:grid-cols-2">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label className="text-gray-200">Performance Monitoring</Label>
                    <p className="text-xs text-gray-400">Monitor database performance metrics</p>
                  </div>
                  <Switch
                    checked={settings.monitoring}
                    onCheckedChange={(checked) => handleSettingChange('monitoring', checked)}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label className="text-gray-200">Alert Notifications</Label>
                    <p className="text-xs text-gray-400">Send alerts for issues and thresholds</p>
                  </div>
                  <Switch
                    checked={settings.alerting}
                    onCheckedChange={(checked) => handleSettingChange('alerting', checked)}
                  />
                </div>
              </div>
              
              {settings.alerting && (
                <div className="space-y-4">
                  <div className="grid gap-6 md:grid-cols-2">
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <Label className="text-gray-200 flex items-center gap-2">
                          <Mail className="w-4 h-4" />
                          Email Notifications
                        </Label>
                        <p className="text-xs text-gray-400">Send alerts via email</p>
                      </div>
                      <Switch
                        checked={settings.emailNotifications}
                        onCheckedChange={(checked) => handleSettingChange('emailNotifications', checked)}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <Label className="text-gray-200 flex items-center gap-2">
                          <Smartphone className="w-4 h-4" />
                          Slack Notifications
                        </Label>
                        <p className="text-xs text-gray-400">Send alerts to Slack</p>
                      </div>
                      <Switch
                        checked={settings.slackNotifications}
                        onCheckedChange={(checked) => handleSettingChange('slackNotifications', checked)}
                      />
                    </div>
                  </div>
                  
                  {settings.slackNotifications && (
                    <div className="space-y-2">
                      <Label className="text-gray-200">Slack Webhook URL</Label>
                      <Input
                        type="url"
                        value={settings.webhookUrl}
                        onChange={(e) => handleSettingChange('webhookUrl', e.target.value)}
                        placeholder="https://hooks.slack.com/services/..."
                        className="bg-black/50 border-gray-700 text-white"
                      />
                      <p className="text-xs text-gray-400">Webhook URL for Slack integration</p>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Maintenance Settings */}
        <motion.div variants={fadeIn}>
          <Card className="bg-gradient-to-br from-black via-gray-900/90 to-black backdrop-blur-xl border border-purple-500/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-gray-100">
                <Clock className="w-5 h-5 text-purple-400" />
                Maintenance Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-2">
                  <Label className="text-gray-200">Maintenance Window</Label>
                  <Input
                    type="time"
                    value={settings.maintenanceWindow}
                    onChange={(e) => handleSettingChange('maintenanceWindow', e.target.value)}
                    className="bg-black/50 border-gray-700 text-white"
                  />
                  <p className="text-xs text-gray-400">Time for automated maintenance tasks</p>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <Label className="text-gray-200">Auto Optimization</Label>
                      <p className="text-xs text-gray-400">Automatically optimize tables and indexes</p>
                    </div>
                    <Switch
                      checked={settings.autoOptimize}
                      onCheckedChange={(checked) => handleSettingChange('autoOptimize', checked)}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <Label className="text-gray-200">Auto Vacuum</Label>
                      <p className="text-xs text-gray-400">Automatically clean up deleted data</p>
                    </div>
                    <Switch
                      checked={settings.autoVacuum}
                      onCheckedChange={(checked) => handleSettingChange('autoVacuum', checked)}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Advanced Settings */}
        <motion.div variants={fadeIn}>
          <Card className="bg-gradient-to-br from-black via-gray-900/90 to-black backdrop-blur-xl border border-purple-500/20">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center gap-3 text-gray-100">
                  <Settings className="w-5 h-5 text-red-400" />
                  Advanced Settings
                </div>
                <Button
                  variant="ghost"
                  onClick={() => setShowAdvanced(!showAdvanced)}
                  className="text-gray-400 hover:text-purple-300"
                >
                  {showAdvanced ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  {showAdvanced ? 'Hide' : 'Show'}
                </Button>
              </CardTitle>
            </CardHeader>
            {showAdvanced && (
              <CardContent className="space-y-6">
                <div className="p-4 bg-amber-500/10 border border-amber-500/20 rounded-lg">
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="w-5 h-5 text-amber-400 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-amber-400">Warning</h4>
                      <p className="text-sm text-amber-300/80 mt-1">
                        Advanced settings can significantly impact database performance. Only modify these if you understand the implications.
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="grid gap-6 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label className="text-gray-200">Buffer Pool Size (MB)</Label>
                    <Input
                      type="number"
                      defaultValue="128"
                      className="bg-black/50 border-gray-700 text-white"
                    />
                    <p className="text-xs text-gray-400">Memory allocated for caching data</p>
                  </div>
                  
                  <div className="space-y-2">
                    <Label className="text-gray-200">Log File Size (MB)</Label>
                    <Input
                      type="number"
                      defaultValue="64"
                      className="bg-black/50 border-gray-700 text-white"
                    />
                    <p className="text-xs text-gray-400">Size of transaction log files</p>
                  </div>
                  
                  <div className="space-y-2">
                    <Label className="text-gray-200">Query Cache Size (MB)</Label>
                    <Input
                      type="number"
                      defaultValue="16"
                      className="bg-black/50 border-gray-700 text-white"
                    />
                    <p className="text-xs text-gray-400">Memory for query result caching</p>
                  </div>
                  
                  <div className="space-y-2">
                    <Label className="text-gray-200">Sort Buffer Size (MB)</Label>
                    <Input
                      type="number"
                      defaultValue="2"
                      className="bg-black/50 border-gray-700 text-white"
                    />
                    <p className="text-xs text-gray-400">Buffer size for sorting operations</p>
                  </div>
                </div>
              </CardContent>
            )}
          </Card>
        </motion.div>

        {/* Danger Zone */}
        <motion.div variants={fadeIn}>
          <Card className="bg-gradient-to-br from-red-900/20 via-red-800/10 to-black backdrop-blur-xl border border-red-500/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-red-400">
                <AlertTriangle className="w-5 h-5" />
                Danger Zone
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
                <h4 className="font-medium text-red-400 mb-2">Reset Database</h4>
                <p className="text-sm text-red-300/80 mb-4">
                  This will reset the database to its initial state, removing all data and configurations.
                </p>
                <Button variant="outline" className="border-red-500/30 text-red-400 hover:bg-red-500/10">
                  <RotateCcw className="w-4 h-4 mr-2" />
                  Reset Database
                </Button>
              </div>
              
              <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
                <h4 className="font-medium text-red-400 mb-2">Delete Database</h4>
                <p className="text-sm text-red-300/80 mb-4">
                  Permanently delete this database instance. This action cannot be undone.
                </p>
                <Button variant="outline" className="border-red-500/30 text-red-400 hover:bg-red-500/10">
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete Database
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </div>
  )
}