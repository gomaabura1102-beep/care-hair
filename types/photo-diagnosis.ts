export const hairPhotoDirections = ["front", "side", "back", "top", "other"] as const;

export type HairPhotoDirection = (typeof hairPhotoDirections)[number];

export type PreparedHairPhoto = {
  file: File;
  previewUrl: string;
  width: number;
  height: number;
};
