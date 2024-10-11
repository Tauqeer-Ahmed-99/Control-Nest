export interface ApiConfig {
  searchParams?: { [key: string]: any };
  body?: BodyInit;
  method?: HTTPMethod;
  headers?: HeadersInit;
  queryConfig?: { enabled: boolean };
}

export enum HTTPMethod {
  GET = "GET",
  POST = "POST",
  PATCH = "PATCH",
  PUT = "PUT",
  DELETE = "DELETE",
}

export enum HTTPStatus {
  OK = 200,
  Created = 201,
  NotFound = 400,
  Forbidden = 403,
  BadRequest = 404,
  UnprocessableEntity = 422,
  ServerError = 500,
  ServiceUnavailable = 503,
}

export const ExpectedHTTPStatuses: HTTPStatus[] = [
  HTTPStatus.OK,
  HTTPStatus.Created,
  HTTPStatus.NotFound,
  HTTPStatus.Forbidden,
  HTTPStatus.BadRequest,
  HTTPStatus.UnprocessableEntity,
  HTTPStatus.ServerError,
  HTTPStatus.ServiceUnavailable,
];

const request = (baseUrl: string, url: string, config: ApiConfig) => {
  const fullUrl = new URL(url, baseUrl);

  const { searchParams, body, method = HTTPMethod.GET, headers } = config;

  if (searchParams) {
    for (const searchParam in searchParams) {
      fullUrl.searchParams.append(searchParam, searchParams[searchParam]);
    }
  }

  console.log(method, fullUrl);
  if (headers) console.log("Headers", headers);
  if (body) console.log("Body", body);

  return fetch(fullUrl, {
    body: JSON.stringify(body),
    method,
    headers: {
      "Content-Type": "application/json",
      ...(headers ?? {}),
    },
  });
};

export default request;
