import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { AppState } from "../../models/App";
import { Orders } from "../../models/Orders";
import Charges from "../../models/Charges";
import { UserMessages } from "../../models/Message";
import { IntNotificationPages } from "models/Notification";

const initialState: AppState = {
  orders: [],
  errors: [],
  usersMessages: [],
  app_version: "1.0.0",
  messages: [],
  orderCharges: {} as Charges,
  orderResponse: {} as any,
  notifications: {} as IntNotificationPages
};

const AppReducer = createSlice({
  name: "appReducer",
  initialState,
  reducers: {
    setErrors: (state, action: PayloadAction<string[]>) => {
      return { ...state, errors: action.payload };
    },

    clearErrors: (state) => {
      return { ...state, errors: [] };
    },

    setMessages: (state, action: PayloadAction<string[]>) => {
      return { ...state, messages: action.payload };
    },

    clearMessages: (state) => {
      return { ...state, messages: [] };
    },
    setUserOrders: (state, action: PayloadAction<Orders[]>) => {
      state.orders = action.payload;
    },
    setNotifications: (state, action: PayloadAction<IntNotificationPages>) => {
      state.notifications = action.payload;
    },
    setUserMessages: (state, action: PayloadAction<UserMessages[]>) => {
      // state.usersMessages = [...state.usersMessages, ...action.payload];
      state.usersMessages = action.payload
    },
    // setUserMessages: (state, action: PayloadAction<UserMessages[]>) => {
    //   const newMessages = action.payload.filter(
    //     (newMessage) => !state.usersMessages.some(
    //       (existingMessage) => existingMessage.id === newMessage.id
    //     )
    //   );
    //   state.usersMessages = [...state.usersMessages, ...newMessages];
    // },
    clearUserMessages: (state) => {
      state.usersMessages = [];
    },
    setOrderResponse: (state, action: PayloadAction<any>) => {
      state.orderResponse = action.payload;
    },
    setOrderCharges: (state, action: PayloadAction<Charges>) => {
      state.orderCharges = action.payload;
    },
  },
});

export const {
  setUserOrders,
  setErrors,
  setMessages,
  clearErrors,
  clearMessages,
  setOrderCharges,
  setOrderResponse,
  setUserMessages,
  clearUserMessages,
  setNotifications
} = AppReducer.actions;
export default AppReducer.reducer;
