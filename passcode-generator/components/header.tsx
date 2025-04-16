import Image from "next/image"
import Link from "next/link"

export function Header() {
  return (
    <header className="border-b">
      <div className="container flex h-16 items-center justify-between px-4 md:px-6">
        <Link href="/" className="flex items-center gap-2">
          <Image src="/logo.png" alt="Baby Land Logo" width={50} height={50} className="rounded-full" />
          <span className="text-xl font-bold text-primary">Baby Land</span>
        </Link>
        <div className="flex items-center gap-4">
          <span className="text-sm font-medium">Passcode Generator</span>
        </div>
      </div>
    </header>
  )
}
