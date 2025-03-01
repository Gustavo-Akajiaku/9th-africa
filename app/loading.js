const LoadingScreen = () => {
  return (
    <div className="w-full h-full flex justify-center bg-black items-center loading-modal">
      <div className="rounded-2xl p-8 bg-black">
        <div className="loader border-red-600 border-t-red-950"></div>
      </div>
    </div>
  );
};

export default LoadingScreen;
