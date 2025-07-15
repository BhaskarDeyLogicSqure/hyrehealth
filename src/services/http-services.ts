// import { ApiResponse } from "../types/index";
// import { X_API_KEY, BASE_URL } from "../configs";
// import { decodeJWTToken, getToken, logout } from "../utils/auth";

// export enum httpType {
//   GET = "GET",
//   POST = "POST",
//   PUT = "PUT",
//   DELETE = "DELETE",
//   PATCH = "PATCH",
// }

// interface GetRequestOptions {
//   url: string;
//   attachToken?: boolean;
//   attachXUserId?: boolean;
//   params?: Record<string, unknown>;
//   query?: Record<string, unknown>;
// }

// interface PostRequestOptions {
//   url: string;
//   attachToken?: boolean;
//   attachXUserId?: boolean;
//   payload?: Record<string, unknown>;
// }

// type Headers = Record<string, string>;

// const createRequestHeader = (
//   attachToken = false,
//   attachXUserId = false
// ): Headers => {
//   const headers: Headers = {
//     Accept: "application/json",
//     "Content-Type": "application/json",
//   };

//   // Only add x-API-key if it's defined
//   if (X_API_KEY) {
//     headers["x-API-key"] = X_API_KEY;
//   }

//   if (attachToken) {
//     const authToken = getToken();
//     if (!authToken) throw new Error("Error fetching auth token");
//     headers["Authorization"] = `Bearer ${authToken}`;

//     if (attachXUserId) {
//       const decodedToken = decodeJWTToken(authToken);
//       if (decodedToken?.sub) {
//         headers["x-user-id"] = decodedToken.sub.trim();
//       } else {
//         console.warn("Could not extract user ID from token. Continuing without x-user-id header.");
//         // Don't throw an error, just continue without the header
//       }
//     }
//   }

//   return headers;
// };

// export const structureQueryParams = (
//   params: Record<string, unknown>
// ): string => {
//   // Filter out undefined and null values
//   const filteredParams = Object.entries(params).reduce((acc, [key, value]) => {
//     if (value !== undefined && value !== null && value !== '') {
//       acc[key] = value;
//     }
//     return acc;
//   }, {} as Record<string, unknown>);

//   // Check if we have any params after filtering
//   if (Object.keys(filteredParams).length === 0) {
//     return '';
//   }

//   let queryStrings = "?";
//   const keys = Object.keys(filteredParams);
//   keys.forEach((key, index) => {
//     queryStrings += `${encodeURIComponent(key)}=${encodeURIComponent(String(filteredParams[key]))}`;
//     if (index < keys.length - 1) {
//       queryStrings += "&";
//     }
//   });
//   return queryStrings;
// };

// export const extractQueryParams = (): Record<string, string> => {
//   const {
//     location: { search: queryParamString },
//   } = window;
//   const params: Record<string, string> = {};
//   if (queryParamString.length > 1 && queryParamString.indexOf("?") > -1) {
//     let queryStr = queryParamString.replace("?", "");
//     queryStr = decodeURIComponent(queryStr);
//     if (queryStr.indexOf("&") === -1) {
//       // Contains only one param
//       const paramParts = queryStr.split("=");
//       params[paramParts[0]] = paramParts[1];
//     } else {
//       // Contains multiple params
//       const queryParams = queryStr.split("&");
//       queryParams.forEach((queryParam) => {
//         const paramParts = queryParam.split("=");
//         params[paramParts[0]] = paramParts[1];
//       });
//     }
//   }
//   return params;
// };

// // this function is just to make sure that the result is of type ApiResponse<T>,
// // it is not doing any transformation to the result, just making sure that the type is correct
// //! SHOULD BE REMOVED once we have a proper response structure from the server
// const formatResultToTypeMatch = <T>(result: ApiResponse<T>): ApiResponse<T> => {
//   return {
//     data: result.data,
//     success: true,
//   } as ApiResponse<T>;
// };

// // Helper function to check if a response is the ngrok warning page
// const isNgrokWarningPage = (text: string): boolean => {
//   return text.includes('ngrok-free.app') && text.includes('This website is served for free through ngrok.com');
// };

// // Function to handle ngrok warning page and retry the request with appropriate headers
// const handleNgrokWarning = async (url: string, headers: Headers, method: string, body?: string): Promise<Response> => {
//   // First attempt without special handling
//   let response = await fetch(url, {
//     method,
//     headers,
//     body,
//   });

//   // Check if we got HTML response (likely ngrok warning)
//   const contentType = response.headers.get('content-type');
//   if (contentType && contentType.includes('text/html')) {
//     const text = await response.text();

//     // If it's the ngrok warning page
//     if (isNgrokWarningPage(text)) {
//       console.log('Detected ngrok warning page, retrying with modified headers...');

//       // Add headers that bypass the ngrok warning
//       const modifiedHeaders = {
//         ...headers,
//         'Ngrok-Skip-Browser-Warning': 'true',
//         'User-Agent': 'Mozilla/5.0 (compatible)',
//         'Accept': 'application/json, text/plain, */*'
//       };

//       // Retry the request with modified headers
//       response = await fetch(url, {
//         method,
//         headers: modifiedHeaders,
//         body,
//       });
//     }
//   }

//   return response;
// };

// const _handleApiResponse = async <T>(
//   response: Response
// ): Promise<ApiResponse<T>> => {
//   if (response.status === 401) {
//     logout();
//     console.log("_handleApiResponse response >>>>>>>>>>", response);

//     // throw new Error("Unauthorized access. Please login again.");
//   }
//   //  else if (response.status === 403) {
//   //   throw new Error(
//   //     "Forbidden access. You don't have permission to access this resource."
//   //   );
//   // } else if (response.status >= 500) {
//   //   throw new Error("Server error. Please try again later.");
//   // } else if (response.status >= 400) {
//   //   throw new Error("Client error. Please check your request.");
//   // } else if (response?.status == 404) {
//   //   throw new Error("Page Not Found");
//   // }

//   const result: ApiResponse<T> = await response.json();
//   console.log("_handleApiResponse result >>>>>>>>>>", result);
//   if (!result?.success) {
//     throw new Error("Something went wrong on the server.");
//   }

//   console.log("formatResultToTypeMatch(result) >>>>>>>>>>", formatResultToTypeMatch(result));

//   return formatResultToTypeMatch(result) as ApiResponse<T>;
// };

// export const makeGetRequest = async <T>({
//   url,
//   attachToken = false,
//   attachXUserId = false,
//   query = {},
// }: GetRequestOptions): Promise<ApiResponse<T>> => {
//   const headers = createRequestHeader(attachToken, attachXUserId);

//   // Build query string from params
//   const queryString =
//     query && Object.keys(query).length > 0
//       ? structureQueryParams(query)
//       : "";

//   const response = await handleNgrokWarning(`${BASE_URL}${url}${queryString}`, headers, httpType.GET);
//   return _handleApiResponse<T>(response);
// };

// export const makePostRequest = async <T>({
//   url,
//   attachToken = false,
//   attachXUserId = false,
//   payload = {},
// }: PostRequestOptions): Promise<ApiResponse<T>> => {
//   const headers = createRequestHeader(attachToken, attachXUserId);
//   const response = await handleNgrokWarning(
//     `${BASE_URL}${url}`,
//     headers,
//     httpType.POST,
//     JSON.stringify(payload)
//   );
//   return _handleApiResponse<T>(response);
// };

// export const makePutRequest = async <T>({
//   url,
//   attachToken = false,
//   attachXUserId = false,
//   payload = {},
// }: PostRequestOptions): Promise<ApiResponse<T>> => {
//   const headers = createRequestHeader(attachToken, attachXUserId);
//   const response = await handleNgrokWarning(
//     `${BASE_URL}${url}`,
//     headers,
//     httpType.PUT,
//     JSON.stringify(payload)
//   );
//   return _handleApiResponse<T>(response);
// };

// export const makeDeleteRequest = async <T>({
//   url,
//   attachToken = false,
//   attachXUserId = false,
//   params = {},
// }: GetRequestOptions): Promise<ApiResponse<T>> => {
//   const headers = createRequestHeader(attachToken, attachXUserId);

//   // Build query string from params
//   const queryString =
//     params && Object.keys(params).length > 0
//       ? structureQueryParams(params)
//       : "";

//   const response = await handleNgrokWarning(`${BASE_URL}${url}${queryString}`, headers, httpType.DELETE);
//   return _handleApiResponse<T>(response);
// };

// export const makePatchRequest = async <T>({
//   url,
//   attachToken = false,
//   attachXUserId = false,
//   payload = {},
// }: PostRequestOptions): Promise<ApiResponse<T>> => {
//   const headers = createRequestHeader(attachToken, attachXUserId);
//   const response = await handleNgrokWarning(
//     `${BASE_URL}${url}`,
//     headers,
//     httpType.PATCH,
//     JSON.stringify(payload)
//   );
//   return _handleApiResponse<T>(response);
// };

// no need
