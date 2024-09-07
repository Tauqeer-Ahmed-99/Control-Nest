import Container from "@/components/Container";
import LoadingSkeleton from "@/components/LoadingSkeleton";

export default function Home() {
  return (
    <Container>
      {[...new Array(6)].map((_, idx) => (
        <LoadingSkeleton key={idx} borderRadius={12} />
      ))}
    </Container>
  );
}
