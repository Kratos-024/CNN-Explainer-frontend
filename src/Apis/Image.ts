import type { DropoutResponse } from "../../public/constants/typeData";

const api_uri = "https://therianthropic-billie-dubitative.ngrok-free.dev";

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

/**
 * Generates headers required for ngrok and content handling.
 * Note: When using FormData, we do NOT set Content-Type manually
 * so the browser can append the boundary string automatically.
 */
const getHeaders = (isJson = false): HeadersInit => {
  const headers: Record<string, string> = {
    "ngrok-skip-browser-warning": "true",
  };

  if (isJson) {
    headers["Content-Type"] = "application/json";
  }

  return headers;
};

const classifyNdRGB = async (
  formData: FormData,
): Promise<ImageResponse | undefined> => {
  try {
    const response = await fetch(`${api_uri}/classify`, {
      method: "POST",
      headers: getHeaders(false), // No Content-Type for FormData
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
  formData: FormData,
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
  imgs: string[],
): Promise<dropoutProp | undefined> => {
  try {
    const response = await fetch(`${api_uri}/applyDropout`, {
      method: "POST",
      headers: getHeaders(true), // Set Content-Type: application/json
      body: JSON.stringify({ Img: imgs }),
    });
    if (!response.ok) throw new Error("Network response was not ok");
    return await response.json();
  } catch (error) {
    console.error("Dropout Error:", error);
    return undefined;
  }
};

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
export type { ImageResponse };
