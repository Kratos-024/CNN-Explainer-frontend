<<<<<<< HEAD
import type { DropoutResponse } from "../../public/constants/typeData";

const api_uri = "http://localhost:8000";
=======
const api_uri = "https://therianthropic-billie-dubitative.ngrok-free.dev";

>>>>>>> c566a0ce414e14e068f1085d79d735075390eab7
interface ImageResponse {
  message: string;
  softMax_prob: string[];
  ImageR: string;
  ImageG: string;
  ImageB: string;
}

interface FeatDataResponse {
  success: boolean;
  data: {
    [key: string]: string[];
  };
  first_relu_images: string[];
}

interface dropoutProp {
  success: boolean;
  images: string[];
}
const getHeaders = (isJson = false) => {
<<<<<<< HEAD
  const headers: HeadersInit = {};
=======
  const headers: HeadersInit = {
    "ngrok-skip-browser-warning": "69420",
  };
>>>>>>> c566a0ce414e14e068f1085d79d735075390eab7
  if (isJson) {
    headers["Content-Type"] = "application/json";
  }
  return headers;
};

const classifyNdRGB = async (
<<<<<<< HEAD
  formData: FormData,
=======
  formData: FormData
>>>>>>> c566a0ce414e14e068f1085d79d735075390eab7
): Promise<ImageResponse | undefined> => {
  try {
    const response = await fetch(`${api_uri}/classify`, {
      method: "POST",
      headers: getHeaders(false),
      body: formData,
    });
    if (!response.ok) throw new Error("Network response was not ok");
    return await response.json();
  } catch (error) {
    console.error("Classify Error:", error);
    return undefined;
  }
};

const getimgData = async (
<<<<<<< HEAD
  formData: FormData,
=======
  formData: FormData
>>>>>>> c566a0ce414e14e068f1085d79d735075390eab7
): Promise<FeatDataResponse | undefined> => {
  try {
    const response = await fetch(`${api_uri}/getImageData`, {
      method: "POST",
      headers: getHeaders(false),
      body: formData,
    });
    if (!response.ok) throw new Error("Network response was not ok");
    return await response.json();
  } catch (error) {
    console.error("GetImageData Error:", error);
    return undefined;
  }
};

const applyDropout = async (
<<<<<<< HEAD
  imgs: string[],
=======
  imgs: string[]
>>>>>>> c566a0ce414e14e068f1085d79d735075390eab7
): Promise<dropoutProp | undefined> => {
  try {
    const response = await fetch(`${api_uri}/applyDropout`, {
      method: "POST",
      headers: getHeaders(true),
      body: JSON.stringify({ Img: imgs }),
    });
    if (!response.ok) throw new Error("Network response was not ok");
    return await response.json();
  } catch (error) {
    console.error("Dropout Error:", error);
    return undefined;
  }
};
<<<<<<< HEAD
const getDropoutEffectData = async (
  formData: FormData,
): Promise<DropoutResponse | undefined> => {
  try {
    const response = await fetch(`${api_uri}/getDropoutData`, {
      method: "POST",

      headers: getHeaders(false),
      body: formData,
    });
    if (!response.ok) throw new Error(`Server error: ${response.status}`);
    return await response.json();
  } catch (error) {
    console.error("Dropout API Error:", error);
    return undefined;
  }
};

export { classifyNdRGB, getDropoutEffectData, getimgData, applyDropout };
=======

export { classifyNdRGB, getimgData, applyDropout };
>>>>>>> c566a0ce414e14e068f1085d79d735075390eab7
export type { ImageResponse };
