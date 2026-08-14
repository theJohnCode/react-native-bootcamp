import { useEffect, useState } from 'react';
import {
    Dimensions,
    Modal,
    NativeScrollEvent,
    NativeSyntheticEvent,
    Platform,
    Pressable,
    StyleSheet,
    Text,
    View,
} from 'react-native';
import { FlatList, Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
    runOnJS,
    useAnimatedStyle,
    useSharedValue,
    withTiming,
} from 'react-native-reanimated';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
const MAX_SCALE = 4;
const DOUBLE_TAP_SCALE = 2.5;

interface ZoomableImageProps {
    uri: string;
    onZoomChange: (zoomed: boolean) => void;
}

/**
 * A single full-screen image that supports pinch-to-zoom, panning while
 * zoomed in, and double-tap to toggle zoom.
 */
function ZoomableImage({ uri, onZoomChange }: ZoomableImageProps) {
    const scale = useSharedValue(1);
    const savedScale = useSharedValue(1);
    const translateX = useSharedValue(0);
    const translateY = useSharedValue(0);
    const savedTranslateX = useSharedValue(0);
    const savedTranslateY = useSharedValue(0);

    const resetZoom = () => {
        scale.value = withTiming(1);
        translateX.value = withTiming(0);
        translateY.value = withTiming(0);
        savedScale.value = 1;
        savedTranslateX.value = 0;
        savedTranslateY.value = 0;
    };

    const pinchGesture = Gesture.Pinch()
        .onUpdate((event) => {
            scale.value = Math.min(Math.max(savedScale.value * event.scale, 1), MAX_SCALE);
        })
        .onEnd(() => {
            savedScale.value = scale.value;
            if (scale.value <= 1) {
                resetZoom();
                runOnJS(onZoomChange)(false);
            } else {
                runOnJS(onZoomChange)(true);
            }
        });

    const panGesture = Gesture.Pan()
        .onUpdate((event) => {
            if (savedScale.value > 1) {
                translateX.value = savedTranslateX.value + event.translationX;
                translateY.value = savedTranslateY.value + event.translationY;
            }
        })
        .onEnd(() => {
            savedTranslateX.value = translateX.value;
            savedTranslateY.value = translateY.value;
        });

    const doubleTapGesture = Gesture.Tap()
        .numberOfTaps(2)
        .onEnd(() => {
            if (savedScale.value > 1) {
                resetZoom();
                runOnJS(onZoomChange)(false);
            } else {
                scale.value = withTiming(DOUBLE_TAP_SCALE);
                savedScale.value = DOUBLE_TAP_SCALE;
                runOnJS(onZoomChange)(true);
            }
        });

    const composedGesture = Gesture.Race(
        doubleTapGesture,
        Gesture.Simultaneous(pinchGesture, panGesture),
    );

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [
            { translateX: translateX.value },
            { translateY: translateY.value },
            { scale: scale.value },
        ],
    }));

    return (
        <View style={styles.page}>
            <GestureDetector gesture={composedGesture}>
                <Animated.Image
                    source={{ uri }}
                    style={[styles.fullImage, animatedStyle]}
                    resizeMode="contain"
                />
            </GestureDetector>
        </View>
    );
}

interface ImageViewerModalProps {
    images: string[];
    initialIndex: number;
    visible: boolean;
    onClose: () => void;
}

export default function ImageViewerModal({
    images,
    initialIndex,
    visible,
    onClose,
}: ImageViewerModalProps) {
    const [activeIndex, setActiveIndex] = useState(initialIndex);
    const [zoomed, setZoomed] = useState(false);

    // Reset to whichever thumbnail was tapped each time the viewer opens.
    useEffect(() => {
        if (visible) {
            setActiveIndex(initialIndex);
            setZoomed(false);
        }
    }, [visible, initialIndex]);

    const handleMomentumScrollEnd = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
        const index = Math.round(event.nativeEvent.contentOffset.x / SCREEN_WIDTH);
        setActiveIndex(index);
    };

    return (
        <Modal
            visible={visible}
            transparent
            animationType="fade"
            statusBarTranslucent
            onRequestClose={onClose}
        >
            <View style={styles.overlay}>
                <Pressable style={styles.closeButton} onPress={onClose} hitSlop={12}>
                    <Text style={styles.closeIcon}>×</Text>
                </Pressable>

                {images.length > 1 && (
                    <View style={styles.counter}>
                        <Text style={styles.counterText}>
                            {activeIndex + 1} / {images.length}
                        </Text>
                    </View>
                )}

                <FlatList
                    data={images}
                    keyExtractor={(_, index) => index.toString()}
                    horizontal
                    pagingEnabled
                    scrollEnabled={!zoomed}
                    initialScrollIndex={initialIndex}
                    getItemLayout={(_, index) => ({
                        length: SCREEN_WIDTH,
                        offset: SCREEN_WIDTH * index,
                        index,
                    })}
                    showsHorizontalScrollIndicator={false}
                    onMomentumScrollEnd={handleMomentumScrollEnd}
                    renderItem={({ item }) => (
                        <ZoomableImage uri={item} onZoomChange={setZoomed} />
                    )}
                />

                {images.length > 1 && (
                    <Text style={styles.hint}>
                        {zoomed ? 'Pinch or double-tap to reset' : 'Pinch or double-tap to zoom · Swipe for more'}
                    </Text>
                )}
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.96)',
    },
    page: {
        width: SCREEN_WIDTH,
        height: SCREEN_HEIGHT,
        alignItems: 'center',
        justifyContent: 'center',
    },
    fullImage: {
        width: SCREEN_WIDTH,
        height: SCREEN_HEIGHT * 0.8,
    },
    closeButton: {
        position: 'absolute',
        top: Platform.OS === 'ios' ? 56 : 24,
        right: 16,
        zIndex: 10,
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: 'rgba(255, 255, 255, 0.15)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    closeIcon: {
        color: '#ffffff',
        fontSize: 24,
        lineHeight: 26,
    },
    counter: {
        position: 'absolute',
        top: Platform.OS === 'ios' ? 64 : 32,
        alignSelf: 'center',
        zIndex: 10,
        backgroundColor: 'rgba(255, 255, 255, 0.15)',
        borderRadius: 12,
        paddingHorizontal: 12,
        paddingVertical: 4,
    },
    counterText: {
        color: '#ffffff',
        fontSize: 13,
        fontWeight: '600',
    },
    hint: {
        position: 'absolute',
        bottom: Platform.OS === 'ios' ? 48 : 24,
        alignSelf: 'center',
        color: 'rgba(255, 255, 255, 0.7)',
        fontSize: 12,
    },
});
