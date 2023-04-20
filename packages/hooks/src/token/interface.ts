import { type JwtPayload } from 'jsonwebtoken'

type ExpiresHour = '1h' | '6h' | '12h'
type ExpiresDay = '1d' | '2d' | '3d' | '4d' | '5d' | '6d' | '7d'
export type ExpiresType = ExpiresHour | ExpiresDay

export interface GenerateTokenEntity {
  value: string | any
  secretKey: string
  expires: ExpiresType
}

export interface VerifyTokenEntity {
  token: string
  secretKey: string
}

export interface DtoGenerateToken {
  token: string
  expiresIn: number
}

export type DtoVerifyToken =
  | {
      data: null
      message: string
    }
  | {
      data: string | JwtPayload
      message: string
    }
  | undefined
