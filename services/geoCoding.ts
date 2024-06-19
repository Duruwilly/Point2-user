import axios from "axios";
import { GOOGLE_PLACES_API_KEY } from "constants/app";
import { useSelector } from "react-redux";
import { RootState } from "store/store";

export const useGeoCodingLocation = () => {
    const { location } = useSelector((state: RootState) => state.user);

  const getGeocodingData = async () => {
    try {
      const response = await axios.get(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${location?.latitude},${location?.longitude}&key=${GOOGLE_PLACES_API_KEY}`
      );

      if (
        response.data &&
        response.data.results &&
        response.data.results.length > 0
      ) {
        return response.data.results[1].formatted_address;
      }
    } catch (error) {
      console.error("error getting geo coding",error);
    }
  };

  return {
    getGeocodingData,
  };
};
