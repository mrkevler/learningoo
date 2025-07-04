const Loader = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh]">
      <img
        src="/logo/logo-32.png"
        alt="Loading"
        className="h-12 w-12 animate-bounce mb-4"
      />
      <p className="text-brand font-medium">Loading...</p>
    </div>
  );
};

export default Loader;
