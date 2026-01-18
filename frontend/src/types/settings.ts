export interface SettingsResponse {
  id: string
  data: Record<string, any>
}

export interface SettingsList {
  items: SettingsResponse[]
  total: number
  page: number
  page_size: number
}