enum vacancyStatus {
    "Pending",
    "Hiring",
    "Done",
    "Failed"
}
export type VacancyTypes = {
  id: string
  batchId: string
  role: string
  startDate: string
  endDate: string
  status: keyof typeof vacancyStatus
}
export type VacancyResponseTypes = {
  id: string
  batchId: string
  role: string
  startDate: string
  endDate: string
  status: keyof typeof vacancyStatus
  createdAt: string
}

export type jobRoleType = {
  id: string
  title: string
  description: string
}