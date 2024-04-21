import { Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native'
import React from 'react'
import { categories } from '@/constants/data'
import { hp, wp } from '@/helpers/common';
import { theme } from '@/constants/theme';
import Animated, { FadeInRight } from 'react-native-reanimated';

interface CategoryProps {
    activeCategory: string | null;
    handleChangeCategory: (category: string | null) => void;
}

interface CategoryItemProps {
    title: string; 
    index: number;
    isActive: boolean;
    handleChangeCategory: (category: string | null) => void;
}

const CategoryItem = ({title, index, isActive, handleChangeCategory}: CategoryItemProps) => {
    const color = isActive ? theme.colors.white : theme.colors.neutral(0.8);
    const backgroundColor = isActive ? theme.colors.neutral(0.8) : theme.colors.white;

    return (
        <>
         <Animated.View entering={FadeInRight.delay(index*200).duration(1000).springify().damping(14)}>
            <TouchableOpacity 
            onPress={() => handleChangeCategory(isActive ? null : title) }
            activeOpacity={0.5} style={[styles.category, { backgroundColor }]}>
                <Text style={[styles.title, {color}]}>{title}</Text>
            </TouchableOpacity>
         </Animated.View>
        </>
    )
}

const Categories = ({activeCategory, handleChangeCategory}: CategoryProps) => {
  return (
    <FlatList 
     data={categories}
     horizontal
     contentContainerStyle={styles.flatlistContainer}
     showsHorizontalScrollIndicator={false}
     keyExtractor={(item) => item}
     renderItem={({item, index}) => (
        <CategoryItem 
        title={item} 
        index={index}
        isActive={activeCategory === item}
        handleChangeCategory={handleChangeCategory}
        />
     )}
    />
  )
}

export default Categories

const styles = StyleSheet.create({
    flatlistContainer: {
        paddingHorizontal: wp(4),
        gap: 8,
    },
    category: {
        padding: 12,
        paddingHorizontal: 15,
        borderWidth: 1,
        borderColor: theme.colors.grayBG,
        backgroundColor: "white",
        borderRadius: theme.radius.lg,
        borderCurve: "continuous",
    },
    title: {
        fontSize: hp(1.8),
        fontWeight: theme.fontWeights.medium
    },
})