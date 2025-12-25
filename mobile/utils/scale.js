// utils/scaleFont.js
import { Dimensions, PixelRatio } from 'react-native';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const BASE_WIDTH = 1080; // canva's layout width in px

const scale = SCREEN_WIDTH / BASE_WIDTH;

export const pxToPt = (px) => Math.round(PixelRatio.roundToNearestPixel(px * scale));
