export interface MulterConfig {
  dest?: string
  allowedExt?: string[]
  allowedMimetype?: string[]
  limit?: {
    fieldSize?: number
    fileSize?: number
  }
}
