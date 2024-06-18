import CreateOrder from "../screens/CreateOrder/CreateOrder";
import DeliveryLocation from "../screens/DeliveryLocation";
import OrderDetails from "../screens/SingleOrder/OrderDetails";
import PackageSent from "../screens/OrderFinalScreen";
import PickupDetails from "../screens/PickupDetails/PickupDetails";
import Tracking from "../screens/LiveTracking";
import NotificationDetails from "../screens/Notifications/Notification-details";
import ChatBox from "../screens/ChatBox";
import Rating from "screens/Rating/StarRating";

interface routeInterface {
    name: string;
    component: React.FC;
    options?: {
      title?: string;
      headerShown?: boolean;
      headerShadowVisible?: boolean;
      headerStyle?: { backgroundColor: string };
    };
  }

  export const nonTabsNavigation: Array<routeInterface> = [
    {
      name: "create-order",
      component: CreateOrder,
      options: {
        headerShown: false,
      },
    },
    {
      name: "pick-up-details",
      component: PickupDetails,
      options: {
        headerShown: false,
      },
    },
    {
      name: "delivery-details",
      component: DeliveryLocation,
      options: {
        headerShown: false,
      },
    },
    {
      name: "package-sent",
      component: PackageSent,
      options: {
        headerShown: false,
      },
    },
    {
      name: "order-details",
      component: OrderDetails,
      options: {
        headerShown: false,
      },
    },
    {
      name: "tracking",
      component: Tracking,
      options: {
        headerShown: false,
      },
    },
    {
      name: "view-notification-details",
      component: NotificationDetails,
      options: {
        headerShown: false,
      },
    },
    {
      name: "chat-box",
      component: ChatBox,
      options: {
        headerShown: false,
      },
    },
    {
      name: "rating",
      component: Rating,
      options: {
        headerShown: false,
      },
    },
]