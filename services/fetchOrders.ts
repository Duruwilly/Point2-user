import { useDispatch, useSelector } from "react-redux";
import { ApiRequest } from "./ApiNetwork";
import { RootState } from "../store/store";
import { setUserOrders } from "../store/reducers/app-reducer";

export const useFetchOrders = () => {
  const { request } = ApiRequest();
  // const [refreshing, setRefreshing] = useState<boolean>(false);
  const dispatch = useDispatch();

  const fetchOrders = async () => {
    //   setRefreshing(true);
    const { status, data } = await request("GET", {
      url: `/user/orders/getorders`,
      ignoreError: true,
    });
    if (status == "success") {
      dispatch(setUserOrders(data?.data?.orders?.data));
      // setRefreshing(false);
    }
  };
  // }

  return {
    fetchOrders,
    //   refreshing,
  };
};
