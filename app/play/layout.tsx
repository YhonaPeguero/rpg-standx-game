export default function PlayLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <div className="min-h-dvh px-4 py-4 md:px-8 md:py-8">{children}</div>;
}
