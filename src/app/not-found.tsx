import Link from "next/link";
import { Button } from "@/components/ui/button";
import Image from "next/image";

export default function NotFound() {
  return (
    <div className="container mx-auto min-h-[80vh] flex flex-col items-center justify-center px-4 text-center">
      <h1 className="text-6xl font-bold text-primary mb-6">404</h1>
      <h2 className="text-4xl font-bold text-white mb-6">Not Found</h2>
      <p className="text-gray-400 max-w-md text-lg mb-8">
        The page you're looking for doesn't exist
      </p>
      <Image
        src="/images/half-life-scientist-hl.gif"
        width={0}
        height={0}
        sizes="100vw"
        style={{
          width: "30em"
        }}
        unoptimized
        className="w-auto mb-8" alt={"a half life scientist is holding a taco in his hand and chewing outrageously fast."}      />
      <Button asChild size="lg" className="bg-primary hover:bg-primary/80">
        <Link href="/">
          Return to home
        </Link>
      </Button>
    </div>
  );
}
