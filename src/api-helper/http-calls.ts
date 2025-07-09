// import { ApiResponse } from "./../types/index";
// import { BASE_URL } from "../configs";
// import { makeGetRequest } from "../services/http-services";
// import {  UserDataType } from "../types/user";

// // Define types for our data models
// export interface ContactType {
//   id: string;
//   name: string;
//   email: string;
//   phone: string;
//   address: {
//     line1: string;
//     line2?: string;
//     city: string;
//     state: string;
//     zip: string;
//   };
//   type: 'Commercial' | 'Residential';
//   status: 'Lead' | 'Client' | 'Do Not Do Business' | 'Do Not Message';
//   salesExecutive?: string;
//   notes?: string[];
//   addedOn: string;
// }

// export interface TeamMemberType {
//   id: string;
//   name: string;
//   email: string;
//   phone: string;
//   employeeType: 'Admin' | 'Sales Manager' | 'Sales Executive' | 'Site Manager' | 'Crew';
//   location: string;
//   activeSince: string;
//   status: 'Active' | 'Inactive';
// }

// export interface QuoteItemType {
//   description: string;
//   units: number;
//   rate: number;
//   cost: number;
// }

// export interface QuoteType {
//   id: string;
//   orderNo: string;
//   clientName: string;
//   clientId: string;
//   location: string;
//   addedOn: string;
//   executionDate?: string;
//   executionTime?: string;
//   salesExecutive: string;
//   items: QuoteItemType[];
//   subTotal: number;
//   discount: number;
//   total: number;
//   status: 'Draft' | 'Sent' | 'Accepted' | 'Rejected';
//   comments?: string[];
//   uploads?: string[];
// }

// export interface BudgetItemType {
//   expenseHead: string;
//   hours: number;
//   rate: number;
//   amount: number;
// }

// export interface WorkOrderType {
//   id: string;
//   orderNo: string;
//   clientName: string;
//   clientId: string;
//   addedOn: string;
//   itemCount: number;
//   totalCost: number;
//   executionDate: string;
//   executionTime: string;
//   salesExecutive: string;
//   siteManager?: string;
//   crew?: string[];
//   address: {
//     line1: string;
//     line2?: string;
//     city: string;
//     state: string;
//     zip: string;
//   };
//   items: QuoteItemType[];
//   budget: BudgetItemType[];
//   siteManagerNotes?: string;
//   salesmanNotes?: string;
//   images?: string[];
//   status: 'Open' | 'Job' | 'Completed';
// }

// export interface InvoiceType {
//   id: string;
//   invoiceNumber: string;
//   customer: string;
//   workOrder: string;
//   amount: number;
//   dueDate: string;
//   notes?: string;
//   status: 'pending' | 'paid' | 'overdue' | 'partially_paid';
//   issueDate: string;
//   createdBy?: string;
//   createdAt?: string;
//   updatedAt?: string;
// }

// export interface PaymentType {
//   id: string;
//   date: string;
//   paymentDate?: string;
//   invoiceNo: string;
//   invoiceId: string;
//   invoiceName: string;
//   clientName: string;
//   clientId: string;
//   amount: number;
//   processingFee: number;
//   totalAmount: number;
//   description?: string;
//   signature?: string;
//   dueAmount: number;
// }

// export interface SettingsType {
//   equipmentRates: {
//     name: string;
//     rate: number;
//     rateType: 'Hourly' | 'Daily';
//   }[];
//   crewRate: number;
//   siteManagerRate: number;
//   paymentSettings: {
//     cardPaymentEnabled: boolean;
//     cardPaymentFee: number;
//     achEnabled: boolean;
//     achProcessingFee: number;
//   };
//   signature?: string;
// }

// export const getUserDetails = async (): Promise<ApiResponse<UserDataType>> => {
//   return makeGetRequest<UserDataType>({
//     url: `${BASE_URL}/user`,
//     attachToken: true,
//   });
// };

// no need ??
