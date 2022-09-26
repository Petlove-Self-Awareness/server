export interface HttpRequest {
  body?: any
  headers?: any
  accountId?: any
}

export interface HttpResponse {
  statusCode: number
  body: any
}
