import { useRouter } from 'next/router'
import { useCallback, useEffect, useState } from 'react'

const EMPTY_HASH = ' '

type UseHash = () => [string, (newHash: string) => void]
export const useHash: UseHash = () => {
  const { asPath } = useRouter()
  const [hash, setHash] = useState('')

  const hashChangeHandler = useCallback(() => {
    setHash(window.location.hash ? window.location.hash.slice(1) : '')
  }, [])

  useEffect(() => {
    window.addEventListener('hashchange', hashChangeHandler)
    return () => {
      window.removeEventListener('hashchange', hashChangeHandler)
    }
  }, [hashChangeHandler])

  useEffect(() => {
    setHash(asPath.split('#')[1] || '')
  }, [asPath])

  useEffect(() => {
    history.pushState(
      undefined,
      '',
      hash.trim() === '' ? EMPTY_HASH : `#${hash}`,
    )
  }, [hash])

  return [hash, setHash]
}
