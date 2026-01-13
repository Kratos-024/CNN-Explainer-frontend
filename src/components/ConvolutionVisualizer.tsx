import { useEffect, useMemo, useState } from "react";
import { ImCancelCircle } from "react-icons/im";

interface kernelProp {
  data: number[][];
}
interface CellDataProp {
  pixelValue: string;
  kernelValue: number;
  result: string;
}

interface inputProp {
  mode: string;
  imgSrc: string;
  resultImgSrc: string;
  autoPlaySpeed: number;
  kernel: kernelProp;
}
interface imageDataProp {
  data: Float32Array | null;
  width: number;
  height: number;
}
const getPixelValue = (
  data: Float32Array,
  width: number,
  height: number,
  x: number,
  y: number
) => {
  if (x > width || y > height) {
    return 0;
  }
  const i = (y * width + x) * 4;
  return (data[i] * 0.3 + data[i + 1] * 0.59 + data[i + 2] * 0.11) / 128;
};
export const ConvolutionVisualizer = ({
  mode,

  imgSrc,
  resultImgSrc,
  autoPlaySpeed = 500,
  kernel,
}: inputProp) => {
  const [hoverPos, setHoverPos] = useState<{ x: number; y: number }>({
    x: 1,
    y: 1,
  });
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [isLoaded, setIsLoaded] = useState<boolean>(false);
  const [imgData, setImageData] = useState<imageDataProp>({
    data: null,
    width: 0,
    height: 0,
  });

  // generating random number cuz it easy
  useEffect(() => {
    const width = 632;
    const height = 632;
    const channels = 4;
    const buff: Float32Array = new Float32Array(width * height * channels);
    for (let i = 0; i < buff.length; i++) {
      buff[i] = Math.random() * 510 - 255;
    }
    setImageData({ data: buff, width: width, height: height });
    setIsLoaded(true);
  }, [imgSrc]);

  // calculating the pos
  useEffect(() => {
    if (!(isLoaded && imgData.width > 0 && !isPaused)) {
      return;
    }
    setInterval(() => {
      setHoverPos((prev) => {
        const maxX = imgData.width - 2;
        const maxY = imgData.height - 2;
        let nextX = prev.x + 1;
        let nextY = prev.y;

        if (nextX > maxX) {
          nextX = 1;
          nextY += 1;
        }

        if (nextY > maxY) {
          nextX = 1;
          nextY = 1;
        }

        return { x: nextX, y: nextY };
      });
    }, autoPlaySpeed);
  }, [isPaused, isLoaded, imgData, autoPlaySpeed]);
  const handleMouseEnter = () => {
    setIsPaused(true);
  };
  const handleMouseLeave = () => {
    setIsPaused(false);
  };
  // Mouse pos
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const tarRect = e.currentTarget.getBoundingClientRect();

    const x = e.clientX - tarRect.left;
    const y = e.clientY - tarRect.top;

    const gridX = Math.floor((x / tarRect.width) * imgData.width);
    const gridY = Math.floor((y / tarRect.height) * imgData.height);

    const maxX = imgData.width - 2;
    const maxY = imgData.height - 2;

    if (gridX >= 1 && gridX <= maxX && gridY >= 1 && gridY <= maxY) {
      setHoverPos({ x: gridX, y: gridY });
    }
  };
  const mathGrid = useMemo(() => {
    if (!isPaused) {
      setIsPaused(true);
    }
    if (!imgData.data) {
      return { sum: "0.00", grid: [] };
    }
    let sum = 0;
    const grid: CellDataProp[] = [];

    for (let i = -1; i <= 1; i++) {
      for (let j = -1; j <= 1; j++) {
        const kernelVal = kernel.data[i + 1][j + 1];

        const pixelVal = getPixelValue(
          imgData.data,
          imgData.width,
          imgData.height,
          hoverPos.x + j,
          hoverPos.y + i
        );

        const result = pixelVal * kernelVal;
        sum += result;

        grid.push({
          pixelValue: pixelVal.toFixed(2),
          kernelValue: kernelVal,
          result: result.toFixed(2),
        });
      }
    }
    return { grid, sum: sum.toFixed(2) };
  }, [hoverPos, imgData, kernel]);
  const reluInputVal = parseFloat(mathGrid.sum);
  const reluResultVal = Math.max(0, reluInputVal).toFixed(2);
  const isNegative = reluInputVal < 0;
  if (!isLoaded || !imgData.data) {
    return <div> Loading convolution ...</div>;
  }

  return (
    <div className="max-w-5xl mx-auto bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden mt-10">
      <div className=" absolute right-5 top-12.75 cursor-pointer">
        <ImCancelCircle />
      </div>
      <div className="p-8 flex flex-col md:flex-row items-center justify-center gap-8 md:gap-12">
        <div className="flex flex-col items-center">
          <h3 className="text-xl text-gray-600 mb-2">
            Input ({imgData.width}, {imgData.height})
          </h3>
          <div
            className="relative  cursor-crosshair group"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            onMouseMove={handleMouseMove}
            style={{ width: "230px", height: "230px" }}
          >
            <img
              src={imgSrc}
              alt="Input"
              className="w-full h-full object-cover   rendering-pixelated select-none"
              style={{ imageRendering: "pixelated" }}
            />
            {isLoaded && (
              <div
                className="absolute border-2
                 grid grid-cols-3 grid-rows-3 pointer-events-none
                 transition-all duration-100 ease-linear"
                style={{
                  width: `${(54 / imgData.width) * 100}%`,
                  height: `${(54 / imgData.height) * 100}%`,
                  left: `${((hoverPos.x - 1) / (imgData.width + 50)) * 100}%`,
                  top: `${((hoverPos.y - 1) / (imgData.height + 50)) * 100}%`,
                  boxShadow: "0 0 0 1px rgba(255, 255, 255, 0.5)",
                }}
              >
                {[...Array(9)].map((_, i) => (
                  <div key={i} className="border border-gray-500/30"></div>
                ))}
              </div>
            )}
          </div>
          {mode == "Kernel Mul" && (
            <div className=" flex flex-col items-center gap-5">
              <div className="flex flex-col items-center justify-center mt-6 gap-6">
                <div className="grid grid-cols-3 gap-y-2 gap-x-1">
                  {mathGrid.grid.map((cell, idx) => (
                    <div key={idx} className="flex items-center gap-1 text-xs">
                      <div className="flex flex-col items-center">
                        <div className="w-10 h-10 flex items-center justify-center bg-slate-200 border-2 border-slate-300 rounded text-slate-700 font-semibold shadow-sm transition-colors duration-200">
                          {cell.pixelValue}
                        </div>
                        <div className="text-[10px] text-teal-700 bg-teal-100 px-1 rounded -mt-1 z-10 border border-teal-200">
                          × {cell.kernelValue}
                        </div>
                      </div>

                      <span className="text-gray-400 font-bold">
                        {(idx + 1) % 3 === 0 ? (idx === 8 ? "=" : "+") : "+"}
                      </span>
                    </div>
                  ))}
                </div>{" "}
              </div>
              <div className="w-12 h-12 flex items-center justify-center bg-sky-200 border-2 border-sky-400 text-sky-900 font-bold rounded shadow-md text-sm transition-all duration-200 transform scale-100">
                {mathGrid.sum}
              </div>
            </div>
          )}
        </div>
        {mode == "Relu" && (
          <div>
            {" "}
            <div className=" mb-4 text-lg  text-center">ReLU</div>
            <div className="flex  items-center gap-5">
              <div className="flex items-center gap-1 text-xs">
                <span className=" text-xl">Max ( </span>
                <div className="flex gap-2 items-center">
                  <div className="w-10 h-10 flex items-center justify-center bg-slate-200 border-2 border-slate-300 rounded text-slate-700 font-semibold shadow-sm transition-colors duration-200">
                    0
                  </div>
                  <p className=" mt-4">,</p>
                  <div
                    className={`w-10 h-10 flex items-center justify-center bg-slate-200 border-2 border-slate-300 rounded  font-semibold shadow-sm transition-colors duration-200
                 ${isNegative ? "text-red-700" : "text-slate-700"}  `}
                  >
                    {reluInputVal}
                  </div>
                </div>
                <span className=" text-xl"> )</span>
              </div>{" "}
              <span className=" text-xl"> = </span>
              <div className="w-12 h-12 flex items-center justify-center bg-sky-200 border-2 border-sky-400 text-sky-900 font-bold rounded shadow-md text-sm transition-all duration-200 transform scale-100">
                {reluResultVal}
              </div>
            </div>
          </div>
        )}
        <div className="flex flex-col items-center">
          <h3 className="text-xl text-gray-600 mb-2">
            Output ({imgData.width ? imgData.width - 2 : 28},{" "}
            {imgData.height ? imgData.height - 2 : 28})
          </h3>

          <div className="relative" style={{ width: "240px", height: "240px" }}>
            <img
              src={resultImgSrc}
              alt="Output"
              className="w-full h-full object-cover select-none opacity-60"
              style={{ imageRendering: "pixelated" }}
            />

            {isLoaded && (
              <div
                className="absolute border-2 border-black
                 bg-transparent pointer-events-none transition-all
                 duration-100 ease-linear"
                style={{
                  width: `${(18 / (imgData.width - 2)) * 100}%`,
                  height: `${(18 / (imgData.height - 2)) * 100}%`,
                  left: `${((hoverPos.x - 1) / (imgData.width + 18)) * 100}%`,
                  top: `${((hoverPos.y - 1) / (imgData.height + 18)) * 100}%`,
                }}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
