import { ApiRequest } from "./ApiNetwork";

export const useFetchNotification = () => {
  const { request } = ApiRequest();

  const fetchNotification = async (page: number) => {
    const { status, data } = await request("GET", {
      url: `/notifications?page=${page}`,
      ignoreError: true,
    });
    if (status == "success") {
        return data?.data
        // dispatch(setNotifications(data?.data));
    }
  };

  return {
    fetchNotification,
  };
};
