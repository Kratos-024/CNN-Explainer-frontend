import { image } from "d3";
import { useEffect, useState } from "react";

interface kernelProp {
  data: number[][];
}
interface CellDataProp {
  pixelValue: number;
  kernelValue: string;
  result: number;
}

interface MathGridDataProp {
  CellData: CellDataProp[];
  sum: string;
}
interface inputProp {
  imgSrc: string;
  resultImgSrc: string;
  autoPlaySpeed: number;
  kernel: kernelProp;
}
interface imageDataProp {
  data: Float32Array | number;
  width: number;
  height: number;
}

export const ConvolutionVisualizer = ({
  imgSrc,
  resultImgSrc,
  autoPlaySpeed = 500,
  kernel,
}: inputProp) => {
  console.log(imgSrc, resultImgSrc, autoPlaySpeed, kernel);
  const [hoverPos, setHoverPos] = useState<{ x: number; y: number }>({
    x: 1,
    y: 1,
  });
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [isLoaded, setIsLoaded] = useState<boolean>(false);
  const [imgData, setImageData] = useState<imageDataProp>({
    data: 0,
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
    if (!isPaused || imgData.width > 0 || !isLoaded) return;
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

  return <div>Hii</div>;
};
