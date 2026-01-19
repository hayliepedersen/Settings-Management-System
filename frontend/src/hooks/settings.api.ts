import api from './api'
import type { SettingsList, SettingsResponse } from '../types/settings'

/**
 * Fetches paginated list of all settings
 * @param page Page number (1-indexed)
 * @param pageSize Number of items per page
 * @returns Paginated settings list with metadata
 */
export const getSettings = async (
  page: number,
  pageSize: number
): Promise<SettingsList> => {
  const { data } = await api.get('/settings', {
    params: { page, page_size: pageSize },
  })
  return data
}

/**
 * Fetches a single setting by ID
 * @param id Settings object ID
 * @returns Single settings object
 */
export const getSetting = async (id: string): Promise<SettingsResponse> => {
  const { data } = await api.get(`/settings/${id}`)
  return data
}

/**
 * Creates a new settings object
 * @param settingsData Schemaless JSON data to store
 * @returns Created settings object with generated ID
 */
export const createSetting = async (
  settingsData: Record<string, any>
): Promise<SettingsResponse> => {
  const { data } = await api.post('/settings', { data: settingsData })
  return data
}

/**
 * Updates an existing settings object
 * @param id Settings object ID
 * @param settingsData New JSON data to replace existing data
 * @returns Updated settings object
 */
export const updateSetting = async (
  id: string,
  settingsData: Record<string, any>
): Promise<SettingsResponse> => {
  const { data } = await api.put(`/settings/${id}`, { data: settingsData })
  return data
}

/**
 * Deletes a settings object (idempotent)
 * @param id Settings object ID
 */
export const deleteSetting = async (id: string): Promise<void> => {
  await api.delete(`/settings/${id}`)
}
