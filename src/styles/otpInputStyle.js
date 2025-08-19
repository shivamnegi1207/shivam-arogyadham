import {StyleSheet} from 'react-native';

export const CELL_SIZE = 55;
export const CELL_BORDER_RADIUS = 8;

const styles = StyleSheet.create({
  codeFiledRoot: {
    height: CELL_SIZE,
    marginTop: 30,
    paddingHorizontal: 20,
    justifyContent: 'center',
  },
  cell: {
    marginHorizontal: 8,
    height: CELL_SIZE,
    width: CELL_SIZE,
    lineHeight: CELL_SIZE - 5,
    fontSize: 20,
    textAlign: 'center',
    borderRadius: CELL_BORDER_RADIUS,
    color: '#2D2D2D',
    backgroundColor: '#fff',

    // IOS
    shadowColor: '#2D2D2D',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,

    // Android
    elevation: 3,
  },
});

export default styles;