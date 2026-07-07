import { useState } from 'react';
import { Button, Image, StyleSheet, Text, View } from 'react-native';



const About = () => {
    const [counter, setCounter] = useState(0);
    return (
        <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
            <Text>Counter</Text>
            <View style={{ flex: 1, width: 250, height: 200, alignItems: "center", justifyContent: "center" }}>

                {/* Makke a counter button */}
                <Text style={{fontWeight: "700", fontSize: 20}}>{counter}</Text>
                <Button title='Click Me' onPress={ () => setCounter(counter - 9)}></Button>
                {/* <Image source={require('../../assets/images/mock-ui.png')} style={{ marginLeft: 30 }} /> */}
            </View>
        </View>
    )
}

export default About

const styles = StyleSheet.create({})