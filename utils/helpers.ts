import * as Clipboard from "expo-clipboard";
import React from "react";

export const navigationRef = React.createRef();

export function navigate(name: any, params: any) {
  (navigationRef.current as any)?.navigate(name, params);
}

function deg2rad(deg: number) {
  return deg * (Math.PI / 180);
}

export const getDistanceFromLatLonInKm = (
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
) => {
  var R = 6371;
  var dLat = deg2rad(lat2 - lat1);
  var dLon = deg2rad(lon2 - lon1);
  var a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) *
      Math.cos(deg2rad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  var d = R * c;
  return d;
};

export const copyToClipboard = async (text: string) => {
  await Clipboard.setStringAsync(text);
  alert("copied to clipboard");
};

export const numberFormat = (num: number) =>
  new Intl.NumberFormat("en-NG", { style: "currency", currency: "NGN" }).format(
    Number(num)
  );

  export function convertTo12HourFormat(timeString: any) {
    // Split the input string by colon to get hours, minutes, and seconds
    // console.log(timeString);
    
    let [hours, minutes] = timeString.split(':');
    
    // Convert hours to an integer
    hours = parseInt(hours);

    // Determine AM or PM suffix
    let period = hours >= 12 ? 'PM' : 'AM';

    // Convert hours to 12-hour format
    hours = hours % 12 || 12; // Converts 0 to 12 for midnight (00:00:00)

    // Return the formatted time string
    return `${hours}:${minutes} ${period}`;
}