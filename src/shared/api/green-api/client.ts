import type { InstanceCredentials } from '@/entities/instance'
import type { GreenApiNotification, InstanceState } from '@/shared/api/green-api/types'

const API_BASE = '/green-api'

export class GreenApiError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'GreenApiError'
  }
}

function instancePath(
  credentials: InstanceCredentials,
  method: string,
  extra = '',
) {
  return `${API_BASE}/waInstance${credentials.idInstance}/${method}/${credentials.apiTokenInstance}${extra}`
}

async function request<T>(url: string, init?: RequestInit): Promise<T | null> {
  const response = await fetch(url, init)

  if (!response.ok) {
    const body = await response.text()
    throw new GreenApiError(body || response.statusText)
  }

  const text = await response.text()
  return text ? (JSON.parse(text) as T) : null
}

export function createGreenApiClient(credentials: InstanceCredentials) {
  return {
    getStateInstance(signal?: AbortSignal) {
      return request<{ stateInstance: InstanceState }>(
        instancePath(credentials, 'getStateInstance'),
        { signal },
      )
    },
    enableHttpReceive(signal?: AbortSignal) {
      return request(instancePath(credentials, 'setSettings'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          webhookUrl: '',
          incomingWebhook: 'yes',
          outgoingWebhook: 'yes',
        }),
        signal,
      })
    },
    sendMessage(chatId: string, message: string, signal?: AbortSignal) {
      return request<{ idMessage: string }>(instancePath(credentials, 'sendMessage'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chatId, message }),
        signal,
      })
    },
    receiveNotification(timeout = 15, signal?: AbortSignal) {
      return request<GreenApiNotification>(
        `${instancePath(credentials, 'receiveNotification')}?receiveTimeout=${timeout}`,
        { signal },
      )
    },
    deleteNotification(receiptId: number, signal?: AbortSignal) {
      return request(instancePath(credentials, 'deleteNotification', `/${receiptId}`), {
        method: 'DELETE',
        signal,
      })
    },
  }
}
