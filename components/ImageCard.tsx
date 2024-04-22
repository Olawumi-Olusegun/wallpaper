import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { Image } from 'expo-image'
import React from 'react'
import { getImageSize, wp } from '@/helpers/common';
import { theme } from '@/constants/theme';
import { Router } from 'expo-router';

interface ImageCardProps {
  item: any; 
  index: number; 
  columns: number;   
  router: Router;
}

const ImageCard = ({ item, index, columns, router }: ImageCardProps) => {

    
    const getImageHeight = () => {
        let { imageHeight: height, imageWidth: width } = item;
        return { height: getImageSize(height, width) }
    }

    const isLastInRow = () => {
        return (index + 1) % columns === 0;
    }


  return (
    <TouchableOpacity onPress={() => router.push({ pathname: "/home/image" , params: {...item}}) } activeOpacity={0.7} style={[styles.imageWrapper, !isLastInRow() && styles.spacing]}>
      <Image
        style={[styles.image, getImageHeight()]}
        source={item?.webformatURL}
        transition={100}
      />
    </TouchableOpacity>
  )
}

export default ImageCard

const styles = StyleSheet.create({
    image: {
        height: 300,
        width: "100%"
    },
    imageWrapper: {
        backgroundColor: theme.colors.grayBG,
        borderRadius: theme.radius.xl,
        borderCurve: "continuous",
        overflow: "hidden",
        marginBottom: wp(4)
    },
    spacing: {
        marginRight: wp(2),
        marginBottom: wp(2)
    }
})