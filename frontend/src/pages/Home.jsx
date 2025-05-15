import ExpenseForm from '../components/ExpenseForm';

export default function Home() {
  return (
    <div className="min-h-screen bg-white px-4">
      <h1 className="text-3xl text-center mt-8 font-bold text-indigo-700">spLITTY – AI Bill Splitter</h1>
      <ExpenseForm />
    </div>
  );
}