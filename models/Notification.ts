import { IntPagination } from "./Pagination";

export interface IntNotificationsType {
    id: number;
    status: string;
    message: string;
    message_body: string;
    estimated_time: string;
  };

  export interface IntNotificationPages extends IntPagination {
    data: IntNotificationsType[]
  }