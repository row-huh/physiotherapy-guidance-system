import { Text, View } from "react-native";
import { Link } from "expo-router"
import { StyleSheet } from "react-native";
import { supabase } from "@/lib/supabase";


export default function Index() {


  // dummy code - it was just to test if connection to supabase is succesful or not

  // async function testConnection() {
  //   const { data, error } = await supabase.from('test').select('id').limit(1);
  //   if (error) console.log('Connection failed', error);
  //   else console.log('Connected');
  // }

  // testConnection()

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Text>Hello , Log in to proceed</Text>
      
      <Link href="/(doctor-portal)/" style={styles.button}>Log in as a doctor</Link>
      <Link href="/(patient-portal)/" style={styles.button}>Log in as a patient</Link>
      <Link href="/demo" style={styles.button}>Testing Grounds</Link>
    </View>
  );
}


const styles = StyleSheet.create({
button: {
  backgroundColor: 'lime',
  paddingVertical: 12,
  paddingHorizontal: 20,
  borderRadius: 6,
  shadowColor: '#000',
  shadowOpacity: 0.25,
  shadowOffset: { width: 0, height: 2 },
  shadowRadius: 3,
  elevation: 4
}
})