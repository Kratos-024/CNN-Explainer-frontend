import { useEffect, useState } from "react";
import { CiCircleChevLeft, CiCircleChevRight } from "react-icons/ci";
import { ImCancelCircle } from "react-icons/im";
const InfoArr = [
  {
    title: "Convolutional Neural Network (CNN)",
    description:
      "A specialized deep learning architecture designed to process grid-like data, such as images. It mimics how the human visual cortex detects features like edges and textures.",
  },
  {
    title: "Input Layer (RGB Channels)",
    description:
      "The entry point of the network. You see this as the three colored blocks (Red, Green, Blue) at the start. Each block represents the intensity of that specific color across the image pixels.",
  },
  {
    title: "Tensor",
    description:
      "The fundamental data block you see moving through the network. While a standard image is 2D, deep learning treats it as a 3D block (Height × Width × Color Channels) of numerical values.",
  },
  {
    title: "Pixel Intensity",
    description:
      "The raw numbers inside the Input Layer tensors. These usually range from 0 (black) to 255 (white), representing how bright the pixel is at that specific location.",
  },
  {
    title: "Convolution Operation",
    description:
      "The core mathematical process. A small filter slides over the input image, multiplying pixel values and summing them up to create a single new pixel in the next layer.",
  },
  {
    title: "Kernel (Filter)",
    description:
      "The small 'window' that slides across the image during convolution. Each kernel is trained to look for a specific shape, such as a vertical line, a curve, or a corner.",
  },
  {
    title: "Feature Map",
    description:
      "The gray boxes you see after a convolution. These are not the original image anymore; they are 'maps' highlighting where specific features (found by the Kernels) exist in the image.",
  },
  {
    title: "Stride",
    description:
      "The distance the Kernel moves at each step. A larger stride means the filter skips pixels, which results in a smaller Feature Map output.",
  },
  {
    title: "Padding",
    description:
      "A technique of adding a border of 'zero' value pixels around the image. This allows the Kernel to process the edges of the image properly so the output size doesn't shrink too fast.",
  },
  {
    title: "Bias",
    description:
      "A learnable constant added to the result of the convolution. It allows the model to shift the activation function left or right, giving it flexibility to fit the data better.",
  },
  {
    title: "Activation Function",
    description:
      "A mathematical gate that decides if a neuron should 'fire' or not. Without this, the entire neural network would just be one big linear regression model.",
  },
  {
    title: "ReLU (Rectified Linear Unit)",
    description:
      "represented by the layer with the **Red Dashed Box**. It is a filter that forces all negative values to become zero, introducing necessary non-linearity into the model.",
  },
  {
    title: "Why ReLU Matters",
    description:
      "By removing negative values (blacking them out), ReLU helps the network focus only on the positive 'matches' found by the convolution, ignoring the irrelevant background noise.",
  },
  {
    title: "Dropout",
    description:
      "Represented by the **dashed lines** and fading connections. This technique randomly turns off neurons during training to force the network to become more robust and not rely on any single path.",
  },
  {
    title: "Regularization",
    description:
      "The concept behind Dropout. It prevents 'overfitting'—where the model memorizes the training images instead of actually learning to recognize general patterns.",
  },
  {
    title: "Pooling Layer",
    description:
      "A down-sampling operation. This reduces the height and width of the tensors to reduce computation power and control overfitting.",
  },
  {
    title: "Max Pooling",
    description:
      "The specific pooling method used here. It looks at a small patch (e.g., 2x2) and keeps only the highest number (the strongest feature), discarding the rest.",
  },
  {
    title: "Translation Invariance",
    description:
      "A benefit gained from Pooling. It ensures that the network recognizes a 'cat' whether the cat is in the top-left corner or the bottom-right corner of the image.",
  },
  {
    title: "Fully Connected Layer",
    description:
      "Often found at the end of the network. After extracting all the spatial features, this layer connects every single neuron to every neuron in the next layer to make the final classification decision.",
  },
  {
    title: "Tiny VGG Architecture",
    description:
      "The specific blueprint of this network. It uses a repeated pattern of 'Convolution -> ReLU -> Pooling', which is a classic and highly effective structure for deep learning vision tasks.",
  },
];
const FloatingModal = ({
  setFloatingModal,
}: {
  setFloatingModal: (value: boolean) => void;
}) => {
  const [index, setIndex] = useState<number>(0);
  const [info, setInfo] = useState<{
    description: string;
    title: string;
  }>({ description: InfoArr[index].description, title: InfoArr[index].title });
  useEffect(() => {
    setInfo({
      description: InfoArr[index].description,
      title: InfoArr[index].title,
    });
  }, [index]);
  return (
    <div className="absolute bottom-6 end-6 z-50">
      <div className="relative w-full max-w-105 bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
        <div className="flex justify-between items-start mb-3">
          <h2 className="text-lg font-bold text-gray-900"> {info.title}</h2>
          <button
            onClick={() => {
              setFloatingModal(false);
            }}
          >
            <ImCancelCircle className="w-6 h-6 cursor-pointer hover:fill-red-500" />
          </button>
        </div>

        <div
          key={index}
          className="text-[15px] leading-relaxed text-gray-600 mb-8"
        >
          <p>{info.description}</p>
        </div>

        <div className="flex items-center justify-between mt-auto">
          <button
            onClick={() => {
              if (index > 0) {
                setIndex(index - 1);
              } else {
                setIndex(InfoArr.length - 1);
              }
            }}
            className=" flex items-center justify-center p-2 text-gray-600
          rounded-full  "
          >
            <CiCircleChevLeft className="w-8 h-8 cursor-pointer hover:fill-blue-500" />
          </button>

          <button
            onClick={() => {
              if (index < InfoArr.length - 1) {
                setIndex(index + 1);
              } else {
                setIndex(0);
              }
            }}
            className=" flex items-center justify-center p-2 text-gray-600
          rounded-full  "
          >
            <CiCircleChevRight className="w-8 h-8 cursor-pointer hover:fill-blue-500" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default FloatingModal;
