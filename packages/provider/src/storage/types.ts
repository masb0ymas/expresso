import { S3 } from '@aws-sdk/client-s3'
import { Storage as GoogleCloudStorage } from '@google-cloud/storage'
import fs from 'fs'
import * as Minio from 'minio'

export interface DtoExpiresObject {
  expiresIn: number
  expiryDate: Date
}

export type StorageType = 's3' | 'gcs' | 'minio'
export type StorageExpires = '1d' | '2d' | '3d' | '4d' | '5d' | '6d' | '7d'

// return type google cloud storage
export type TypeGCS = GoogleCloudStorage

// return type aws s3
export type TypeS3 = S3

// return type minio
export type TypeMinio = Minio.Client

export interface StorageOptions {
  useSSL?: boolean
  filePath?: fs.PathLike | string
}

export interface StorageProviderEntity {
  provider: StorageType
  accessKey: string
  secretKey?: string
  region: string
  bucket: string
  expires: StorageExpires
  host?: string | null
  port?: number
  options?: StorageOptions
}

export interface FileAttributes {
  fieldname: string
  originalname: string
  encoding: string
  mimetype: string
  destination: string
  filename: string
  path: string
  size: number
}

export type FileInstance = Record<string, FileAttributes>
