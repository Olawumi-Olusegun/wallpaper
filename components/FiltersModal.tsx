import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useCallback, useMemo } from 'react'
import { BottomSheetModal, BottomSheetView } from '@gorhom/bottom-sheet'
import { BlurView } from 'expo-blur';
import Animated, { Extrapolation, FadeInDown, interpolate, useAnimatedStyle } from 'react-native-reanimated';
import { hp } from '@/helpers/common';
import { theme } from '@/constants/theme';
import SectionView, { ColorFilter, CommonFiltersRow } from './SectionViews';
import { capitalize } from 'lodash';
import { filters as FilterItems } from "@/constants/data"



interface FiltersModalProps {
    modalRef: any;
    filters: any;
    setFilters: any;
    onClose: any;
    onApply: any;
    onReset: any;
}

const FiltersModal = ({modalRef, filters, setFilters, onClose, onApply, onReset}:FiltersModalProps) => {

    const snapPoints = useMemo(() => ['75%'], []);



    const handleSheetChanges = useCallback((index: number) => {
      console.log('handleSheetChanges', index);
    }, []);


    const CustomBackdrop = ({animatedIndex, style}: { animatedIndex: any; style?: any; }) => {
        const containerAnimatedStyle = useAnimatedStyle(() => {
            let opacity = interpolate(
                animatedIndex.value,
                [-1, 0],
                [0, 1],
                Extrapolation.CLAMP,
            )
            return { opacity }
        });

        const containerStyle = [
            style,
            styles.overlay,
            StyleSheet.absoluteFill,
            containerAnimatedStyle
        ];

        return (
            <Animated.View style={containerStyle}>
                <BlurView
                tint='dark'
                intensity={25}
                style={StyleSheet.absoluteFill}>
                </BlurView>
            </Animated.View>
        )
    }

    const sections:{[key: string] : any} = {
        "order": (props: any) => <CommonFiltersRow {...props} />,
        "orientation": (props: any) => <CommonFiltersRow {...props} />,
        "type": (props: any) => <CommonFiltersRow {...props} />,
        "colors": (props: any) => <ColorFilter {...props} />,
    }



  return (
    // <View style={styles.container}>
        <BottomSheetModal
        ref={modalRef}
        index={0}
        snapPoints={snapPoints}
        // onChange={handleSheetChanges}
        enablePanDownToClose={true}
        backdropComponent={CustomBackdrop}
        >
        <BottomSheetView style={styles.contentContainer}>
        <View style={styles.content}>
        {
            Object.keys(sections).map((sectionName, index: number) => {
                let sectionView = sections[sectionName];
                let title = capitalize(sectionName);
                const sectionData = filters[sectionName]
  
                return (
                <Animated.View 
                 entering={FadeInDown.delay((index * 100) + 100).springify().damping(11)}
                key={index}>
                    <SectionView 
                     title={title}
                     content={sectionView({
                        data: sectionData,
                        filters,
                        setFilters,
                        filterName: sectionName
                     })}
                    />
                </Animated.View>
                )
            })
        }
        <Animated.View 
         entering={FadeInDown.delay(500).springify().damping(11)}
        style={styles.buttons}>
            <TouchableOpacity 
            activeOpacity={0.7} 
            onPress={onReset} 
            style={styles.resetButton}
            >
                <Text style={[styles.buttonText, { color: theme.colors.neutral(0.9)}]}>Reset</Text>
            </TouchableOpacity>

            <TouchableOpacity 
            activeOpacity={0.7} 
            onPress={onApply} 
            style={styles.applyButton}
            >
                <Text style={[styles.buttonText, { color: theme.colors.white }]}>Apply</Text>
            </TouchableOpacity>
        </Animated.View>
        </View>
        </BottomSheetView>
    </BottomSheetModal>
    // </View>
  )
}

export default FiltersModal

const styles = StyleSheet.create({
    container: {
      flex: 1,
      gap: 15,
      padding: 24,
      justifyContent: 'center',
      backgroundColor: 'grey',
    },
    contentContainer: {
      flex: 1,
      alignItems: 'center',
    },
    overlay: {
        backgroundColor: "rgba(0,0,0,0.5)",
    },
    content: {
        flex: 1,
        gap: 15,
        paddingVertical: 15,
        paddingHorizontal: 20,
        width: "100%"
    },
    filterText: {
        fontSize: hp(4),
        fontWeight: theme.fontWeights.semibold,
        color: theme.colors.neutral(0.8),
        marginBottom: 5
    },
    buttons: {
        flex: 1,
        flexDirection: "row",
        alignItems: "center",
        gap: 10,
    },
    applyButton: {
        flex: 1,
        backgroundColor: theme.colors.neutral(0.8),
        padding: 12,
        alignItems: "center",
        justifyContent: "center",
        borderRadius: theme.radius.md,
        borderCurve: "continuous",
    },
    resetButton: {
        flex: 1,
        backgroundColor: theme.colors.neutral(0.03),
        padding: 12,
        alignItems: "center",
        justifyContent: "center",
        borderRadius: theme.radius.md,
        borderCurve: "continuous",
        borderColor: theme.colors.grayBG,
        borderWidth: 2,
    },
    buttonText: {
        fontSize: hp(2.2)
    },
    applyButtonText: {},
  });