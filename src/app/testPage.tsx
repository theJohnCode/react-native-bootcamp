import { BannerContext } from '@/contexts/BannerContext'
import { useContext } from 'react'
import { Text, View } from 'react-native'

const Child = ({ accountBalance }: { accountBalance: number }) => {
  return (
    <View>
      <Text>Child</Text>
      <Text>Account Balance: ${accountBalance}</Text>
    </View>
  )
}

const Parent = ( { accountBalance }: { accountBalance: number } ) => {
  return (
    <View>
        <Text>Parent</Text>
        <Text>Account Balance: ${accountBalance}</Text>
    </View>
  )
}

export default function TestPage() {
  const accountBalance = 1000;
  return (
    <View>
      <Text>TestPage</Text>
      <Parent accountBalance={accountBalance} />
      <Child accountBalance={accountBalance} />
      <Child accountBalance={accountBalance} />
    </View>
  )
}