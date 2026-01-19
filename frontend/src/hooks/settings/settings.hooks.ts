import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  getSettings,
  getSetting,
  createSetting,
  updateSetting,
  deleteSetting,
} from './settings.api'

interface UseSettingsParams {
  page: number
  pageSize: number
}

/**
 * Retrieves paginated list of settings
 * @param params Pagination parameters
 * @returns UseQueryResult with settings list
 */
export const useSettings = ({ page, pageSize }: UseSettingsParams) => {
  return useQuery({
    queryKey: ['settings', page, pageSize],
    queryFn: () => getSettings(page, pageSize),
  })
}

/**
 * Retrieves a single setting by ID
 * @param id Settings object ID
 * @returns UseQueryResult with single setting
 */
export const useSetting = (id: string) => {
  return useQuery({
    queryKey: ['settings', id],
    queryFn: () => getSetting(id),
    enabled: !!id,
  })
}

/**
 * Creates a new settings object
 * @returns Mutation hook for creating settings
 */
export const useCreateSetting = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: Record<string, any>) => createSetting(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['settings'] })
    },
  })
}

/**
 * Updates an existing settings object
 * @returns Mutation hook for updating settings
 */
export const useUpdateSetting = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Record<string, any> }) =>
      updateSetting(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['settings'] })
    },
  })
}

/**
 * Deletes a settings object
 * @returns Mutation hook for deleting settings
 */
export const useDeleteSetting = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => deleteSetting(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['settings'] })
    },
  })
}
