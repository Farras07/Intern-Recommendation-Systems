enum BatchStatus {
    "Pending",
    "Hiring",
    "Done",
    "Failed"
}
export type BatchTableTypes = {
  no: number  
  batchId: string
  batchName: string
  startDate: Date
  endDate: Date
  status: keyof typeof BatchStatus
}

export type BatchPayloadAddType = {
  batchName: string
  batchStartDate: string
  batchStartTime: string
  batchEndDate: string
  batchEndTime: string
}

export type BatchPayloadUpdateType = {
  batchId: string
  batchName: string
  batchStartDate: string
  batchStartTime: string
  batchEndDate: string
  batchEndTime: string
}
export type BatchResponseType = {
  batchId: string
  batchName: string
  startDate: string
  endDate: string
}