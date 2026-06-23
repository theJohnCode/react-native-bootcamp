import { Image, StyleSheet, Text, View } from 'react-native';


const About = () => {
    return (
        <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
            <Text>About</Text>
            <View style={{ flex: 1, width: 250, height: 200, alignItems: "center", justifyContent: "center" }}>
                <Image source={require('../../assets/images/mock-ui.png')} style={{ marginLeft: 30 }} />
            </View>
        </View>
    )
}

export default About

const styles = StyleSheet.create({})