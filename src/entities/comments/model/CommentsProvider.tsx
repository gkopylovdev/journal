import { useIsTabletAndBelow } from '@razrabs-ui/responsive'
import { useRouter } from 'next/router'
import {
  createContext,
  Dispatch,
  FC,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'
import { useBoolean, useHash } from 'shared/lib'
import { commentAdapter } from '../lib/commentAdapter'
import { Comment, useCommentsLazyQuery } from '.'

export type CommentsContextValue = {
  opened: boolean
  comments: Comment[]
  postUid?: string
  setPostUid: Dispatch<string>
  openHandler: VoidFunction
  closeHandler: VoidFunction
}

export const CommentsContext = createContext<CommentsContextValue>({
  opened: false,
  comments: [],
  postUid: undefined,
  setPostUid: () => undefined,
  openHandler: () => undefined,
  closeHandler: () => undefined,
})

export const useContextComments = () => useContext(CommentsContext)

type Props = {
  children: ReactNode
}

export const CommentsProvider: FC<Props> = ({ children }) => {
  const router = useRouter()
  const isTabletAndBelow = useIsTabletAndBelow()

  const [commentsLazyQuery, { data, startPolling, stopPolling }] =
    useCommentsLazyQuery()
  const [postUid, setPostUid] = useState<string | undefined>(undefined)
  const [opened, { trusty: openCommentsHandler, falsy: closeCommentsHandler }] =
    useBoolean()
  const comments = useMemo(
    () => data?.comments.items.map((comment) => commentAdapter(comment)) || [],
    [data?.comments.items],
  )
  const [hash, updateHash] = useHash()

  const openHandler = useCallback(() => {
    if (isTabletAndBelow) {
      updateHash('comments')
    }

    openCommentsHandler()
  }, [isTabletAndBelow, openCommentsHandler, updateHash])

  const closeHandler = useCallback(() => {
    if (isTabletAndBelow) {
      updateHash('')
    }

    closeCommentsHandler()
  }, [isTabletAndBelow, closeCommentsHandler, updateHash])

  const value: CommentsContextValue = {
    opened,
    comments,
    postUid,
    setPostUid,
    openHandler,
    closeHandler,
  }

  useEffect(() => {
    if (hash === 'comments') {
      openCommentsHandler()
    } else {
      closeCommentsHandler()
    }
  }, [openCommentsHandler, closeCommentsHandler, hash])

  // Закрываем комменты, когда уходим со страницы
  useEffect(() => {
    closeHandler()
  }, [closeHandler, router.route])

  useEffect(() => {
    if (postUid) {
      commentsLazyQuery({
        variables: { postUid, perPage: 3_000 },
        fetchPolicy: 'no-cache',
      })
    }
  }, [commentsLazyQuery, opened, postUid])

  useEffect(() => {
    if (opened) {
      startPolling(1_000)
    }
    return () => stopPolling()
  }, [opened, startPolling, stopPolling])

  return (
    <CommentsContext.Provider value={value}>
      {children}
    </CommentsContext.Provider>
  )
}
