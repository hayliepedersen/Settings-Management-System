import { useState } from 'react'
import { Trash2, Edit2, Plus, X, Check } from 'lucide-react'
import {
  useSettings,
  useCreateSetting,
  useUpdateSetting,
  useDeleteSetting,
} from '../hooks/settings/settings.hooks'
import { Button } from '../components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '../components/ui/card'
import { Textarea } from '../components/ui/textarea'
import { Alert, AlertDescription } from '../components/ui/alert'
import { Badge } from '../components/ui/badge'

export default function SettingsManagement() {
  const { isLoading, data } = useSettings({ page: 1, pageSize: 100 })
  const createMutation = useCreateSetting()
  const updateMutation = useUpdateSetting()
  const deleteMutation = useDeleteSetting()

  const [error, setError] = useState<string | null>(null)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [jsonInput, setJsonInput] = useState('')
  const [editJsonInput, setEditJsonInput] = useState('')

  const handleCreate = async () => {
    try {
      const parsed = JSON.parse(jsonInput)
      await createMutation.mutateAsync(parsed)
      setShowCreateForm(false)
      setJsonInput('')
      setError(null)
    } catch (err) {
      setError('Invalid JSON or creation failed: ' + (err as Error).message)
    }
  }

  const handleUpdate = async (id: string) => {
    try {
      const parsed = JSON.parse(editJsonInput)
      await updateMutation.mutateAsync({ id, data: parsed })
      setEditingId(null)
      setEditJsonInput('')
      setError(null)
    } catch (err) {
      setError('Invalid JSON or update failed: ' + (err as Error).message)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this setting?')) return
    try {
      await deleteMutation.mutateAsync(id)
      setError(null)
    } catch (err) {
      setError('Failed to delete: ' + (err as Error).message)
    }
  }

  const startEdit = (setting: any) => {
    setEditingId(setting.id)
    setEditJsonInput(JSON.stringify(setting.data, null, 2))
  }

  const settings = data?.items || []

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground">
              Settings Management
            </h1>
          </div>
          <Button
            onClick={() => setShowCreateForm(!showCreateForm)}
            variant={showCreateForm ? 'outline' : 'default'}
          >
            {showCreateForm ? (
              <>
                <X className="mr-2 h-4 w-4" />
                Cancel
              </>
            ) : (
              <>
                <Plus className="mr-2 h-4 w-4" />
                New Setting
              </>
            )}
          </Button>
        </div>

        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertDescription className="flex justify-between items-center">
              {error}
              <Button variant="ghost" size="sm" onClick={() => setError(null)}>
                <X className="h-4 w-4" />
              </Button>
            </AlertDescription>
          </Alert>
        )}

        {showCreateForm && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Create New Setting</CardTitle>
              <CardDescription>Enter any valid JSON structure</CardDescription>
            </CardHeader>
            <CardContent>
              <Textarea
                value={jsonInput}
                onChange={(e) => setJsonInput(e.target.value)}
                className="font-mono text-sm h-40 resize-none"
                placeholder='{\n  "key": "value",\n  "nested": {\n    "example": true\n  }\n}'
              />
              <div className="flex gap-2 mt-4">
                <Button
                  onClick={handleCreate}
                  disabled={createMutation.isPending}
                >
                  <Check className="mr-2 h-4 w-4" />
                  {createMutation.isPending ? 'Creating...' : 'Create'}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setShowCreateForm(false)}
                >
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {isLoading ? (
          <Card>
            <CardContent className="py-12 text-center text-muted-foreground">
              Loading...
            </CardContent>
          </Card>
        ) : settings.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center text-muted-foreground">
              No settings yet. Click "New Setting" to create one.
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {settings.map((setting: any) => (
              <Card key={setting.id}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="font-mono text-xs">
                        {setting.id}
                      </Badge>
                    </div>
                    <div className="flex gap-1">
                      {editingId === setting.id ? (
                        <>
                          <Button
                            size="icon"
                            variant="ghost"
                            onClick={() => handleUpdate(setting.id)}
                            disabled={updateMutation.isPending}
                            className="text-green-600 hover:text-green-800 hover:bg-green-50"
                          >
                            <Check className="h-4 w-4" />
                          </Button>
                          <Button
                            size="icon"
                            variant="ghost"
                            onClick={() => setEditingId(null)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </>
                      ) : (
                        <>
                          <Button
                            size="icon"
                            variant="ghost"
                            onClick={() => startEdit(setting)}
                            className="text-blue-600 hover:text-blue-800 hover:bg-blue-50"
                          >
                            <Edit2 className="h-4 w-4" />
                          </Button>
                          <Button
                            size="icon"
                            variant="ghost"
                            onClick={() => handleDelete(setting.id)}
                            disabled={deleteMutation.isPending}
                            className="text-red-600 hover:text-red-800 hover:bg-red-50"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </>
                      )}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  {editingId === setting.id ? (
                    <Textarea
                      value={editJsonInput}
                      onChange={(e) => setEditJsonInput(e.target.value)}
                      className="font-mono text-sm h-40 resize-none"
                    />
                  ) : (
                    <pre className="bg-muted rounded-lg p-4 overflow-x-auto text-sm font-mono">
                      {JSON.stringify(setting.data, null, 2)}
                    </pre>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
