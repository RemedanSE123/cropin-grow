'use client';

interface KPIs {
  repTotalDAs: number;
  repTotalData: number;
  globalTotalDAs: number;
  globalTotalData: number;
}

export default function KPICards({ kpis }: { kpis: KPIs }) {
  const cards = [
    {
      title: 'My DA Users',
      value: kpis.repTotalDAs,
      color: 'bg-blue-500',
      icon: '👥',
    },
    {
      title: 'My Total Data Collected',
      value: kpis.repTotalData.toLocaleString(),
      color: 'bg-green-500',
      icon: '📊',
    },
    {
      title: 'Total DA Users (All Reps)',
      value: kpis.globalTotalDAs,
      color: 'bg-purple-500',
      icon: '🌍',
    },
    {
      title: 'Total Data Collected (All Reps)',
      value: kpis.globalTotalData.toLocaleString(),
      color: 'bg-orange-500',
      icon: '📈',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {cards.map((card, index) => (
        <div
          key={index}
          className={`${card.color} rounded-lg shadow-lg p-6 text-white transform transition hover:scale-105`}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/80 text-sm font-medium">{card.title}</p>
              <p className="text-3xl font-bold mt-2">{card.value}</p>
            </div>
            <div className="text-4xl opacity-80">{card.icon}</div>
          </div>
        </div>
      ))}
    </div>
  );
}

