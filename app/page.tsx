import Header from "./components/header/Header";

export default function Home() {
  return (
    <>
      <Header />
      <div className="flex items-center justify-center h-[calc(100vh-64px)]">
        <video
          src="/assets/videos/bg.mp4"
          autoPlay
          muted
          loop
          className="w-full h-full object-cover"
        />
      </div>
    </>
  );
}
