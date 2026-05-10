import GamePage from "@/components/GamePage";

export default function BinaryPage() {
  return (
    <GamePage
      title="Binary Solving"
      subtitle="Pecahkan soal binary dalam waktu 1 menit! Waktu habis = GUGUR."
      apiPath="/api/binary-records"
      timeLimitMs={60000}
    />
  );
}
