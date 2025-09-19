export default function Footer() {
  return (
    <footer className="border-t py-8 bg-accent/50">
      <div className="container mx-auto px-4">
        <p className="text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} ArtFestLive. A celebration of creativity.
        </p>
      </div>
    </footer>
  );
}
