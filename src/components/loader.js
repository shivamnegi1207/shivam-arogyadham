import React from 'react'
import { Image, Modal, View } from 'react-native'

const Loader = () => {
  return (
          <Modal>
            <View style={{flex:1,justifyContent:'center',alignItems:'center'}}>
              <Image source={require('../../assets/images/afterChildDetails.png')} resizeMode='contain' style={{height:160,width:160}}/>
            </View>
          </Modal>
  )
}

export default Loader