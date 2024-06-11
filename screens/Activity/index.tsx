import ScreenContextProvider from "./context/ScreenContext";
import ActivityList from "./components/ActivityList";

const Activity = () => {
  return (
    <ScreenContextProvider>
      <ActivityList />
    </ScreenContextProvider>
  );
};

export default Activity;
