import ScrollablePhotosGrid from './components/ScrollablePhotosGrid';

export default function Home() {
  return (
    <div className="flex flex-col items-center min-h-screen">
      <div className="py-20 text-center">
        <h1 className="text-4xl font-bold mb-4">opinionated.coffee</h1>
        <p className="text-xl max-w-2xl mx-auto">
          A curated list of coffees and our opinionated ways to make them.
        </p>
      </div>
    </div>
  );
}
