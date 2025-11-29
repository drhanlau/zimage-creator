'use client'

import { useEffect, useState } from 'react'
import { useSession, signOut } from 'next-auth/react'
import { useRouter } from 'next/navigation'

interface PromptLog {
  id: string
  userEmail: string
  prompt: string
  imageUrl: string | null
  status: string
  errorMessage: string | null
  generationTime: number | null
  createdAt: string
}

interface LogStats {
  success?: number
  failed?: number
  error?: number
}

interface LogsResponse {
  logs: PromptLog[]
  stats: LogStats
  totalLogs: number
}

export default function LogsPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [logsData, setLogsData] = useState<LogsResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<'all' | 'success' | 'failed' | 'error'>('all')

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/signin')
    }
  }, [status, router])

  useEffect(() => {
    fetchLogs()
  }, [])

  const fetchLogs = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/logs')
      if (response.ok) {
        const data = await response.json()
        setLogsData(data)
      }
    } catch (error) {
      console.error('Failed to fetch logs:', error)
    } finally {
      setLoading(false)
    }
  }

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-3 border-gray-300 rounded-full mx-auto mb-4">
            <div className="w-16 h-16 border-3 border-black rounded-full animate-spin border-t-transparent"></div>
          </div>
          <p className="text-gray-700 font-medium">Loading logs...</p>
        </div>
      </div>
    )
  }

  if (!session) {
    return null
  }

  const filteredLogs = logsData?.logs.filter(log =>
    filter === 'all' ? true : log.status === filter
  ) || []

  return (
    <main className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between h-14">
            <div className="flex items-center gap-3">
              <div className="w-7 h-7 bg-black rounded flex items-center justify-center">
                <span className="text-white font-bold text-sm">Z</span>
              </div>
              <h1 className="text-lg font-bold text-black">Prompt Logs</h1>
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={() => router.push('/')}
                className="px-4 py-1.5 bg-white border border-gray-300 text-black text-sm font-medium rounded hover:bg-gray-50 transition-colors"
              >
                Back to Generator
              </button>
              <span className="text-sm text-gray-600 font-medium">
                {session.user?.email}
              </span>
              <button
                onClick={() => signOut()}
                className="px-4 py-1.5 bg-white border border-gray-300 text-black text-sm font-medium rounded hover:bg-gray-50 transition-colors"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white border border-gray-300 rounded-lg p-6">
            <div className="text-sm text-gray-500 font-medium mb-1">Total Prompts</div>
            <div className="text-3xl font-bold text-black">{logsData?.totalLogs || 0}</div>
          </div>
          <div className="bg-white border border-gray-300 rounded-lg p-6">
            <div className="text-sm text-gray-500 font-medium mb-1">Successful</div>
            <div className="text-3xl font-bold text-green-600">{logsData?.stats.success || 0}</div>
          </div>
          <div className="bg-white border border-gray-300 rounded-lg p-6">
            <div className="text-sm text-gray-500 font-medium mb-1">Failed</div>
            <div className="text-3xl font-bold text-orange-600">{logsData?.stats.failed || 0}</div>
          </div>
          <div className="bg-white border border-gray-300 rounded-lg p-6">
            <div className="text-sm text-gray-500 font-medium mb-1">Errors</div>
            <div className="text-3xl font-bold text-red-600">{logsData?.stats.error || 0}</div>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-2 mb-6">
          {['all', 'success', 'failed', 'error'].map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status as typeof filter)}
              className={`px-4 py-2 text-sm font-medium rounded transition-colors ${
                filter === status
                  ? 'bg-black text-white'
                  : 'bg-white border border-gray-300 text-black hover:bg-gray-50'
              }`}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </button>
          ))}
          <button
            onClick={fetchLogs}
            className="ml-auto px-4 py-2 bg-white border border-gray-300 text-black text-sm font-medium rounded hover:bg-gray-50 transition-colors flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Refresh
          </button>
        </div>

        {/* Logs Table */}
        <div className="bg-white border border-gray-300 rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-300">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-bold text-black uppercase tracking-wider">
                    Time
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-black uppercase tracking-wider">
                    User
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-black uppercase tracking-wider">
                    Prompt
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-black uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-black uppercase tracking-wider">
                    Duration
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-black uppercase tracking-wider">
                    Image
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredLogs.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-8 text-center text-gray-500 font-medium">
                      No logs found
                    </td>
                  </tr>
                ) : (
                  filteredLogs.map((log) => (
                    <tr key={log.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 font-medium">
                        {new Date(log.createdAt).toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 font-medium">
                        {log.userEmail}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900 font-medium max-w-md">
                        <div className="truncate" title={log.prompt}>
                          {log.prompt}
                        </div>
                        {log.errorMessage && (
                          <div className="text-xs text-red-600 mt-1">{log.errorMessage}</div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex px-2 py-1 text-xs font-bold rounded ${
                            log.status === 'success'
                              ? 'bg-green-100 text-green-800'
                              : log.status === 'failed'
                              ? 'bg-orange-100 text-orange-800'
                              : 'bg-red-100 text-red-800'
                          }`}
                        >
                          {log.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 font-medium">
                        {log.generationTime ? `${log.generationTime.toFixed(1)}s` : '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        {log.imageUrl ? (
                          <a
                            href={log.imageUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-black hover:underline font-medium flex items-center gap-1"
                          >
                            View
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                            </svg>
                          </a>
                        ) : (
                          <span className="text-gray-400 font-medium">-</span>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Footer Note */}
        <div className="mt-6 text-center text-sm text-gray-500 font-medium">
          Showing {filteredLogs.length} of {logsData?.totalLogs || 0} total logs
        </div>
      </div>
    </main>
  )
}

