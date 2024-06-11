import React, {
  Dispatch,
  SetStateAction,
  useMemo,
  useRef,
  useState,
} from "react";
import Layout from "../../../layouts/layout";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { colors } from "../../../constants/colors";
import { Feather } from "@expo/vector-icons";
import Mastercard from "../../../assets/icon/logos_mastercard.svg";
import Delete from "../../../assets/icon/delete.svg";
import { Button } from "react-native-paper";
import AddNewCard from "./AddNewCard";
import BottomSheet from "../../../components/Bottomsheet/Bottomsheet";

const ManageCards = ({
  setPages,
}: {
  setPages: Dispatch<SetStateAction<number>>;
}) => {
  const [addCard, setAddCard] = useState(false);

  const bottomSheetRef: any = useRef(null);
  const snapPoints = useMemo(() => ["25%", "35%"], []);
  const [openBottomSheet, setOpenBottomSheet] = useState(false);

  const closeBottomSheet = () => {
    setOpenBottomSheet(false);
    if (bottomSheetRef.current) {
      bottomSheetRef.current.close();
    }
  };

  return (
    <Layout>
      <Layout.Header back={() => setPages(0)} />
      <Text style={[styles.headerText, { padding: 20 }]}>Payments</Text>
      <Layout.ScrollView>
        {!addCard ? (
          <View style={styles.container}>
            <Text style={styles.cardsText}>Cards</Text>
            <View style={styles.cardInfoContainer}>
              <View style={styles.cardDetailsContainer}>
                <View style={styles.cardIconContainer}>
                  <Mastercard />
                </View>
                <View style={styles.cardTextContainer}>
                  <Text style={styles.cardTypeText}>MASTER CARD</Text>
                  <Text style={styles.cardNumberText}>Debit........45789</Text>
                </View>
              </View>
              <TouchableOpacity
                onPress={() => setOpenBottomSheet(true)}
                style={styles.deleteButton}
              >
                <Delete />
              </TouchableOpacity>
            </View>
            <Button
              style={{ borderRadius: 10, padding: 3, marginTop: 30 }}
              labelStyle={{ fontWeight: "bold", flex: 1 }}
              buttonColor={colors.primary}
              mode="contained"
              textColor="white"
              onPress={() => setAddCard(true)}
            >
              Add new card
            </Button>
          </View>
        ) : (
          <AddNewCard setPages={setPages} />
        )}
      </Layout.ScrollView>

      {openBottomSheet && (
        <BottomSheet
          ref={bottomSheetRef}
          index={1}
          snapPoints={snapPoints}
          style={{ padding: 0 }}
          onChange={(index) => {
            if (index === -1 || index === 0) {
              closeBottomSheet();
            }
          }}
        >
          <View style={{ paddingHorizontal: 20 }}>
            <View style={[styles.deleteButton, { alignSelf: "center" }]}>
              <Delete />
            </View>
            <Text style={{ textAlign: "center", fontWeight: "700", fontSize: 17, marginTop: 8 }}>Are you sure?</Text>
            <View
              style={{ flexDirection: "row", alignItems: "center", gap: 20 }}
            >
              <Button
                style={{ borderRadius: 10, padding: 3, marginTop: 30, flex: 1 }}
                labelStyle={{ fontWeight: "bold", flex: 1 }}
                buttonColor={colors.primary}
                mode="contained"
                textColor="white"
                //   onPress={() => setAddCard(true)}
              >
                Yes, delete
              </Button>
              <Button
                style={{ borderRadius: 10, padding: 3, marginTop: 30, flex: 1 }}
                labelStyle={{ fontWeight: "bold", flex: 1 }}
                buttonColor={colors.secondary}
                mode="contained"
                textColor={colors.primary}
                  onPress={() => setOpenBottomSheet(false)}
              >
                Go back
              </Button>
            </View>
          </View>
        </BottomSheet>
      )}
    </Layout>
  );
};

const styles = StyleSheet.create({
  headerText: {
    color: colors.darkGrey,
    fontWeight: "bold",
    fontSize: 24,
    //   textAlign: "center",
  },
  container: {
    flex: 1,
    // alignItems: "flex-start",
    // justifyContent: "flex-start",
    // width: "100%",
    // marginTop: 48,
    // paddingHorizontal: 20,
  },
  cardsText: {
    fontSize: 12,
    color: "#475467",
    fontWeight: "500",
  },
  cardInfoContainer: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    width: "100%",
    marginTop: 20,
  },
  cardDetailsContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
  },
  cardIconContainer: {
    alignItems: "center",
    justifyContent: "center",
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#F2F4F7",
  },
  cardTextContainer: {
    alignItems: "flex-start",
    justifyContent: "flex-start",
    marginLeft: 20,
  },
  cardTypeText: {
    fontSize: 16,
    color: "#475467",
    fontWeight: "700",
  },
  cardNumberText: {
    fontSize: 14,
    color: "#475467",
    fontWeight: "500",
    paddingTop: 4,
  },
  deleteButton: {
    alignItems: "center",
    justifyContent: "center",
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#FCE6E6",
  },
  buttonContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    marginTop: 96,
  },
  addButton: {
    alignItems: "center",
    justifyContent: "center",
    height: 44,
    width: "100%",
    borderRadius: 8,
    backgroundColor: "#0077B6",
  },
  addButtonText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#FFFFFF",
  },
});

export default ManageCards;
