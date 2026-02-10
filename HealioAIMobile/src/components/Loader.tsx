import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Easing,
  Modal,
  Image,
  StatusBar,
} from 'react-native';

interface LoaderProps {
  visible: boolean;
}

export const Loader: React.FC<LoaderProps> = ({ visible }) => {
  const rotateAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      startRotation();
    } else {
      rotateAnim.setValue(0);
    }
  }, [visible]);

  const startRotation = () => {
    rotateAnim.setValue(0);
    Animated.loop(
      Animated.timing(rotateAnim, {
        toValue: 1,
        duration: 1500,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    ).start();
  };

  const spin = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  if (!visible) return null;

  return (
    <Modal visible={visible} transparent={true} animationType="fade">
      <StatusBar backgroundColor="rgba(0,0,0,0.5)" barStyle="light-content" />
      <View style={styles.overlay}>
        <View style={styles.dialog}>
          {/* Rotating Ring Container */}
          <View style={styles.loaderWrapper}>
            <Animated.View
              style={[
                styles.rotatingRing,
                {
                  transform: [{ rotate: spin }],
                },
              ]}
            />
            
            {/* Static Logo in Center */}
            <View style={styles.logoContainer}>
              <Image
                source={require('../assets/images/Vector.png')}
                style={styles.logo}
                resizeMode="contain"
              />
            </View>
          </View>

          <Text style={styles.text}>Preparing your care experience...</Text>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dialog: {
    backgroundColor: '#0A5FB4',
    borderRadius: 24,
    paddingVertical: 32,
    paddingHorizontal: 24,
    alignItems: 'center',
    width: '85%',
    maxWidth: 340,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  loaderWrapper: {
    width: 120,
    height: 120,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  rotatingRing: {
    position: 'absolute',
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 3,
    borderColor: 'transparent',
    borderTopColor: '#4CAF50', // Bright Green
    borderRightColor: 'rgba(76, 175, 80, 0.5)', // Fading Green
  },
  logoContainer: {
    width: 80,
    height: 80,
    backgroundColor: 'white',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  logo: {
    width: '80%',
    height: '80%',
  },
  text: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '500',
    letterSpacing: 0.5,
    textAlign: 'center',
  },
});
