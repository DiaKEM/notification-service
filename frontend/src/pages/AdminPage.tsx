import { useEffect, useState } from 'react'
import { Activity, CheckCircle2, Database, Eye, EyeOff, Loader2, RefreshCw, Send, Trash2, XCircle } from 'lucide-react'
import {
  useGetAdminConfigQuery,
  useUpdateNightscoutMutation,
  useUpdatePushoverMutation,
  useUpdateTelegramMutation,
  useTestConnectionMutation,
  useGetDatabaseStatsQuery,
  useDeleteJobExecutionsMutation,
  useGetSchedulerConfigQuery,
  useUpdateSchedulerMutation,
  type ServiceKey,
} from '@/features/admin/adminApi'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'

// ─── secret input ─────────────────────────────────────────────────────────────

function SecretInput({
  id,
  placeholder,
  value,
  onChange,
}: {
  id: string
  placeholder?: string
  value: string
  onChange: (v: string) => void
}) {
  const [visible, setVisible] = useState(false)
  return (
    <div className="relative">
      <Input
        id={id}
        type={visible ? 'text' : 'password'}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="pr-9"
      />
      <button
        type="button"
        onClick={() => setVisible((v) => !v)}
        className="absolute inset-y-0 right-0 flex items-center px-2.5 text-muted-foreground hover:text-foreground"
        aria-label={visible ? 'Hide' : 'Show'}
      >
        {visible ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
      </button>
    </div>
  )
}

// ─── tabs ─────────────────────────────────────────────────────────────────────

type Tab = ServiceKey | 'scheduler' | 'database'

const TABS: { key: Tab; label: string }[] = [
  { key: 'nightscout', label: 'Nightscout' },
  { key: 'pushover',   label: 'Pushover' },
  { key: 'telegram',   label: 'Telegram' },
  { key: 'scheduler',  label: 'Scheduler' },
  { key: 'database',   label: 'Database' },
]

// ─── connection status ────────────────────────────────────────────────────────

type TestStatus = 'idle' | 'testing' | 'ok' | 'error'

function ConnectionBadge({ status }: { status: TestStatus }) {
  if (status === 'idle') return null
  if (status === 'testing')
    return (
      <span className="inline-flex items-center gap-1.5 text-sm text-muted-foreground">
        <Loader2 className="h-4 w-4 animate-spin" /> Testing…
      </span>
    )
  if (status === 'ok')
    return (
      <span className="inline-flex items-center gap-1.5 text-sm text-green-600">
        <CheckCircle2 className="h-4 w-4" /> Connected
      </span>
    )
  return (
    <span className="inline-flex items-center gap-1.5 text-sm text-destructive">
      <XCircle className="h-4 w-4" /> Connection failed
    </span>
  )
}

// ─── nightscout panel ─────────────────────────────────────────────────────────

function NightscoutPanel({
  initial,
  testStatus,
  onTest,
}: {
  initial: { url: string; apiKey: string }
  testStatus: TestStatus
  onTest: (config: Record<string, string>) => void
}) {
  const [url, setUrl] = useState(initial.url)
  const [apiKey, setApiKey] = useState(initial.apiKey)
  const [updateNightscout, { isLoading, isSuccess }] = useUpdateNightscoutMutation()

  useEffect(() => { setUrl(initial.url); setApiKey(initial.apiKey) }, [initial.url, initial.apiKey])

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    await updateNightscout({ url, apiKey })
  }

  return (
    <form onSubmit={handleSave} className="flex flex-col gap-4">
      <p className="text-sm text-muted-foreground">
        Nightscout is the data source for all monitoring jobs.
      </p>
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="ns-url">Nightscout URL</Label>
        <Input
          id="ns-url"
          type="url"
          placeholder="https://your-nightscout.example.com"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
        />
      </div>
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="ns-key">API Key</Label>
        <SecretInput
          id="ns-key"
          placeholder="your_api_secret"
          value={apiKey}
          onChange={setApiKey}
        />
      </div>
      <div className="flex items-center gap-3 pt-2">
        <Button type="submit" size="sm" disabled={isLoading}>
          {isLoading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Saving…</> : 'Save'}
        </Button>
        {isSuccess && !isLoading && (
          <span className="text-sm text-green-600">Saved</span>
        )}
        <div className="ml-auto flex items-center gap-3">
          <ConnectionBadge status={testStatus} />
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="gap-2"
            onClick={() => onTest({ url, apiKey })}
            disabled={testStatus === 'testing'}
          >
            <Activity className="h-4 w-4" />
            Test connection
          </Button>
        </div>
      </div>
    </form>
  )
}

// ─── pushover panel ───────────────────────────────────────────────────────────

function PushoverPanel({
  initial,
  testStatus,
  onTest,
}: {
  initial: { appToken: string; userKey: string }
  testStatus: TestStatus
  onTest: (config: Record<string, string>) => void
}) {
  const [appToken, setAppToken] = useState(initial.appToken)
  const [userKey, setUserKey] = useState(initial.userKey)
  const [updatePushover, { isLoading, isSuccess }] = useUpdatePushoverMutation()

  useEffect(() => { setAppToken(initial.appToken); setUserKey(initial.userKey) }, [initial.appToken, initial.userKey])

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    await updatePushover({ appToken, userKey })
  }

  return (
    <form onSubmit={handleSave} className="flex flex-col gap-4">
      <p className="text-sm text-muted-foreground">
        Pushover delivers push notifications to your devices.
      </p>
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="po-token">App Token</Label>
        <SecretInput
          id="po-token"
          placeholder="your_app_token"
          value={appToken}
          onChange={setAppToken}
        />
      </div>
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="po-user">User Key</Label>
        <SecretInput
          id="po-user"
          placeholder="your_user_key"
          value={userKey}
          onChange={setUserKey}
        />
      </div>
      <div className="flex items-center gap-3 pt-2">
        <Button type="submit" size="sm" disabled={isLoading}>
          {isLoading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Saving…</> : 'Save'}
        </Button>
        {isSuccess && !isLoading && (
          <span className="text-sm text-green-600">Saved</span>
        )}
        <div className="ml-auto flex items-center gap-3">
          <ConnectionBadge status={testStatus} />
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="gap-2"
            onClick={() => onTest({ appToken, userKey })}
            disabled={testStatus === 'testing'}
          >
            <Send className="h-4 w-4" />
            Test connection
          </Button>
        </div>
      </div>
    </form>
  )
}

// ─── telegram panel ───────────────────────────────────────────────────────────

function TelegramPanel({
  initial,
  testStatus,
  onTest,
}: {
  initial: { botToken: string; chatId: string }
  testStatus: TestStatus
  onTest: (config: Record<string, string>) => void
}) {
  const [botToken, setBotToken] = useState(initial.botToken)
  const [chatId, setChatId] = useState(initial.chatId)
  const [updateTelegram, { isLoading, isSuccess }] = useUpdateTelegramMutation()

  useEffect(() => { setBotToken(initial.botToken); setChatId(initial.chatId) }, [initial.botToken, initial.chatId])

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    await updateTelegram({ botToken, chatId })
  }

  return (
    <form onSubmit={handleSave} className="flex flex-col gap-4">
      <p className="text-sm text-muted-foreground">
        Telegram delivers notifications via a bot to a chat or group.
      </p>
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="tg-token">Bot Token</Label>
        <SecretInput
          id="tg-token"
          placeholder="123456:ABC-DEF…"
          value={botToken}
          onChange={setBotToken}
        />
      </div>
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="tg-chat">Chat ID</Label>
        <Input
          id="tg-chat"
          placeholder="-1001234567890"
          value={chatId}
          onChange={(e) => setChatId(e.target.value)}
        />
      </div>
      <div className="flex items-center gap-3 pt-2">
        <Button type="submit" size="sm" disabled={isLoading}>
          {isLoading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Saving…</> : 'Save'}
        </Button>
        {isSuccess && !isLoading && (
          <span className="text-sm text-green-600">Saved</span>
        )}
        <div className="ml-auto flex items-center gap-3">
          <ConnectionBadge status={testStatus} />
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="gap-2"
            onClick={() => onTest({ botToken, chatId })}
            disabled={testStatus === 'testing'}
          >
            <Send className="h-4 w-4" />
            Test connection
          </Button>
        </div>
      </div>
    </form>
  )
}

// ─── scheduler panel ──────────────────────────────────────────────────────────

function SchedulerPanel() {
  const { data, isLoading, isError } = useGetSchedulerConfigQuery()
  const [updateScheduler, { isLoading: isSaving, isSuccess }] = useUpdateSchedulerMutation()
  const [expression, setExpression] = useState('')

  useEffect(() => {
    if (data) setExpression(data.expression)
  }, [data])

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    await updateScheduler(expression)
  }

  const nextRun = data?.nextRun
    ? new Intl.DateTimeFormat(undefined, { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(data.nextRun))
    : null

  return (
    <form onSubmit={handleSave} className="flex flex-col gap-4">
      <p className="text-sm text-muted-foreground">
        Configure the cron expression for the automated job runner. Changes take effect immediately
        without a restart. The expression uses a 6-field format:{' '}
        <code className="rounded bg-muted px-1 py-0.5 text-xs">seconds minutes hours day month weekday</code>.
      </p>

      {isLoading ? (
        <p className="text-sm text-muted-foreground">Loading…</p>
      ) : isError ? (
        <p className="text-sm text-destructive">Failed to load scheduler config.</p>
      ) : (
        <>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="cron-expr">Cron Expression</Label>
            <Input
              id="cron-expr"
              className="font-mono"
              placeholder="0 */15 * * * *"
              value={expression}
              onChange={(e) => setExpression(e.target.value)}
            />
          </div>

          <div className="rounded-md border bg-muted/30 px-4 py-3 text-sm">
            <span className="text-muted-foreground">Next run: </span>
            <span className="font-medium">{nextRun ?? '—'}</span>
          </div>

          <div className="flex items-center gap-3 pt-1">
            <Button type="submit" size="sm" disabled={isSaving || !expression}>
              {isSaving ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Saving…</> : 'Save & apply'}
            </Button>
            {isSuccess && !isSaving && (
              <span className="text-sm text-green-600">Applied</span>
            )}
          </div>
        </>
      )}
    </form>
  )
}

// ─── stat card ────────────────────────────────────────────────────────────────

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-1 rounded-lg border bg-muted/30 px-4 py-3">
      <span className="text-xs font-medium text-muted-foreground">{label}</span>
      <span className="text-lg font-semibold tabular-nums">{value}</span>
    </div>
  )
}

// ─── database panel ───────────────────────────────────────────────────────────

function DatabasePanel() {
  const { data: stats, isLoading, isError, refetch, isFetching } = useGetDatabaseStatsQuery()
  const [deleteJobExecutions, { isLoading: isDeleting }] = useDeleteJobExecutionsMutation()

  const [beforeDate, setBeforeDate] = useState('')
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [lastResult, setLastResult] = useState<number | null>(null)

  const handleDelete = async () => {
    setConfirmOpen(false)
    const result = await deleteJobExecutions(new Date(beforeDate).toISOString()).unwrap()
    setLastResult(result.deletedCount)
    setBeforeDate('')
  }

  return (
    <div className="flex flex-col gap-6">
      {/* DB stats */}
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold">Database Overview</h2>
          <Button variant="ghost" size="sm" onClick={() => refetch()} disabled={isFetching} className="gap-1.5 text-muted-foreground">
            <RefreshCw className={cn('h-3.5 w-3.5', isFetching && 'animate-spin')} />
            Refresh
          </Button>
        </div>

        {isLoading ? (
          <p className="text-sm text-muted-foreground">Loading stats…</p>
        ) : isError ? (
          <p className="text-sm text-destructive">Failed to load database stats.</p>
        ) : stats ? (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            <StatCard label="Total size" value={`${stats.totalSizeMb} MB`} />
            <StatCard label="Storage size" value={`${stats.storageSizeMb} MB`} />
            <StatCard label="Collections" value={String(stats.collections)} />
            <StatCard label="Job executions" value={String(stats.jobExecutions.count)} />
          </div>
        ) : null}
      </div>

      <div className="border-t" />

      {/* Delete section */}
      <div className="flex flex-col gap-3">
        <div>
          <h2 className="text-sm font-semibold">Archive Job Executions</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Permanently delete all job execution entries older than the selected date.
          </p>
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="before-date">Delete entries older than</Label>
          <input
            id="before-date"
            type="date"
            className="h-9 w-48 rounded-md border border-input bg-background px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            value={beforeDate}
            onChange={(e) => { setBeforeDate(e.target.value); setLastResult(null) }}
          />
        </div>
        <div className="flex items-center gap-4">
          <Button
            variant="destructive"
            size="sm"
            className="gap-2"
            disabled={!beforeDate || isDeleting}
            onClick={() => setConfirmOpen(true)}
          >
            <Trash2 className="h-4 w-4" />
            Delete entries
          </Button>
          {lastResult !== null && (
            <span className="text-sm text-muted-foreground">
              <Database className="mr-1 inline h-3.5 w-3.5" />
              {lastResult === 0 ? 'No entries deleted.' : `${lastResult} entr${lastResult === 1 ? 'y' : 'ies'} deleted.`}
            </span>
          )}
        </div>
      </div>

      {/* Confirmation dialog */}
      <Dialog open={confirmOpen} onOpenChange={(v) => !v && setConfirmOpen(false)}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Delete Job Executions</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">
            This will permanently delete all job execution entries older than{' '}
            <span className="font-medium text-foreground">
              {beforeDate ? new Intl.DateTimeFormat(undefined, { dateStyle: 'long' }).format(new Date(beforeDate)) : ''}
            </span>
            . This action cannot be undone.
          </p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setConfirmOpen(false)}>Cancel</Button>
            <Button variant="destructive" onClick={handleDelete} disabled={isDeleting}>
              {isDeleting ? 'Deleting…' : 'Delete'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

// ─── main page ────────────────────────────────────────────────────────────────

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState<Tab>('nightscout')
  const [testStatuses, setTestStatuses] = useState<Record<ServiceKey, TestStatus>>({
    nightscout: 'idle',
    pushover: 'idle',
    telegram: 'idle',
  })

  const { data: config, isLoading, isError } = useGetAdminConfigQuery()
  const [testConnection] = useTestConnectionMutation()

  const handleTest = async (service: ServiceKey, config: Record<string, string>) => {
    setTestStatuses((s) => ({ ...s, [service]: 'testing' }))
    try {
      const result = await testConnection({ service, config }).unwrap()
      setTestStatuses((s) => ({ ...s, [service]: result.ok ? 'ok' : 'error' }))
    } catch {
      setTestStatuses((s) => ({ ...s, [service]: 'error' }))
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold tracking-tight">Administration</h1>
        <p className="text-muted-foreground">
          Configure service integrations. Changes take effect immediately without a restart.
        </p>
      </div>

      {isLoading ? (
        <p className="text-sm text-muted-foreground">Loading configuration…</p>
      ) : isError ? (
        <p className="text-sm text-destructive">Failed to load configuration.</p>
      ) : config ? (
        <div className="rounded-lg border">
          {/* Tab bar */}
          <div className="flex border-b">
            {TABS.map(({ key, label }) => (
              <button
                key={key}
                onClick={() => setActiveTab(key)}
                className={cn(
                  'px-5 py-3 text-sm font-medium transition-colors',
                  activeTab === key
                    ? 'border-b-2 border-primary text-foreground'
                    : 'text-muted-foreground hover:text-foreground'
                )}
              >
                {label}
              </button>
            ))}
          </div>

          {/* Panel */}
          <div className={cn('p-6', activeTab !== 'database' && 'max-w-lg')}>
            {activeTab === 'database' && <DatabasePanel />}
            {activeTab === 'scheduler' && <SchedulerPanel />}
            {activeTab === 'nightscout' && (
              <NightscoutPanel
                initial={config.nightscout}
                testStatus={testStatuses.nightscout}
                onTest={(cfg) => handleTest('nightscout', cfg)}
              />
            )}
            {activeTab === 'pushover' && (
              <PushoverPanel
                initial={config.pushover}
                testStatus={testStatuses.pushover}
                onTest={(cfg) => handleTest('pushover', cfg)}
              />
            )}
            {activeTab === 'telegram' && (
              <TelegramPanel
                initial={config.telegram}
                testStatus={testStatuses.telegram}
                onTest={(cfg) => handleTest('telegram', cfg)}
              />
            )}
          </div>
        </div>
      ) : null}
    </div>
  )
}
