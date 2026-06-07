type MovideskWebhookCreatedBy = {
  Id: string
  PersonType: number
  ProfileType: number
}

type MovideskWebhookAttachment = {
  FileName: string
  Path: string
}

type MovideskWebhookAction = {
  Id: number
  Type: number
  Origin: number
  Description: string
  HtmlDescription: string
  CreatedBy: MovideskWebhookCreatedBy | null
  IsDeleted: boolean
  Attachments: MovideskWebhookAttachment[]
}

type MovideskWebhookCustomFieldItem = {
  CustomFieldItem: string
  StorageFileGuid: string
}

type MovideskWebhookCustomFieldValue = {
  CustomFieldId: number
  CustomFieldRuleId: number
  Line: number
  Items: MovideskWebhookCustomFieldItem[]
}

type MovideskWebhookEvent = {
  Criteria: number
  Operation: number
}

 export type MovideskWebhookPayload = {
  Id: string
  Type: number
  Subject: string
  Status: string
  Justification: string | null
  Origin: number
  IsDeleted: boolean
  ServiceFirstLevel: string
  ActionCount: number
  ResolvedInFirstCall: boolean
  SlaSolutionTime: number
  Actions: MovideskWebhookAction[]
  CustomFieldValues: MovideskWebhookCustomFieldValue[]
  WebhookEvents: MovideskWebhookEvent[] | null
}