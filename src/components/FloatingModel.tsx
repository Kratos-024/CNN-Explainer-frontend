import { useEffect, useState } from "react";
import { CiCircleChevLeft, CiCircleChevRight } from "react-icons/ci";
import { ImCancelCircle } from "react-icons/im";
const InfoArr = [
  {
    title: "Convolutional Neural Network (CNN)",
    description:
      "A type of machine learning classifier algorithm that excels at recognizing patterns in data, particularly for image classification tasks like identifying objects within an image.",
  },
  {
    title: "Neuron",
    description:
      "A basic unit of a neural network that functions as a mathematical operation, taking in multiple inputs and yielding a single output.",
  },
  {
    title: "Tensor",
    description:
      "An n-dimensional matrix. In the context of the CNN described, most tensors are 3-dimensional, with the exception of the output layer.",
  },
  {
    title: "Layer",
    description:
      "A collection of neurons that all perform the same operation and share the same hyperparameters.",
  },
  {
    title: "Kernel Weights & Biases",
    description:
      "Values tuned during the training phase that allow the classifier to adapt to the dataset. They are often visualized with diverging color scales.",
  },
  {
    title: "Input Layer",
    description:
      "The leftmost layer representing the image data entered into the CNN. For RGB images, this layer consists of three channels: red, green, and blue.",
  },
  {
    title: "Convolutional Layer",
    description:
      "The foundational layer of a CNN containing learned kernels that extract distinguishing features from images.",
  },
  {
    title: "Convolution Operation",
    description:
      "An elementwise dot product performed between a unique kernel and the output of the previous layer's neuron, summed with a learned bias.",
  },
  {
    title: "Padding",
    description:
      "A hyperparameter technique (often zero-padding) that conserves data at the borders of activation maps and helps preserve the input's spatial size.",
  },
  {
    title: "Kernel Size",
    description:
      "The dimensions of the sliding window over the input (e.g., 3x3). Smaller kernels can extract more local features and allow for deeper architectures.",
  },
  {
    title: "Stride",
    description:
      "A hyperparameter indicating how many pixels the kernel shifts at a time. Lower stride extracts more data, while higher stride leads to smaller output dimensions.",
  },
  {
    title: "ReLU (Rectified Linear Unit)",
    description:
      "An activation function that introduces non-linearity by disregarding all negative data (outputting zero for negative inputs) and keeping positive values unchanged.",
  },
  {
    title: "Importance of Non-linearity",
    description:
      "Without non-linear functions like ReLU, deep CNN architectures would mathematically devolve into a single linear layer, significantly reducing their performance.",
  },
  {
    title: "Softmax",
    description:
      "A function used in the output layer that scales model outputs (logits) so they sum to 1, effectively converting them into probabilities.",
  },
  {
    title: "Softmax vs. Standard Normalization",
    description:
      "Unlike standard rescaling, Softmax acts as a 'soft argmax,' weighing the maximum value significantly higher than others to provide a clearer signal for backpropagation.",
  },
  {
    title: "Pooling Layers",
    description:
      "Layers designed to gradually decrease the spatial extent of the network, thereby reducing parameters and overall computation.",
  },
  {
    title: "Max-Pooling",
    description:
      "A specific pooling operation that slides a kernel over the input and selects only the largest value at each slice, discarding other data to improve efficiency and avoid overfitting.",
  },
  {
    title: "Flatten Layer",
    description:
      "A layer that converts a multi-dimensional tensor (e.g., 3D) into a 1-dimensional vector to fit the input requirements of a fully-connected classification layer.",
  },
  {
    title: "Tiny VGG",
    description:
      "The specific network architecture used in CNN Explainer. It mimics state-of-the-art CNNs but on a smaller scale to make learning easier.",
  },
  {
    title: "CNN Explainer Technology",
    description:
      "The interactive visualization tool described is built using TensorFlow.js for in-browser GPU acceleration, Svelte as the framework, and D3.js for visualizations.",
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
