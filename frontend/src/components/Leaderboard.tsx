"use client";

export interface RecordData {
  id: string;
  participant_name: string;
  time_ms: number;
}

interface LeaderboardProps {
  records: RecordData[];
  loading: boolean;
}

export default function Leaderboard({ records, loading }: LeaderboardProps) {
  const formatTime = (ms: number) => {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    const milliseconds = Math.floor(ms % 1000);

    return `${minutes > 0 ? `${minutes}:` : ""}${
      seconds < 10 && minutes > 0 ? "0" : ""
    }${seconds}.${milliseconds.toString().padStart(3, "0")}`;
  };

  return (
    <div className="bg-gray-900 rounded-2xl shadow-xl border border-gray-800 overflow-hidden w-full max-w-2xl mx-auto">
      <div className="bg-gray-800 px-6 py-4 border-b border-gray-700">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-yellow-500" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1.323l3.954 1.582 1.599-.8a1 1 0 01.894 1.79l-1.233.616 1.738 5.42a1 1 0 01-.285 1.05A3.989 3.989 0 0115 15a3.984 3.984 0 01-2.673-1.033c-.113.056-.231.104-.354.142A3.99 3.99 0 0110 15a3.99 3.99 0 01-1.973-.909A3.989 3.989 0 015 15a3.989 3.989 0 01-2.673-1.033 1 1 0 01-.285-1.05l1.738-5.42-1.233-.617a1 1 0 01.894-1.788l1.599.799L9 4.323V3a1 1 0 011-1zm-5.165 9.913l.8 2.5c.54.086 1.126.134 1.765.134.64 0 1.226-.048 1.765-.134l.8-2.5-2.565 1.282-2.565-1.282zM10 13l2.565-1.282-1.599-.799L10 12.083l-1.599-1.164-1.599.799L10 13z" clipRule="evenodd" />
          </svg>
          Leaderboard
        </h2>
      </div>

      <div className="p-0">
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500"></div>
          </div>
        ) : records.length === 0 ? (
          <div className="text-center py-12 text-gray-400">
            Belum ada rekor tersimpan.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-800/50 text-gray-400 text-sm uppercase tracking-wider">
                  <th className="px-6 py-3 font-medium">Peringkat</th>
                  <th className="px-6 py-3 font-medium">Nama Peserta</th>
                  <th className="px-6 py-3 font-medium text-right">Waktu</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800">
                {records.map((record, index) => (
                  <tr 
                    key={record.id} 
                    className={`hover:bg-gray-800/50 transition-colors ${index === 0 ? 'bg-yellow-900/10' : ''}`}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center justify-center w-8 h-8 rounded-full font-bold
                        ${index === 0 ? 'bg-yellow-500 text-yellow-900' : 
                          index === 1 ? 'bg-gray-300 text-gray-800' : 
                          index === 2 ? 'bg-amber-600 text-amber-100' : 'bg-gray-800 text-gray-400'}`}>
                        {index + 1}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-white font-medium">
                      {record.participant_name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right font-mono text-indigo-300 font-bold">
                      {formatTime(record.time_ms)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
