import {
  GetBucketAclCommand,
  GetObjectCommand,
  PutObjectCommand,
  S3,
  type PutObjectCommandOutput,
} from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
import {
  Storage as GoogleCloudStorage,
  type GetSignedUrlConfig,
  type UploadOptions,
  type UploadResponse,
} from '@google-cloud/storage'
import chalk from 'chalk'
import { addDays } from 'date-fns'
import { ms, printLog } from 'expresso-core'
import fs from 'fs'
import * as Minio from 'minio'
import path from 'path'
import { type FileAttributes } from './interface'

interface DtoExpiresObject {
  expiresIn: number
  expiryDate: Date
}

export type StorageType = 's3' | 'gcp' | 'minio'
export type StorageExpires = '1d' | '2d' | '3d' | '4d' | '5d' | '6d' | '7d'

interface StorageOptions {
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
  port?: number | null
  options?: StorageOptions
}

export class StorageProvider {
  private readonly _provider: StorageType | string
  private readonly _accessKey: string
  private readonly _secretKey?: string
  private readonly _region: string
  private readonly _bucket: string
  private readonly _expires: StorageExpires | string
  private readonly _host?: string | null
  private readonly _port?: number | null
  private readonly _options?: StorageOptions

  private readonly _clientS3: S3 | undefined
  private readonly _clientMinio: Minio.Client | undefined
  private readonly _clientGCS: GoogleCloudStorage | undefined

  constructor(params: StorageProviderEntity) {
    // check storage type
    this._provider = params.provider
    this._accessKey = params.accessKey
    this._secretKey = params?.secretKey
    this._region = params.region
    this._bucket = params.bucket
    this._expires = params.expires
    this._host = params.host
    this._port = params.port
    this._options = params.options

    // config client Aws S3
    if (this._provider === 's3') {
      this._clientS3 = new S3({
        credentials: {
          accessKeyId: this._accessKey,
          secretAccessKey: String(this._secretKey),
        },
        region: this._region,
      })
    }

    // config client Minio
    if (this._provider === 'minio') {
      this._clientMinio = new Minio.Client({
        endPoint: this._host ?? '127.0.0.1',
        port: this._port ?? 9000,
        accessKey: this._accessKey,
        secretKey: String(this._secretKey),
        region: this._region,
        useSSL: this._options?.useSSL ?? false,
      })
    }

    // config client Google Cloud Storage
    if (this._provider === 'gcs') {
      const msgType = 'Google Cloud Storage'
      const projectId = this._accessKey

      // ./your_path/serviceAccount.json
      const serviceAccountPath = path.resolve(
        `${process.cwd()}/${this._options?.filePath}`
      )

      if (!projectId && !fs.existsSync(serviceAccountPath)) {
        const message = 'serviceAccount is missing on root directory'
        const logMessage = printLog(msgType, message, { label: 'error' })

        console.log(logMessage)

        throw new Error(
          'Missing GCP Service Account!!!\nCopy gcp-serviceAccount from your console google to root directory "gcp-serviceAccount.json"'
        )
      }

      if (projectId) {
        const logMessage = printLog(msgType, serviceAccountPath)
        console.log(logMessage)
      }

      this._clientGCS = new GoogleCloudStorage({
        projectId,
        keyFilename: serviceAccountPath,
      })
    }
  }

  /**
   * Expires Object Storage Sign
   * @returns
   */
  public expiresObject(): DtoExpiresObject {
    const getExpired = this._expires.replace(/[^0-9]/g, '')

    const expiresIn = ms(this._expires)
    const expiryDate = addDays(new Date(), Number(getExpired))

    return { expiresIn, expiryDate }
  }

  /**
   * ```sh
   * Using a client with a Cloud Storage Provider
   * ```
   * @name
   * Using the client with the AWS S3 Provider
   * @example
   * import { S3 } from '@aws-sdk/client-s3'
   *
   * const storage = new Storage('s3')
   * const s3 = storage.client<S3>().getObject()
   *
   * @name
   * Using the client with the Minio Provider
   * @example
   * import * as Minio from 'minio'
   *
   * const storage = new Storage('minio')
   * const minio = storage.client<Minio.Client>().fGetObject()
   *
   * @name
   * Using the client with the Google Cloud Storage Provider
   * @example
   * import { Storage as GoogleCloudStorage } from '@google-cloud/storage'
   *
   * const storage = new Storage('gcs')
   * const gcs = storage.client<GoogleCloudStorage>().getProjectId()
   *
   * @returns
   */
  public client<T>(): T | undefined {
    if (this._provider === 's3') {
      // @ts-expect-error: Unreachable code error
      return this._clientS3
    }

    if (this._provider === 'minio') {
      // @ts-expect-error: Unreachable code error
      return this._clientMinio
    }

    if (this._provider === 'gcs') {
      // @ts-expect-error: Unreachable code error
      return this._clientGCS
    }
  }

  /**
   * Create S3 Bucket
   */
  private async _createS3Bucket(): Promise<void> {
    const msgType = 'S3'
    const bucketName = this._bucket

    try {
      const data = await this._clientS3?.createBucket({
        Bucket: bucketName,
      })

      const message = `Success Create Bucket: ${chalk.cyan(bucketName)}`
      const logMessage = printLog(msgType, message)

      console.log(logMessage, data)
    } catch (err: any) {
      const message = err?.message ?? err
      const logMessage = printLog(`${msgType} - Error :`, message, {
        label: 'error',
      })
      console.log(logMessage)

      process.exit()
    }
  }

  /**
   * Initial Aws S3
   */
  private async _initialS3(): Promise<any> {
    const msgType = 'S3'
    const bucketName = this._bucket

    try {
      const data = await this._clientS3?.send(
        new GetBucketAclCommand({ Bucket: bucketName })
      )

      const message = `Success Get Bucket: ${chalk.cyan(bucketName)}`
      const logMessage = printLog(msgType, message)

      console.log(logMessage, data?.Grants)
    } catch (err: any) {
      const message = err?.message ?? err
      const logMessage = printLog(`${msgType} - Error :`, message, {
        label: 'error',
      })
      console.log(logMessage)

      await this._createS3Bucket()
    }
  }

  /**
   * Create Minio Bucket
   */
  private async _createMinioBucket(): Promise<void> {
    const msgType = 'Minio'
    const bucketName = this._bucket

    try {
      await this._clientMinio?.makeBucket(bucketName, this._region)

      const message = `Success Create Bucket: ${chalk.cyan(bucketName)}`
      const logMessage = printLog(msgType, message)

      console.log(logMessage)
    } catch (err: any) {
      const message = err?.message ?? err
      const logMessage = printLog(`${msgType} - Error :`, message, {
        label: 'error',
      })
      console.log(logMessage)

      process.exit()
    }
  }

  /**
   * Initial Minio
   */
  private async _initialMinio(): Promise<void> {
    const msgType = 'Minio'
    const bucketName = this._bucket

    const exists = await this._clientMinio?.bucketExists(bucketName)

    if (!exists) {
      await this._createMinioBucket()
    } else {
      const message = `Success Get Bucket: ${chalk.cyan(bucketName)}`
      const logMessage = printLog(msgType, message)

      console.log(logMessage)
    }
  }

  /**
   * Create Google Cloud Storage Bucket
   */
  private async _createGCSBucket(): Promise<void> {
    const msgType = 'Google Cloud Storage'
    const bucketName = this._bucket

    try {
      const data = await this._clientGCS?.createBucket(bucketName)

      const message = `Success Create Bucket: ${chalk.cyan(bucketName)}`
      const logMessage = printLog(msgType, message)

      console.log(logMessage, data)
    } catch (err: any) {
      const message = err?.message ?? err
      const logMessage = printLog(`${msgType} - Error :`, message, {
        label: 'error',
      })
      console.log(logMessage)

      process.exit()
    }
  }

  /**
   * Initial Google Cloud Storage
   */
  private async _initialGCS(): Promise<void> {
    const msgType = 'Google Cloud Storage'
    const bucketName = this._bucket

    try {
      const data = this._clientGCS?.bucket(bucketName)
      const getBucket = await data?.exists()
      const getMetadata = await data?.getMetadata()

      if (getBucket?.[0]) {
        const message = `Success Get Bucket: ${chalk.cyan(bucketName)}`
        const logMessage = printLog(msgType, message)

        console.log(logMessage, getMetadata?.[0])
      }
    } catch (err: any) {
      const message = err?.message ?? err
      const logMessage = printLog(`${msgType} - Error :`, message, {
        label: 'error',
      })
      console.log(logMessage)

      await this._createGCSBucket()
    }
  }

  public async initialize(): Promise<void> {
    if (this._provider === 's3') {
      await this._initialS3()
    }

    if (this._provider === 'minio') {
      await this._initialMinio()
    }

    if (this._provider === 'gcs') {
      await this._initialGCS()
    }
  }

  /**
   * Get Presigned URL from AWS S3
   * @param keyFile
   * @returns
   */
  private async _getPresignedURLS3(keyFile: string): Promise<string> {
    const command = new GetObjectCommand({
      Bucket: this._bucket,
      Key: keyFile,
    })

    const { expiresIn } = this.expiresObject()
    const newExpiresIn = expiresIn / 1000

    // @ts-expect-error: Unreachable code error
    const signedURL = await getSignedUrl(this._clientS3, command, {
      expiresIn: newExpiresIn,
    })

    return signedURL
  }

  /**
   * Get Presigned URL from MinIO
   * @param keyFile
   * @returns
   */
  private async _getPresignedURLMinIO(keyFile: string): Promise<string> {
    const signedURL = await this._clientMinio?.presignedGetObject(
      this._bucket,
      keyFile
    )

    return String(signedURL)
  }

  /**
   * Get Presigned URL from Google Cloud Storage
   * @param keyFile
   * @returns
   */
  private async _getPresignedURLGCS(keyFile: string): Promise<string> {
    const { expiresIn } = this.expiresObject()

    const options: GetSignedUrlConfig = {
      version: 'v4',
      action: 'read',
      virtualHostedStyle: true,
      expires: Date.now() + expiresIn,
    }

    // signed url from bucket google cloud storage
    const data = await this._clientGCS
      ?.bucket(this._bucket)
      .file(keyFile)
      .getSignedUrl(options)

    const signedURL = String(data?.[0])

    return signedURL
  }

  /**
   * Get Presigned URL
   * @param keyFile
   * @returns
   */
  public async getPresignedURL(keyFile: string): Promise<string> {
    let signedURL: string = ''

    if (this._provider === 's3') {
      signedURL = await this._getPresignedURLS3(keyFile)
    }

    if (this._provider === 'minio') {
      signedURL = await this._getPresignedURLMinIO(keyFile)
    }

    if (this._provider === 'gcs') {
      signedURL = await this._getPresignedURLGCS(keyFile)
    }

    return signedURL
  }

  /**
   * Upload File from AWS S3
   * @param fieldUpload
   * @param directory
   * @returns
   */
  private async _uploadFileS3(
    fieldUpload: FileAttributes,
    directory: string
  ): Promise<{
    data: PutObjectCommandOutput | undefined
    signedURL: string
  }> {
    const keyFile = `${directory}/${fieldUpload.filename}`

    // send file upload to AWS S3
    const data = await this._clientS3?.send(
      new PutObjectCommand({
        Bucket: this._bucket,
        Key: keyFile,
        Body: fs.createReadStream(fieldUpload.path),
        ContentType: fieldUpload.mimetype, // <-- this is what you need!
        ContentDisposition: `inline; filename=${fieldUpload.filename}`, // <-- and this !
        ACL: 'public-read', // <-- this makes it public so people can see it
      })
    )

    const signedURL = await this.getPresignedURL(keyFile)
    const result = { data, signedURL }

    return result
  }

  /**
   * Upload File from MinIO
   * @param fieldUpload
   * @param directory
   * @returns
   */
  private async _uploadFileMinIO(
    fieldUpload: FileAttributes,
    directory: string
  ): Promise<{
    data: Minio.UploadedObjectInfo | undefined
    signedURL: string
  }> {
    const keyFile = `${directory}/${fieldUpload.filename}`

    const data = await this._clientMinio?.fPutObject(
      this._bucket,
      keyFile,
      fieldUpload.path,
      {
        ContentType: fieldUpload.mimetype, // <-- this is what you need!
        ContentDisposition: `inline; filename=${fieldUpload.filename}`, // <-- and this !
        ACL: 'public-read', // <-- this makes it public so people can see it
      }
    )

    const signedURL = await this.getPresignedURL(keyFile)
    const result = { data, signedURL }

    return result
  }

  /**
   * Upload File from Google Cloud Storage
   * @param fieldUpload
   * @param directory
   * @returns
   */
  private async _uploadFileGCS(
    fieldUpload: FileAttributes,
    directory: string
  ): Promise<{
    data: UploadResponse | undefined
    signedURL: string
  }> {
    const keyFile = `${directory}/${fieldUpload.filename}`

    // For a destination object that does not yet exist,
    // set the ifGenerationMatch precondition to 0
    // If the destination object already exists in your bucket, set instead a
    // generation-match precondition using its generation number.
    const generationMatchPrecondition = 0

    const options: UploadOptions = {
      destination: keyFile,
      preconditionOpts: { ifGenerationMatch: generationMatchPrecondition },
    }

    // send file upload to google cloud storage
    const data = await this._clientGCS
      ?.bucket(this._bucket)
      .upload(fieldUpload.path, options)

    const signedURL = await this.getPresignedURL(keyFile)
    const result = { data: data?.[1], signedURL }

    return result
  }

  /**
   * Upload File to Storage Provider
   * @param fieldUpload
   * @param directory
   * @returns
   */
  public async uploadFile<T>(
    fieldUpload: FileAttributes,
    directory: string
  ): Promise<{ data: T; signedURL: string }> {
    let result: { data: T | any; signedURL: string } = {
      data: '',
      signedURL: '',
    }

    if (this._provider === 's3') {
      result = await this._uploadFileS3(fieldUpload, directory)
    }

    if (this._provider === 'minio') {
      result = await this._uploadFileMinIO(fieldUpload, directory)
    }

    if (this._provider === 'gcs') {
      result = await this._uploadFileGCS(fieldUpload, directory)
    }

    return result
  }
}
