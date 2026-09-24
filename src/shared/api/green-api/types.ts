export type InstanceState =
  | 'authorized'
  | 'notAuthorized'
  | 'blocked'
  | 'starting'
  | 'suspended'
  | 'pendingPassword'

export type SenderData = {
  chatId?: string
  sender?: string
  senderName?: string
  senderPhoneNumber?: number | string
}

export type NotificationBody = {
  typeWebhook?: string
  timestamp?: number
  idMessage?: string
  senderData?: SenderData
  messageData?: {
    typeMessage?: string
    textMessageData?: { textMessage?: string }
    extendedTextMessageData?: { text?: string }
  }
}

export type GreenApiNotification = {
  receiptId: number
  body: NotificationBody
}
