import { View, Text, TouchableOpacity } from 'react-native';
//import { RNMediapipe, switchCamera } from '@thinksys/react-native-mediapipe';

export default function Demo() {

    const onFlip = () => {
        switchCamera();
    };

    return (
        <View>
            <Text>Hello world</Text>
            <RNMediapipe 
                width={400}
                height={300}
            />

            <TouchableOpacity onPress={onFlip} >
                <Text>Switch Camera</Text>
            </TouchableOpacity>
        </View>
    )
}