// import { useCallback, useEffect, useState } from "react";
// import {
//   httpType,
//   makeDeleteRequest,
//   makeGetRequest,
//   makePatchRequest,
//   makePostRequest,
//   makePutRequest,
// } from "../services/http-services";
// import { ApiResponse, ApiError } from "./../types/index";
// import { EndpointConfigType } from "../api-helper/endpoints";
// import { errorToast } from "../utils/toasters";

// interface UseApiRequestOptions {
//   endpointConfig: EndpointConfigType;
//   hitApiOnMount?: boolean;
//   params?: Record<string, unknown>;
//   payload?: Record<string, unknown>;
//   query?: Record<string, unknown>;
// }

// interface makeApiCallOptions {
//   payload?: Record<string, unknown>;
//   params?: Record<string, unknown>;
//   query?: Record<string, unknown>;
// }

// // Generic hook,
// // U is the type of the data returned from the API
// function useApiRequest<U>({
//   endpointConfig,
//   hitApiOnMount = false,
//   payload = {},
//   params = {},
//   query = {},
// }: UseApiRequestOptions) {
//   const [loading, setLoading] = useState<boolean>(false);
//   const [data, setData] = useState<U>({} as U);
//   const [error, setError] = useState<ApiError | boolean>(false);

//   const _completeErrorToast = useCallback(
//     (error: ApiError): never => {
//       console.error(`Error in ${endpointConfig?.endpoint}:`, error);

//       if (
//         typeof error === "object" &&
//         error !== null &&
//         ("message" in error || "reason" in error)
//       ) {
//         const { message, success } = error as ApiError;
//         setError(success ?? message ?? "Something went wrong.");
//       }

//       if (hitApiOnMount) {
//         errorToast(error);
//       }

//       throw error; // still throws, but function signature says it'll never return
//     },
//     [endpointConfig?.endpoint, hitApiOnMount]
//   );

//   const makeApiCall = useCallback(
//     async ({
//       payload = {},
//       params = {},
//       query = {},
//     }: makeApiCallOptions): Promise<ApiResponse<U>> => {
//       try {
//         if (!endpointConfig?.endpoint) {
//           throw new Error("Please provide an endpoint.");
//         }

//         setLoading(true);
//         setError(false);

//         // Replace URL parameters (e.g. :id) with values from params
//         let endPointUrl = endpointConfig.endpoint;
//         const paramsClone = { ...params };

//         Object.entries(paramsClone).forEach(([key, value]) => {
//           if (value !== undefined && value !== null) {
//             const paramPattern = new RegExp(`:${key}`, 'g');
//             if (paramPattern.test(endPointUrl)) {
//               endPointUrl = endPointUrl.replace(paramPattern, String(value));
//               // Remove this param since it's used in the URL
//               delete paramsClone[key];
//             }
//           }
//         });

//         // Append remaining params as path parameters
//         if (Object.keys(paramsClone)?.length) {
//           const pathParams = Object.values(paramsClone).filter(Boolean);
//           endPointUrl += `/${pathParams.join("/")}`;
//         }

//         // TO DO: once response structure is defined, we can use it to set the type of data,
//         // currently it is set to U which is generic and can be anything.
//         let result: ApiResponse<U> | null = null;

//         switch (endpointConfig.httpType) {
//           case httpType.GET:
//             result = await makeGetRequest<U>({
//               url: endPointUrl,
//               attachToken: endpointConfig.attachToken,
//               attachXUserId: endpointConfig.attachXUserId,
//               query,
//             });
//             break;

//           case httpType.POST:
//             result = await makePostRequest<U>({
//               url: endPointUrl,
//               attachToken: endpointConfig.attachToken,
//               attachXUserId: endpointConfig.attachXUserId,
//               payload,
//             });
//             break;

//           case httpType.PUT:
//             result = await makePutRequest<U>({
//               url: endPointUrl,
//               attachToken: endpointConfig.attachToken,
//               attachXUserId: endpointConfig.attachXUserId,
//               payload,
//             });
//             break;

//           case httpType.DELETE:
//             result = await makeDeleteRequest<U>({
//               url: endPointUrl,
//               attachToken: endpointConfig.attachToken,
//               attachXUserId: endpointConfig.attachXUserId,
//             });
//             break;

//           case httpType.PATCH:
//             result = await makePatchRequest<U>({
//               url: endPointUrl,
//               attachToken: endpointConfig.attachToken,
//               attachXUserId: endpointConfig.attachXUserId,
//               payload,
//             });
//             break;

//           default:
//             throw new Error(`Invalid httpType for: ${endpointConfig.endpoint}`);
//         }
//         // check the commnet in https-services.ts for the response structure
//         setData(result?.data);
//         return result as unknown as ApiResponse<U>;
//       } catch (error) {
//         return _completeErrorToast(error as ApiError);
//       } finally {
//         setLoading(false);
//       }
//     },
//     [endpointConfig, _completeErrorToast]
//   );

//   useEffect(() => {
//     if (hitApiOnMount) {
//       makeApiCall({ payload, params, query }).catch(() => {});
//     }
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, []);

//   return { data, loading, error, makeApiCall };
// }

// export default useApiRequest;

// no need
