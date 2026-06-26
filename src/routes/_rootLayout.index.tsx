import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'

import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'
import { LayoutGrid, TextAlignJustify } from 'lucide-react'

type Workspace = {
  id: string
  name: string
  members: number
  description?: string
}

export const Route = createFileRoute('/_rootLayout/')({
  component: WorkspacesPage,
})

function WorkspacesPage() {
  const [workspaces, setWorkspaces] = useState<Array<Workspace>>([
    {
      id: '1',
      name: 'Penang Food Trip',
      members: 4,
      description: 'Food adventures',
    },
    {
      id: '2',
      name: 'Roommates Shared',
      members: 3,
      description: 'Monthly bills',
    },
  ])

  const [openCreate, setOpenCreate] = useState(false)

  const [name, setName] = useState('')
  const [membersCount, setMembersCount] = useState('2')
  const [description, setDescription] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')

  const resetForm = () => {
    setName('')
    setMembersCount('2')
    setDescription('')
  }

  const handleCreate = () => {
    if (!name.trim()) return
    const ws: Workspace = {
      id: Date.now().toString(),
      name: name.trim(),
      members: parseInt(membersCount) || 1,
      description: description.trim(),
    }
    setWorkspaces([ws, ...workspaces])
    resetForm()
    setOpenCreate(false)
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-heading font-black text-2xl">Your Workspaces</h1>
        <Button
          onClick={() => setOpenCreate(true)}
          className="neo-btn bg-primary text-primary-foreground font-bold"
        >
          + Create Workspace
        </Button>
      </div>

      <div className="flex items-center gap-3 mb-4">
        <Input
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search workspaces..."
          className="max-w-md"
        />

        <div className="ml-auto">
          <ToggleGroup
            type="single"
            value={viewMode}
            onValueChange={(value) => {
              if (value === 'grid' || value === 'list') {
                setViewMode(value)
              }
            }}
            className="gap-0 border rounded-md overflow-hidden"
          >
            <ToggleGroupItem
              value="grid"
              aria-label="Grid view"
              className="rounded-none border-0 data-[state=on]:bg-primary data-[state=on]:text-primary-foreground"
            >
              <LayoutGrid className="h-4 w-4" />
            </ToggleGroupItem>
            <ToggleGroupItem
              value="list"
              aria-label="List view"
              className="rounded-none border-0 data-[state=on]:bg-primary data-[state=on]:text-primary-foreground"
            >
              <TextAlignJustify className="h-4 w-4" />
            </ToggleGroupItem>
          </ToggleGroup>
        </div>
      </div>

      <div
        className={
          viewMode === 'grid'
            ? 'grid grid-cols-1 md:grid-cols-2 gap-4'
            : 'flex flex-col gap-4'
        }
      >
        {workspaces
          .filter((w) => {
            const q = searchQuery.trim().toLowerCase()
            if (!q) return true
            return (
              w.name.toLowerCase().includes(q) ||
              (w.description || '').toLowerCase().includes(q)
            )
          })
          .map((ws) => (
            <div
              key={ws.id}
              className="neo-card p-4 border-4 border-border bg-card"
            >
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-black text-lg">{ws.name}</h3>
                  <div className="text-sm text-muted-foreground">
                    {ws.description}
                  </div>
                  <div className="text-xs mt-2">
                    Members: <span className="font-bold">{ws.members}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
      </div>

      <Dialog open={openCreate} onOpenChange={() => setOpenCreate(false)}>
        <DialogContent className="neo-card max-w-md mx-auto p-6">
          <DialogHeader>
            <DialogTitle className="font-heading text-xl font-black">
              Create Workspace
            </DialogTitle>
            <DialogDescription className="text-sm text-muted-foreground">
              Create a new workspace to share expenses.
            </DialogDescription>
          </DialogHeader>

          <div className="mt-4 space-y-3">
            <div>
              <Label>Name</Label>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Penang Food Trip"
              />
            </div>
            <div>
              <Label>Members</Label>
              <Input
                value={membersCount}
                onChange={(e) => setMembersCount(e.target.value)}
              />
            </div>
            <div>
              <Label>Description</Label>
              <Input
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>

            <div className="flex gap-2 justify-end mt-4">
              <Button variant="outline" onClick={() => setOpenCreate(false)}>
                Cancel
              </Button>
              <Button
                onClick={handleCreate}
                className="neo-btn bg-primary text-primary-foreground"
              >
                Create
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
