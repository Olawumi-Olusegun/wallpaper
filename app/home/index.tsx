import React, { useCallback, useEffect, useRef, useState } from 'react'
import { View, Text, StyleSheet, Pressable, ScrollView, TextInput, TouchableOpacity, ActivityIndicator, NativeSyntheticEvent, NativeScrollEvent } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Feather, FontAwesome6, Ionicons } from '@expo/vector-icons';
import { theme } from '@/constants/theme';
import { hp, wp } from '@/helpers/common';
import Categories from '@/components/Categories';
import { fetchWallpaperImages } from '@/api';
import ImageGrid from '@/components/ImageGrid';
import { debounce } from "lodash"
import FiltersModal from '@/components/FiltersModal';
import { BottomSheetModal } from '@gorhom/bottom-sheet';
import { filters as FilterItems } from "@/constants/data"
import { useRouter } from 'expo-router';

interface FetchParams {
    params: {
        page: number;
        q?: string;
        category?: string;
    },
    append?: boolean;
}


let page: number = 1;

const HomeScreen = () => {

    const [isEndReached, setIsEndReached] = useState(false);
    const [searchInput, setSearchInput] = useState("");
    const [images, setImages] = useState([]);
    const [activeCategory, setActiveCategory] = useState<string | null>(null);
    const [filters, setFilters] = useState<{[key: string]: any}>({});
    const searchInputRef = useRef<TextInput | null>(null)
    const scrollRef = useRef<ScrollView | null>(null)
    const bottomSheetModalRef = useRef<BottomSheetModal>(null);



    const router = useRouter();

    const applyFilters = () => {
        if(filters) {
            let paramItem: FetchParams = {
                params: {
                    page,
                    ...filters
                }

            };
            setImages([]);
            if(activeCategory) {
                paramItem.params.category = activeCategory;
            }

            if(searchInput) {
                paramItem.params.q = searchInput;
            }

            paramItem.append = false;
            fetchImages(paramItem)
        }
        handleCloseModalPress();
    }

    const resetFilters = () => {
        if(filters) {
            let paramItem: FetchParams = {
                params: {
                    page,
                }

            };

            setImages([]);
            setFilters({});
          
            if(activeCategory) {
                paramItem.params.category = activeCategory;
            }

            if(searchInput) {
                paramItem.params.q = searchInput;
            }

            paramItem.append = false;
            fetchImages(paramItem)

        }
            
        setFilters({})
        handleCloseModalPress();
    }

    const handleChangeCategory = (categoryItem: string | null) => {
        let paramItem: FetchParams = {
            params: {
                page,
                ...filters
            }

        };

        setActiveCategory(categoryItem)
        handleClearSearch();
        setImages([])
        if(categoryItem) {
            paramItem.params.category = categoryItem;
        }
        paramItem.append = false;
        fetchImages(paramItem)
    }

    const fetchImages = async ({ params, append = false }: FetchParams) => {

        // console.log({ params })

        if(params.q == "") {
            delete params.q;
        }

        try {
            let response = await fetchWallpaperImages({ params });
           
            if(response.success && response.data?.hits) {
                // console.log({ data: response.data?.hits })
                if(append) {
                    setImages([...images, ...response.data?.hits as []])
                } else {
                    setImages([...response.data?.hits as []])
                }
            }
        } catch (error) {
            console.log(error)
        }
    }

    const handleSearch = (text: string) => {

        setSearchInput(text)
        if(text.length > 2) {
            setImages([]);
            setActiveCategory(null);
            fetchImages({ params: { page, q: text, ...filters }, append: false })
        }

        if(text === "") {
            const page = 1;
            searchInputRef?.current?.clear();
            setImages([]);
            setActiveCategory(null);
            fetchImages({ params: { page, ...filters}, append: false })
        }
    }

    const handleTextDebounce = useCallback(debounce(handleSearch, 400), []);

    const handleClearSearch = () => {
        setSearchInput("");
        searchInputRef?.current?.clear();
    }

    const clearThisFilter = (filterName: any) => {
        let filterItems = { ...filters }
        delete filterItems[filterName];
        fetchImages({ params: { page, ...filterItems }, append: false });

        let paramItem: FetchParams = {
            params: {
                page,
                ...filterItems
            }

        };
        setImages([])

        if(activeCategory) {
            paramItem.params.category = activeCategory;
        }

        if(searchInput) {
            paramItem.params.q = searchInput;
        }

        paramItem.append = false;
        fetchImages(paramItem)
    }

    const handleScroll = async (event: NativeSyntheticEvent<NativeScrollEvent>) => {
        const contentHeight = event.nativeEvent.contentSize.height;
        const scrollViewHeight = event.nativeEvent.layoutMeasurement.height;
        const scrollViewOffset = event.nativeEvent.contentOffset.y;

        const bottomPosition = contentHeight - scrollViewHeight;
        if(scrollViewOffset >= bottomPosition - 1) {
            // reached bottom of scrollview
            if(!isEndReached) {
                setIsEndReached(true)
                // fetch more images and increase page numbers
                ++page;
                let paramItem: FetchParams = {
                    params: {
                        page,
                    }
        
                };
                if(activeCategory) {
                    paramItem.params.category = activeCategory;
                }
        
                if(searchInput) {
                    paramItem.params.q = searchInput;
                }
        
                paramItem.append = false;
                fetchImages(paramItem)
            }
        } else if(isEndReached) {
            setIsEndReached(false);
        }
        scrollRef.current?.scrollTo({
            y: 0,
            animated: true,
        });
    }

        // callbacks
    const handlePresentModalPress = useCallback(() => {
        bottomSheetModalRef.current?.present();
    }, []);

        // callbacks
    const handleCloseModalPress = useCallback(() => {
        bottomSheetModalRef.current?.close();
    }, []);

    useEffect(() => {
        fetchImages({ params: { page,} })
    }, [])

  return (
    <SafeAreaView style={[styles.container]}>
    <View style={styles.header}>
      <Pressable>
        <Text style={styles.title}>Pixels</Text>
      </Pressable>
      <Pressable onPress={handlePresentModalPress}>
        <FontAwesome6 name="bars-staggered" size={22} color={theme.colors.neutral(0.7)} />
      </Pressable>
    </View>

    <ScrollView
    // onScroll={handleScroll}
    // scrollEventThrottle={5}
    ref={scrollRef}
    contentContainerStyle={{ gap: 15, }}>
        <View style={styles.searchBar}>
            <View style={styles.searchIcon}>
                <Feather name='search' size={24} color={theme.colors.neutral(0.4)} />
            </View>
            <TextInput
            ref={searchInputRef}  
            onChangeText={handleTextDebounce} 
            placeholder='Search for photos' 
            style={styles.searchInput} 
            />
            
            {
                searchInput && (
                    <TouchableOpacity onPress={() => handleSearch("")} activeOpacity={0.5} style={styles.closeIcon}>
                        <Ionicons name='close' size={24} color={theme.colors.neutral(0.6)} />
                    </TouchableOpacity>
                )
            }
        </View>

        <View style={styles.categories}>
            <Categories 
            activeCategory={activeCategory} 
            handleChangeCategory={handleChangeCategory} 
            />
        </View>

            {
                filters &&  (
                    <View style={{flexGrow: 1,  backgroundColor: "red"}}>
                        <ScrollView 
                        showsHorizontalScrollIndicator={false}
                        horizontal
                        contentContainerStyle={styles.filters}
                        >
                            {
                                Object.keys(filters as {[key: string]: any}).map((key, index) => {
                                    return (
                                        <View key={index} style={styles.filterItem}>
                                            {
                                                key === "clors" 
                                                ? ( <View style={{ height: 20, width: 30, borderRadius: 7, backgroundColor: filters[key] }}>
                                                    </View>)
                                                    : (

                                                        <Text style={styles.filterItemText}>{filters[key]}</Text>
                                                    )
                                                
                                            }
                                            <TouchableOpacity 
                                            activeOpacity={0.7} 
                                            onPress={() => clearThisFilter(key)}
                                            style={styles.filterClose}
                                            >
                                            <Ionicons name='close' size={14} color={theme.colors.neutral(0.9)} />
                                            </TouchableOpacity>
                                        </View>
                                    )
                                } )
                            }
                        </ScrollView>
                    </View>
                )
                
            }

        <View style={{ flex: 1, flexGrow: 1 }}>
            {images.length > 0 &&  <ImageGrid images={images} router={router} />}
        </View>

        <View style={{marginBottom: 70, marginTop: images.length > 0 ? 10 : 70}}>
            <ActivityIndicator size="large" />
        </View>


    </ScrollView>


    <FiltersModal 
    modalRef={bottomSheetModalRef}
    filters={filters}
    setFilters={setFilters}
    onClose={handleCloseModalPress}
    onApply={applyFilters}
    onReset={resetFilters}
    />


    </SafeAreaView>
  )
}

export default HomeScreen

const styles = StyleSheet.create({
    container: {
        flex: 1,
        gap: 15,
        marginTop: 10
    },
    header: {
        marginHorizontal: wp(4),
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    title: {
        fontSize: hp(4),
        fontWeight: theme.fontWeights.semibold,
        color: theme.colors.neutral(0.9)
    },
    searchBar: {
        marginHorizontal: wp(4),
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        borderWidth: 1,
        borderColor: theme.colors.grayBG,
        backgroundColor: theme.colors.white,
        padding: 6,
        borderRadius: theme.radius.lg,
    },
    searchIcon: {
        padding: 8
    },
    searchInput: {
        flex: 1,
        paddingVertical: 6,
        fontSize: hp(1.8),
        fontWeight: theme.fontWeights.semibold,
        color: theme.colors.neutral(0.5)
    },
    closeIcon: {
        padding: 8,
        borderRadius: theme.radius.sm,
        backgroundColor: theme.colors.neutral(0.1),

    },
    categories: {},
    filters: {
        flex: 1,
        paddingHorizontal: wp(4),
        gap: 10,
    },
    filterItem: {
        backgroundColor: theme.colors.grayBG,
        padding: 3,
        flexDirection: "row",
        alignItems: "center",
        borderRadius: theme.radius.xs,
        gap: 10,
        paddingHorizontal: 10,
    },
    filterItemText: {
        fontSize: hp(1.9)
    },
    filterClose: {
        backgroundColor: theme.colors.neutral(0.2),
        padding: 4,
        borderRadius: 7,

    }
})