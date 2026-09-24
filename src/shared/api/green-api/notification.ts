import type { NotificationBody, SenderData } from '@/shared/api/green-api/types'
import { fromApiChatId, normalizePhone } from '@/shared/lib/phone'

export function extractText(body: NotificationBody) {
  return (
    body.messageData?.textMessageData?.textMessage ??
    body.messageData?.extendedTextMessageData?.text ??
    ''
  ).trim()
}

export function resolveSenderPhone(sender?: SenderData) {
  if (sender?.senderPhoneNumber) {
    return normalizePhone(String(sender.senderPhoneNumber))
  }

  if (sender?.chatId) {
    return fromApiChatId(sender.chatId)
  }

  return ''
}
