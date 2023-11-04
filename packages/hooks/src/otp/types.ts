export interface HashEntity {
  secretKey: string
}

export interface HashOTPEntity extends HashEntity {
  expires: string
}
