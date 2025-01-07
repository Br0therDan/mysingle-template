
import { Image } from '@chakra-ui/react'
import { Link } from '@tanstack/react-router'

export default function Logo() {
  return (
    <Link to="/">
        <Image
            src="/images/logo_sq_dark.png"
            alt="Logo"
            width={40}
            height={40}
          />
    </Link>
  )
}
