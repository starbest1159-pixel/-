'use client';

import BetForm from '../components/BetForm';

// Mock data for initial development
const mockRoundId = 1;
const mockUserCredit = 50000;
const mockIsBlocked = false;

export default function HomePage() {
  return (
    <main className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-2xl font-bold text-center mb-6">TH77 Prime</h1>
        <BetForm
          roundId={mockRoundId}
          userCredit={mockUserCredit}
          isBlocked={mockIsBlocked}
          onSuccess={() => console.log('Bet placed successfully')}
        />
      </div>
    </main>
  );
}
