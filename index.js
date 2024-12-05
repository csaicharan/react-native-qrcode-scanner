'use strict';

import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  Dimensions,
  Vibration,
  View,
  Text,
  TouchableWithoutFeedback,
} from 'react-native';
import { Camera, useCameraDevices } from 'react-native-vision-camera';
import { BarcodeScanner } from 'vision-camera-code-scanner';

const QRCodeScanner = ({
  onRead,
  containerStyle,
  cameraStyle,
  topContent,
  bottomContent,
}) => {
  const [isCameraActive, setCameraActive] = useState(true);
  const [isAuthorized, setAuthorized] = useState(false);
  const devices = useCameraDevices();
  const device = devices.back; // Use the back camera

  const handleBarcodeScan = barcode => {
    Vibration.vibrate();
    onRead(barcode);
  };

  useEffect(() => {
    const requestCameraPermission = async () => {
      const status = await Camera.requestCameraPermission();
      setAuthorized(status === 'authorized');
    };

    requestCameraPermission();
  }, []);

  if (device == null || !isAuthorized) {
    return (
      <View style={styles.notAuthorizedView}>
        <Text style={styles.notAuthorizedText}>Camera not authorized</Text>
      </View>
    );
  }

  return (
    <View style={[styles.mainContainer, containerStyle]}>
      {topContent && <View style={styles.infoView}>{topContent}</View>}
      <TouchableWithoutFeedback
        onPress={() => setCameraActive(!isCameraActive)}
      >
        <View style={cameraStyle}>
          {isCameraActive && (
            <Camera
              style={styles.camera}
              device={device}
              isActive={isCameraActive}
              onError={error => console.error(error)}
            >
              <BarcodeScanner onBarCodeScanned={handleBarcodeScan} />
            </Camera>
          )}
        </View>
      </TouchableWithoutFeedback>
      {bottomContent && <View style={styles.infoView}>{bottomContent}</View>}
    </View>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
  },
  infoView: {
    flex: 2,
    justifyContent: 'center',
    alignItems: 'center',
    width: Dimensions.get('window').width,
  },
  camera: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },
  notAuthorizedView: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  notAuthorizedText: {
    fontSize: 16,
    textAlign: 'center',
  },
});

export default QRCodeScanner;
