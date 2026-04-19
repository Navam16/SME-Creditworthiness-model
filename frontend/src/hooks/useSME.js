import { createContext, useContext } from 'react'

export const SMEContext = createContext(null)

export function useSME() {
  return useContext(SMEContext)
}
