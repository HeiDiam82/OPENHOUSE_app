import GamePage from "@/components/GamePage";

export default function LogicGatePage() {
  return (
    <GamePage
      title="Logic Gate Trainer"
      subtitle="Selesaikan tantangan logic gate dalam waktu 3 menit! Waktu habis = GUGUR."
      apiPath="/api/logic-gate-records"
      timeLimitMs={180000}
    />
  );
}
