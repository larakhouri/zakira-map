import EventForm from '@/components/admin/EventForm'

export default function AdminPage() {
  return (
    <div className="min-h-screen bg-stone-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-slate-800">Zakira Data Entry</h1>
          <p className="text-slate-500 mt-2 text-sm">Add historical events to the database. Select a location and fill out the required information.</p>
        </header>
        
        <main>
          <EventForm />
        </main>
      </div>
    </div>
  )
}
