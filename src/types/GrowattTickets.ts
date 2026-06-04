export type WarrantyTickets = {
  id: number
  ticket: number
  serialNumber: string
  warrantyApprovedAt: Date | null
  warrantyDeniedAt: Date | null
  createdAt: Date
  updatedAt: Date
}