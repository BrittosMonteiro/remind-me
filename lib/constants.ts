export enum CollectionColors {
  sunset = "bg-gradient-to-r from-red-500 to-orange-500",
  poppy = "bg-gradient-to-r from-rose-400 to-red-500",
  rosebud = "bg-gradient-to-r from-violet-500 to-purple-500",
}

export type CollectionColor = keyof typeof CollectionColors;
