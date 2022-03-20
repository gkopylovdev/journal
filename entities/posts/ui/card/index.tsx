import styled from '@emotion/styled'
import { formatDistance } from 'date-fns'
import Link from 'next/link'
import { VFC } from 'react'
import { Image } from 'shared/ui'

const Title = styled.h2`
  font-size: 24px;
  line-height: 120%;

  margin: 10px 0;

  text-transform: uppercase;
  font-feature-settings: 'salt' on;

  color: ${({ theme }) => theme.colors.text.primary};
`

const StyledCard = styled.div`
  position: relative;
  cursor: pointer;

  a {
    color: ${({ theme }) => theme.colors.text.primary};
    text-decoration: none;
  }

  a:hover {
    text-decoration: none;
  }

  &:hover {
    ${Title} {
      text-decoration: underline;
    }
  }
`

const PublicationDate = styled.span`
  font-size: 12px;
  line-height: 100%;

  letter-spacing: 1px;
  text-transform: uppercase;
  font-feature-settings: 'salt' on;

  color: ${({ theme }) => theme.colors.text.secondary};
`

const StyledLink = styled.a`
  position: absolute;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
`

type PostCardProps = {
  uid: string
  previewUrl?: string | null
  title?: string
  publicationDate?: number
}
const PostCard: VFC<PostCardProps> = ({
  uid,
  previewUrl,
  title,
  publicationDate,
}) => (
  <Link passHref href={`/post/${uid}`}>
    <StyledCard>
      <Image alt={title} src={previewUrl} />

      <Title>{title}</Title>

      {publicationDate && (
        <PublicationDate>
          {formatDistance(new Date(), new Date(publicationDate))}
        </PublicationDate>
      )}

      <StyledLink />
    </StyledCard>
  </Link>
)

export { PostCard }
