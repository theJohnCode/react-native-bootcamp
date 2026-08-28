import { Button, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useReducer, useState } from 'react';
import { bankReducer, initialState } from '@/reducers/BankReducer';

export default function ExploreScreen() {
  const [state, dispatch] = useReducer(bankReducer, initialState);
  const [amount, setAmount] = useState('');
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.content}>
        <Text style={styles.title}>Account Balance: {state.balance}</Text>
        {/* <Text style={styles.subtitle}>Browse more ZoweHub laptop discoveries here.</Text> */}

        <TextInput
          value={amount}
          onChangeText={setAmount}
          placeholder="Enter deposit amount"
          keyboardType="numeric"
          style={{ borderWidth: 1, borderColor: '#ccc', padding: 8, marginVertical: 12 }}
        />

        {/* Add button to withdraw and deposit */}
        <Pressable style={{
          backgroundColor: '#1D9E75',
          padding: 12,
          borderRadius: 8,
          marginBottom: 12,
          alignItems: 'center',
        }}
          onPress={() => {
            dispatch({ type: "DEPOSIT", amount: Number(amount) });
            setAmount('')
          }
          }>
          <Text>DEPOSIT</Text>
        </Pressable>


        <Pressable style={{
          backgroundColor: '#EF4444',
          padding: 12,
          borderRadius: 8,
          marginBottom: 12,
          alignItems: 'center'
        }} onPress={() => {
          dispatch({ type: "WITHDRAW", amount: Number(amount) });
          setAmount('');
        }}>
          <Text>WITHDRAW</Text>
        </Pressable>

        <Pressable style={{
          backgroundColor: '#1bdaba68',
          padding: 12,
          borderRadius: 8,
          marginBottom: 12,
          alignItems: 'center'
        }} onPress={() => dispatch({ type: "RESET" })}>
          <Text>RESET</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  content: {
    flex: 1,
    padding: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: '#111827',
  },
  subtitle: {
    marginTop: 8,
    fontSize: 15,
    lineHeight: 22,
    color: '#6b7280',
  },
});
