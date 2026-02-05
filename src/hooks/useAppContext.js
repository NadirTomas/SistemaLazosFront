import { useContext } from 'react'
import { useOutletContext } from 'react-router-dom'
import AppContext from '../contexts/AppContext'

export default function useAppContext() {
  const context = useContext(AppContext)
  if (context) {
    return context
  }
  return useOutletContext()
}
