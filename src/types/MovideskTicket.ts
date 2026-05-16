export type MovideskTicket = {
  id: number
  protocol: string | null
  type: number
  subject: string
  category: string
  urgency: string | null
  status: string
  baseStatus: string
  justification: string | null
  origin: number
  createdDate: string
  isDeleted: boolean
  originEmailAccount: string | null
  owner: string | null
  ownerTeam: string
  createdBy: Person
  serviceFull: string[]
  serviceFirstLevelId: number
  serviceFirstLevel: string
  serviceSecondLevel: string
  serviceThirdLevel: string | null
  contactForm: string | null
  tags: string[]
  cc: string
  resolvedIn: string | null
  closedIn: string | null
  canceledIn: string | null
  actionCount: number
  lifeTimeWorkingTime: number | null
  stoppedTime: number | null
  stoppedTimeWorkingTime: number | null
  resolvedInFirstCall: boolean
  chatWidget: string | null
  chatGroup: string | null
  chatTalkTime: number | null
  chatWaitingTime: number | null
  sequence: number | null
  slaAgreement: string | null
  slaAgreementRule: string | null
  slaSolutionTime: number
  slaResponseTime: number
  slaSolutionChangedByUser: boolean
  slaSolutionChangedBy: Person
  slaSolutionDate: string | null
  slaSolutionDateIsPaused: boolean
  jiraIssueKey: string | null
  redmineIssueId: string | null
  movideskTicketNumber: string | null
  linkedToIntegratedTicketNumber: string | null
  reopenedIn: string | null
  lastActionDate: string
  lastUpdate: string
  slaResponseDate: string | null
  slaRealResponseDate: string | null
  clients: Client[]
  actions: Action[]
  parentTickets: unknown[]
  childrenTickets: unknown[]
  ownerHistories: OwnerHistory[]
  statusHistories: StatusHistory[]
  satisfactionSurveyResponses: unknown[]
  customFieldValues: CustomFieldValue[]
  assets: unknown[]
  webhookEvents: unknown | null
}

export type Person = {
  id: string
  personType: number
  profileType: number
  businessName: string
  email: string | null
  phone: string | null
}

export type Organization = {
  id: string
  personType: number
  profileType: number
  businessName: string
  email: string
  phone: string
}

export type Client = {
  id: string
  personType: number
  profileType: number
  businessName: string
  email: string
  phone: string
  isDeleted: boolean
  organization: Organization
  address: string | null
  complement: string | null
  cep: string | null
  city: string | null
  bairro: string | null
  number: string | null
  reference: string | null
}

export type Attachment = {
  fileName: string
  path: string
  createdBy: Person
  createdDate: string
}

export type Action = {
  id: number
  type: number
  origin: number
  description: string
  htmlDescription: string
  status: string
  justification: string | null
  createdDate: string
  createdBy: Person | null
  isDeleted: boolean
  timeAppointments: unknown[]
  attachments: Attachment[]
  expenses: unknown[]
  tags: unknown[]
}

export type OwnerHistory = {
  ownerTeam: string
  owner: Person | null
  changedBy: Person
  changedDate: string
  permanencyTimeFullTime: number | null
  permanencyTimeWorkingTime: number | null
}

export type StatusHistory = {
  status: string
  justification: string | null
  changedBy: Person | null
  changedDate: string
  permanencyTimeFullTime: number | null
  permanencyTimeWorkingTime: number | null
}

export type CustomFieldItem = {
  personId: string | null
  clientId: string | null
  team: string | null
  customFieldItem: string | null
  storageFileGuid: string
  fileName: string | null
}

export type CustomFieldValue = {
  customFieldId: number
  customFieldRuleId: number
  line: number
  value: string | null
  items: CustomFieldItem[]
}