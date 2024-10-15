"use client"
import React, { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { ScrollArea } from "@/components/ui/scroll-area"
import { AlertCircle,  MoreVertical, Plus, Server, Settings, Trash2 ,Database} from 'lucide-react'
import { Progress } from "@/components/ui/progress"
import CreateDatabase from '../modals/CreateDatabase'
// Constants
const DATABASE_TYPES = {
  POSTGRESQL: 'PostgreSQL',
  MYSQL: 'MySQL',
  MONGODB: 'MongoDB',
  REDIS: 'Redis',
}

const DATABASE_STATUS = {
  ACTIVE: 'Active',
  INACTIVE: 'Inactive',
  MAINTENANCE: 'Maintenance',
}

// Mock data
const mockDatabases = [
  { id: 1, name: 'Production DB', type: DATABASE_TYPES.POSTGRESQL, status: DATABASE_STATUS.ACTIVE, size: 1024, maxSize: 5120, connections: 42, uptime: '99.99%' },
  { id: 2, name: 'Development DB', type: DATABASE_TYPES.MYSQL, status: DATABASE_STATUS.ACTIVE, size: 512, maxSize: 1024, connections: 15, uptime: '99.95%' },
  { id: 3, name: 'Analytics DB', type: DATABASE_TYPES.MONGODB, status: DATABASE_STATUS.MAINTENANCE, size: 2048, maxSize: 4096, connections: 0, uptime: '98.50%' },
  { id: 4, name: 'Cache DB', type: DATABASE_TYPES.REDIS, status: DATABASE_STATUS.INACTIVE, size: 128, maxSize: 512, connections: 0, uptime: '0%' },
]

export default function DatabaseComp() {
  const [databases, setDatabases] = useState(mockDatabases)
  const [newDbName, setNewDbName] = useState('')
  const [newDbType, setNewDbType] = useState('')
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [open,setOpen] = useState(false)
  const addNewDatabase = () => {
    if (newDbName && newDbType) {
      const newDb = {
        id: databases.length + 1,
        name: newDbName,
        type: newDbType,
        status: DATABASE_STATUS.ACTIVE,
        size: 0,
        maxSize: 1024,
        connections: 0,
        uptime: '100%',
      }
      setDatabases([...databases, newDb])
      setNewDbName('')
      setNewDbType('')
      setIsDialogOpen(false)
    }
  }

  const deleteDatabase = (id: number) => {
    setDatabases(databases.filter(db => db.id !== id))
  }

  return (
    <div className="min-h-screen  p-8">
      <CreateDatabase open={open} setOpen={setOpen}/>
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex"> <Database className="h-8 w-8 text-blue-500 mx-2"/>Database Management</h1>
          
              <Button onClick={()=>{
                setOpen(true)
              }}>
                <Plus className="w-4 h-4 mr-2" />
                Add Database
              </Button>
           
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {databases.map((db) => (
            <Card key={db.id} className="overflow-hidden">
              <CardHeader className="pb-4">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle>{db.name}</CardTitle>
                    <CardDescription>{db.type}</CardDescription>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">Open menu</span>
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>
                        <Settings className="mr-2 h-4 w-4" />
                        <span>Settings</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Server className="mr-2 h-4 w-4" />
                        <span>View Logs</span>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => deleteDatabase(db.id)} className="text-red-600">
                        <Trash2 className="mr-2 h-4 w-4" />
                        <span>Delete</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid gap-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Status</span>
                    <Badge variant={db.status === DATABASE_STATUS.ACTIVE ? 'default' : 'secondary'}>
                      {db.status}
                    </Badge>
                  </div>
                  <div className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span>Storage</span>
                      <span>{Math.round(db.size / db.maxSize * 100)}% used</span>
                    </div>
                    <Progress value={db.size / db.maxSize * 100} className="h-2" />
                    <div className="text-xs text-muted-foreground">
                      {db.size} MB / {db.maxSize} MB
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Connections</span>
                    <span className="font-medium">{db.connections}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Uptime</span>
                    <span className="font-medium">{db.uptime}</span>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="bg-muted/50 p-3">
                <Button variant="outline" size="sm" className="w-full">
                  <Database className="w-4 h-4 mr-2" />
                  Manage Database
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}