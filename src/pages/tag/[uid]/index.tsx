import type { GetServerSideProps, NextPage } from 'next'
import { useEffect } from 'react'
import {
  PostsByFeed,
  PostsByFeedQuery,
  PostsByTagQuery,
} from '../../../entities/posts'
import { PostsByTag } from '../../../entities/posts/model/__generated__/PostsByTag'
import { initializeApollo, Post } from '../../../shared/api'

type Props = {
  postsByFeed: Pick<Post, 'uid' | 'title' | 'previewUrl' | 'createdAt'>[]
}

const FeedByTagPage: NextPage<Props> = (props) => {
  const apolloClient = initializeApollo()

  const qwe = async () => {
    const {
      data: {
        postsByTag: { items: postsByTag },
      },
    } = await apolloClient.query<PostsByTag>({
      variables: { uid: 'e97e366d-d164-40b9-aa6d-e4e86566d4cc', perPage: 250 },
      query: PostsByTagQuery,
    })
  }

  useEffect(() => {
    qwe()
  }, [])
  return null
}

export const getServerSideProps: GetServerSideProps<Props> = async ({
  query,
}) => {
  const currentTagUid: string = query.uid?.toString() ?? ''
  const apolloClient = initializeApollo()

  const {
    data: {
      postsByFeed: { items: postsByFeed },
    },
  } = await apolloClient.query<PostsByFeed>({
    variables: { uid: currentTagUid, perPage: 250 },
    query: PostsByFeedQuery,
  })

  return { props: { postsByFeed } }
}

export default FeedByTagPage
