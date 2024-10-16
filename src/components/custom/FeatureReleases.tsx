'use client'

import { useState } from 'react'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Chart } from 'react-google-charts'
import { Badge } from '@/components/ui/badge'
import { Pencil, Plus, Download } from 'lucide-react'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { Calendar } from '@/components/ui/calendar'
import * as XLSX from 'xlsx'
import { saveAs } from 'file-saver'

type Feature = {
  id: string
  name: string
  start: Date
  end: Date
  stage: 'Planned' | 'In Progress' | 'Completed'
  team: string
  status: string
  link: string
}

const stageColors = {
  Planned: '#3b82f6', // Blue
  'In Progress': '#f59e0b', // Amber
  Completed: '#10b981', // Emerald
}

export default function FeatureReleaseGantt() {
  const [features, setFeatures] = useState<Feature[]>([])
  const [newFeature, setNewFeature] = useState<Omit<Feature, 'id'>>({
    name: '',
    start: new Date(),
    end: new Date(),
    stage: 'Planned',
    team: '',
    status: 'Feature Flag',
    link: '',
  })
  const [editingFeature, setEditingFeature] = useState<string | null>(null)
  const [flags, setFlags] = useState<string[]>([
    'Feature Flag',
    'Testing',
    'Released',
  ])
  const [newFlag, setNewFlag] = useState('')

  const addFeature = () => {
    const feature: Feature = {
      ...newFeature,
      id: Date.now().toString(),
    }
    setFeatures([...features, feature])
    setNewFeature({
      name: '',
      start: new Date(),
      end: new Date(),
      stage: 'Planned',
      team: '',
      status: 'Feature Flag',
      link: '',
    })
  }

  const editFeature = (id: string) => {
    setEditingFeature(id)
    const feature = features.find((f) => f.id === id)
    if (feature) {
      setNewFeature({ ...feature })
    }
  }

  const updateFeature = () => {
    setFeatures(
      features.map((f) =>
        f.id === editingFeature ? { ...newFeature, id: f.id } : f
      )
    )
    setEditingFeature(null)
    setNewFeature({
      name: '',
      start: new Date(),
      end: new Date(),
      stage: 'Planned',
      team: '',
      status: 'Feature Flag',
      link: '',
    })
  }

  const addFlag = () => {
    if (newFlag && !flags.includes(newFlag)) {
      setFlags([...flags, newFlag])
      setNewFlag('')
    }
  }

  const exportToExcel = () => {
    // Create workbook and worksheet
    const wb = XLSX.utils.book_new()
    const ws = XLSX.utils.json_to_sheet(
      features.map((f) => ({
        ...f,
        start: f.start.toISOString().split('T')[0],
        end: f.end.toISOString().split('T')[0],
      }))
    )

    // Add worksheet to workbook
    XLSX.utils.book_append_sheet(wb, ws, 'Features')

    // Create a new worksheet for the Gantt chart
    const wsChart = XLSX.utils.aoa_to_sheet([
      ['Feature', 'Start', 'End', 'Duration'],
      ...features.map((f) => [
        f.name,
        f.start.toISOString().split('T')[0],
        f.end.toISOString().split('T')[0],
        {
          t: 'n',
          f: `=NETWORKDAYS(B${features.indexOf(f) + 2},C${
            features.indexOf(f) + 2
          })`,
        },
      ]),
    ])

    // Add the chart worksheet to the workbook
    XLSX.utils.book_append_sheet(wb, wsChart, 'Gantt Chart')

    // Add chart to the workbook
    const chartData = {
      type: 'bar',
      data: {
        labels: features.map((f) => f.name),
        datasets: [
          {
            data: features.map((_, i) => ({
              t: 'n',
              f: `Gantt Chart!D${i + 2}`,
            })),
            backgroundColor: features.map((f) => stageColors[f.stage]),
          },
        ],
      },
      options: {
        title: { text: 'Feature Timeline' },
        scales: {
          xAxes: [{ stacked: true }],
          yAxes: [{ stacked: true }],
        },
      },
    }

    wb.Sheets['Gantt Chart']['!charts'] = [
      { type: 'bar', name: 'FeatureGantt', chart: chartData },
    ]

    // Generate Excel file
    const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'binary' })

    // Convert to Blob and save
    const blob = new Blob([s2ab(wbout)], { type: 'application/octet-stream' })
    saveAs(blob, 'feature_release_gantt.xlsx')
  }

  // Helper function to convert string to ArrayBuffer
  function s2ab(s: string) {
    const buf = new ArrayBuffer(s.length)
    const view = new Uint8Array(buf)
    for (let i = 0; i < s.length; i++) view[i] = s.charCodeAt(i) & 0xff
    return buf
  }

  const chartData = [
    [
      { type: 'string', label: 'Feature ID' },
      { type: 'string', label: 'Feature Name' },
      { type: 'string', label: 'Team' },
      { type: 'date', label: 'Start Date' },
      { type: 'date', label: 'End Date' },
      { type: 'number', label: 'Duration' },
      { type: 'number', label: 'Percent Complete' },
      { type: 'string', label: 'Dependencies' },
    ],
    ...features.map((feature) => [
      feature.id,
      `${feature.name}\n${feature.team}`,
      feature.team,
      feature.start,
      feature.end,
      null,
      feature.stage === 'Completed'
        ? 100
        : feature.stage === 'In Progress'
        ? 50
        : 0,
      null,
    ]),
  ]

  return (
    <Card className="w-[90vw] mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">
          Feature Release Gantt Chart
        </CardTitle>
        <CardDescription>
          Track the progress of feature releases
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="featureName">Feature Name</Label>
              <Input
                id="featureName"
                value={newFeature.name}
                onChange={(e) =>
                  setNewFeature({ ...newFeature, name: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="team">Team</Label>
              <Input
                id="team"
                value={newFeature.team}
                onChange={(e) =>
                  setNewFeature({ ...newFeature, team: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="link">Feature Link</Label>
              <Input
                id="link"
                value={newFeature.link}
                onChange={(e) =>
                  setNewFeature({ ...newFeature, link: e.target.value })
                }
                placeholder="https://example.com/feature"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="startDate">Start Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={`w-full justify-start text-left font-normal ${
                      !newFeature.start && 'text-muted-foreground'
                    }`}
                  >
                    {newFeature.start
                      ? newFeature.start.toDateString()
                      : 'Pick a date'}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={newFeature.start}
                    onSelect={(date) =>
                      setNewFeature({
                        ...newFeature,
                        start: date || new Date(),
                      })
                    }
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
            <div className="space-y-2">
              <Label htmlFor="endDate">End Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={`w-full justify-start text-left font-normal ${
                      !newFeature.end && 'text-muted-foreground'
                    }`}
                  >
                    {newFeature.end
                      ? newFeature.end.toDateString()
                      : 'Pick a date'}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={newFeature.end}
                    onSelect={(date) =>
                      setNewFeature({ ...newFeature, end: date || new Date() })
                    }
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
            <div className="space-y-2">
              <Label htmlFor="stage">Stage</Label>
              <Select
                value={newFeature.stage}
                onValueChange={(
                  value: 'Planned' | 'In Progress' | 'Completed'
                ) => setNewFeature({ ...newFeature, stage: value })}
              >
                <SelectTrigger id="stage">
                  <SelectValue placeholder="Select stage" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Planned">Planned</SelectItem>
                  <SelectItem value="In Progress">In Progress</SelectItem>
                  <SelectItem value="Completed">Completed</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select
                value={newFeature.status}
                onValueChange={(value: string) =>
                  setNewFeature({ ...newFeature, status: value })
                }
              >
                <SelectTrigger id="status">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  {flags.map((flag) => (
                    <SelectItem key={flag} value={flag}>
                      {flag}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="newFlag">Add New Flag</Label>
              <div className="flex space-x-2">
                <Input
                  id="newFlag"
                  value={newFlag}
                  onChange={(e) => setNewFlag(e.target.value)}
                  placeholder="New flag name"
                />
                <Button onClick={addFlag} size="icon">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
          <Button
            onClick={editingFeature ? updateFeature : addFeature}
            className="w-full"
          >
            {editingFeature ? 'Update Feature' : 'Add Feature'}
          </Button>
        </div>
        <div className="mt-8">
          <Chart
            width={'100%'}
            height={'400px'}
            chartType="Gantt"
            loader={<div>Loading Chart</div>}
            data={chartData}
            options={{
              height: 400,
              gantt: {
                trackHeight: 50,
                barCornerRadius: 4,
                labelStyle: {
                  fontName: 'Inter',
                  fontSize: 12,
                },
                palette: [
                  {
                    color: stageColors.Planned,
                    dark: stageColors.Planned,
                    light: stageColors.Planned,
                  },
                  {
                    color: stageColors['In Progress'],
                    dark: stageColors['In Progress'],
                    light: stageColors['In Progress'],
                  },
                  {
                    color: stageColors.Completed,
                    dark: stageColors.Completed,
                    light: stageColors.Completed,
                  },
                ],
              },
              backgroundColor: 'transparent',
            }}
          />
        </div>
        <div className="mt-4 flex justify-between items-center">
          <div className="flex space-x-4">
            {Object.entries(stageColors).map(([stage, color]) => (
              <Badge
                key={stage}
                style={{ backgroundColor: color }}
                className="text-white"
              >
                {stage}
              </Badge>
            ))}
          </div>
          <Button onClick={exportToExcel} variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export to Excel (with Chart)
          </Button>
        </div>
        <div className="mt-8">
          <h3 className="text-lg font-semibold mb-4">Feature List</h3>
          <div className="space-y-2">
            {features.map((feature) => (
              <div
                key={feature.id}
                className="flex items-center justify-between p-2 bg-gray-100 rounded"
              >
                <div>
                  <span className="font-medium">{feature.name}</span>
                  <span className="ml-2 text-sm text-gray-500">
                    ({feature.status})
                  </span>
                  {feature.link && (
                    <a
                      href={feature.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="ml-2 text-blue-500 hover:underline"
                    >
                      Link
                    </a>
                  )}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => editFeature(feature.id)}
                >
                  <Pencil className="h-4 w-4 mr-2" />
                  Edit
                </Button>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
