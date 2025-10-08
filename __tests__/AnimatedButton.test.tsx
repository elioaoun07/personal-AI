import React from 'react'
import { render } from '@testing-library/react-native'
import { AnimatedButton } from '../components/AnimatedButton'

describe('AnimatedButton', () => {
  it('renders correctly', () => {
    const mockPress = jest.fn()
    const { getByText } = render(
      <AnimatedButton title="Test Button" onPress={mockPress} />
    )
    
    expect(getByText('Test Button')).toBeTruthy()
  })

  it('calls onPress when pressed', () => {
    const mockPress = jest.fn()
    const { getByText } = render(
      <AnimatedButton title="Test Button" onPress={mockPress} />
    )
    
    getByText('Test Button').props.onPress()
    expect(mockPress).toHaveBeenCalled()
  })
})