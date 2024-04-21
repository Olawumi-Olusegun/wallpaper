import { ActivityIndicator, Alert, Platform, Pressable, StyleSheet, Text, View } from 'react-native'
import React, { useState } from 'react'
import { BlurView } from 'expo-blur'
import { hp, wp } from '@/helpers/common'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { Entypo, Ionicons, Octicons } from '@expo/vector-icons';
import { Image } from 'expo-image'
import { theme } from '@/constants/theme'
import Animated, { FadeInDown } from 'react-native-reanimated'
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import Toast, { ToastConfig, ToastConfigParams } from 'react-native-toast-message';

const ImageScreen = () => {
    const router = useRouter();
    const [status, setStatus] = useState<"loading" | "downloading" | "sharing" | null>("loading");
    const item = useLocalSearchParams();

    let uri = item?.webformatURL as string;
    const fileName = (item?.previewURL as string)?.split("/").pop();
    const imageUrl = uri;
    const filePath = `${FileSystem.documentDirectory}${fileName}`;

    const getSize = () => {
        const aspectRatio: number = (item?.imageWidth as any) / (item?.imageHeight as any);
        const maxWidth = Platform.OS === "web" ? wp(50) : wp(92);
        let calculatedHeight = maxWidth / aspectRatio;
        let calculatedWidth = maxWidth;

        if(aspectRatio < 1) {
            calculatedWidth = calculatedHeight * aspectRatio;
        }

        return {
            width: calculatedWidth,
            height: calculatedHeight
        }
    }   

    const onLoad = () => setStatus(null);

    const handleDownload = async () => {
        
        if(Platform.OS === "web") {
            const anchor = document.createElement("a");
            anchor.href = imageUrl;
            anchor.target = "_blank",
            anchor.download = fileName || "download";
            document.body.appendChild(anchor);
            anchor.click();
            document.removeChild(anchor);
            
            showToast("Image downloaded");
        } else {
            let uri = await downloadFile();
            if(uri) {
                showToast("Image downloaded")
            }
        }
    }

    const handleShare = async () => {
        setStatus('sharing');
        try {
            if(Platform.OS === "web") {
                showToast("Link Copied")
            } else {
                let uri = await downloadFile();
                if(uri) {
                    await Sharing.shareAsync(uri);
                }
            }
        } catch (error) {
            
        } finally {
            setStatus(null);
        }
    }

    const downloadFile = async () => {
        setStatus("downloading");
        try {
            const { uri } = await FileSystem.downloadAsync(imageUrl, filePath)
            return uri;
        } catch (error: any) {
            Alert.alert("Image message", error?.message)
            console.log(error)
            return null
        } finally {
            setStatus(null);
        }
    }

    const showToast = (message: string) => {
        Toast.show({
          type: 'success',
          text1: message,
          position: "bottom"
        });
      }

    const toastConfig: ToastConfig | undefined = {
        success: ({text1, props, ...rest}: ToastConfigParams<any>) => {
            return (
                <View style={styles.toast}>
                    <Text style={styles.toastText}>{text1}</Text>
                </View>
            )
        }
    }

  return (
    <BlurView tint='dark' intensity={60} style={styles.container}>
      <View style={getSize()}>
        <View style={styles.loading}>
            {
                status === "loading" && <ActivityIndicator color="white" size="large" />
            }
        </View>
        <Image 
         source={uri}
         style={[styles.image, getSize() ]}
         transition={100}
         onLoad={onLoad}
        />
      </View>
      <Pressable onPress={ () => router.back() } style={styles.backButton}>
        <Ionicons name="arrow-back" size={14} color="black" />
        <Text style={{ color: "white" }}>Back</Text>
      </Pressable>
      <View style={styles.buttons}>

        <View>

            <Animated.View entering={FadeInDown.springify()} >
                <Pressable style={styles.button}>
                    <Octicons name='x' size={24} color="white" onPress={() => router.back()} />
                </Pressable>
            </Animated.View>

            <Animated.View entering={FadeInDown.springify().delay(100)} >
                {
                    status === "downloading" 
                    ? (
                        <>
                         <View style={styles.button}>
                            <ActivityIndicator size="small" color="white" />
                         </View>
                        </>
                    )
                    : (
                    <Pressable style={styles.button} onPress={handleDownload}>
                        <Octicons name='download' size={24} color="white" />
                    </Pressable>

                    )
                }
            </Animated.View>

            <Animated.View entering={FadeInDown.springify().delay(200)} >
                {
                        status === "sharing" 
                        ? (
                            <>
                            <View style={styles.button}>
                                <ActivityIndicator size="small" color="white" />
                            </View>
                            </>
                        )
                        : (
                        <Pressable style={styles.button} onPress={handleShare}>
                            <Entypo name='share' size={24} color="white" />
                        </Pressable>

                        )
                    }

            </Animated.View>

        </View>
      </View>

      <Toast config={toastConfig} visibilityTime={2500} />

    </BlurView>
  )
}

export default ImageScreen

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        paddingHorizontal: wp(4),
        backgroundColor: "rgba(0,0,0,0.5)",
    },
    backButton: {
        display: "flex",
        alignItems:"center",
        justifyContent: "center",
        padding: 5,
        borderRadius: 5,
        borderCurve: "circular",
        gap: 3,
    },
    image: {
        borderRadius: theme.radius.lg,
        borderWidth: 2,
        backgroundColor: 'rgba(255,255,255,0.1)',
        borderColor: 'rgba(255,255,255,0.1)', 
    },
    loading: {
        position: "absolute",
        width: "100%",
        height: "100%",
        justifyContent: "center",
        alignItems: "center"
    },
    buttons: {
        marginTop: 14,
        flexDirection: "row",
        alignItems: "center",
        gap: 50,
    },
    button: {
        height: hp(6),
        width: wp(6),
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(255,255,255,0.2)",
        borderRadius: theme.radius.lg,
        borderCurve: "continuous"
    },
    toast: {
        padding: 15,
        paddingHorizontal: 30,
        borderRadius: theme.radius.xl,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(255,255,255,0.15)",
    },
    toastText: {
        fontSize: hp(1.8),
        fontWeight: theme.fontWeights.semibold,
        color: theme.colors.white
    },
})