import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { capitalize, hp } from '@/helpers/common';
import { theme } from '@/constants/theme';


export const CommonFiltersRow = (props: any) => {
    const { data, filterName, filters, setFilters } = props;
    // console.log(data)
    const onSelect = (item: any) => {
        setFilters({...filters, [filterName]: item});
        // console.log(filters)
    }

    return (
        <>
        <View style={styles.flexRowWrap}>
            {
                data && data?.map((item: any, index: number) => {
                    const isActive = filters && filters[filterName] === item;
                    let backgroundColor = isActive ? theme.colors.neutral(0.7) : "white";
                    let color = isActive ? "white" : theme.colors.neutral(0.7);

                    return (
                        <TouchableOpacity onPress={() => onSelect(item)} activeOpacity={0.7} key={index} style={[styles.outlinedButton, {backgroundColor}]}>
                            <Text style={[styles.outlinedButtonText, {color}]}>{capitalize(item)}</Text>
                        </TouchableOpacity>
                    )
                })
            }

        </View>
        </>
    )
}

export const ColorFilter = (props: any) => {
    const { data, filterName, filters, setFilters } = props;
    // console.log(data)
    const onSelect = (item: any) => {
        setFilters({...filters, [filterName]: item});
        // console.log(filters)
    }

    return (
        <>
        <View style={styles.flexRowWrap}>
            {
                data && data?.map((item: any, index: number) => {
                    const isActive = filters && filters[filterName] === item;
                    let borderColor = isActive ? theme.colors.neutral(0.4) : "white";

                    return (
                        <TouchableOpacity onPress={() => onSelect(item)} activeOpacity={0.7} key={index} style={[styles.outlinedButton, {borderColor}]}>
                            <View style={[styles.colorWrapper]}>
                                <View style={[styles.color, {backgroundColor: item }]}></View>
                            </View>
                        </TouchableOpacity>
                    )
                })
            }

        </View>
        </>
    )
}


const SectionView = ({title, content}: { title: string; content: any }) => {
    return (
        <>
        <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>{title}</Text>
            <View>{content}</View>
        </View>
        </>
    )
}

export default SectionView

const styles = StyleSheet.create({
    sectionContainer: {
        gap: 8
    },
    sectionTitle: {
        fontSize: hp(2.4),
        fontWeight: theme.fontWeights.medium,
        color: theme.colors.neutral(0.8)
    },
    flexRowWrap: {
        gap: 10,
        flexDirection: "row",
        flexWrap: "wrap",
    },
    outlinedButton: {
        padding: 8,
        paddingHorizontal: 14,
        borderWidth: 1,
        borderColor: theme.colors.grayBG,
        borderRadius: theme.radius.xs,
        borderCurve: "continuous",
    },
    outlinedButtonText: {},
    colorWrapper: {
        padding: 3,
        borderRadius: theme.radius.sm,
        borderCurve: "continuous",
        borderWidth: 2,
    },
    color: {
        height: 30,
        width: 40,
        borderRadius: theme.radius.sm-3,
        borderCurve: "continuous",
    },
})