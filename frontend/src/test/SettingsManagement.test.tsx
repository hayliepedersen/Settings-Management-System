import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { BrowserRouter } from 'react-router-dom'
import SettingsManagement from '../pages/SettingsManagement'
import * as settingsHooks from '../hooks/settings/settings.hooks'

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  })

  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>{children}</BrowserRouter>
    </QueryClientProvider>
  )
}

describe('SettingsManagement', () => {
  it('renders the page title', () => {
    vi.spyOn(settingsHooks, 'useSettings').mockReturnValue({
      isLoading: false,
      data: { items: [], total: 0, page: 1, page_size: 10 },
      error: null,
      refetch: vi.fn(),
    } as any)

    render(<SettingsManagement />, { wrapper: createWrapper() })

    expect(screen.getByText('Settings Management')).toBeInTheDocument()
  })

  it('displays settings when loaded', () => {
    const mockData = {
      items: [{ id: '123', data: { theme: 'dark' } }],
      total: 1,
      page: 1,
      page_size: 10,
    }

    vi.spyOn(settingsHooks, 'useSettings').mockReturnValue({
      isLoading: false,
      data: mockData,
      error: null,
      refetch: vi.fn(),
    } as any)

    render(<SettingsManagement />, { wrapper: createWrapper() })

    expect(screen.getByText(/123/)).toBeInTheDocument()
  })
})
