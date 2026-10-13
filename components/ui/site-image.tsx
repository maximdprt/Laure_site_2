import type { ComponentProps } from "react";
import { imageExists } from "@/lib/images";
import { Media } from "./media";

/** Version serveur de <Media> : vérifie automatiquement la présence du fichier */
export function SiteImage(props: Omit<ComponentProps<typeof Media>, "available">) {
  return <Media {...props} available={imageExists(props.imageKey)} />;
}
