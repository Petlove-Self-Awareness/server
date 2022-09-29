export interface HttpRequest {
  body?: any
  headers?: any
  userId?: any
  params?: any
}

export interface HttpResponse {
  statusCode: number
  body: any
}
