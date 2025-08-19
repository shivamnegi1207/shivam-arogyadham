import React from 'react'
import { commonStyle } from '../styles/common'
import { Pressable, Text } from 'react-native'

const CommonButton = ({title, disabled = false, onpress = () =>{}, icon = "", style={}, textStyle={}}) => {
  return ( 
    <Pressable style={{...commonStyle.commonButton.button,...style}} onPress={onpress} disabled={disabled}>
       {icon ? icon : ""}<Text style={{...commonStyle.commonButton.text,...textStyle}}>{title}</Text>
    </Pressable>
  )
}

export default CommonButton