const LoadingOverlay = ({ message }: { message: string }) => {
  return (
    <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-white/80 backdrop-blur-sm transition-all duration-300">
      <div className=" text-center w-full max-w-md p-6">
        <p className="text-sm font-medium text-gray-500 animate-pulse">
          {message}
        </p>
      </div>
    </div>
  );
};
export default LoadingOverlay;
