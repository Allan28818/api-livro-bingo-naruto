interface NinjaProps {
  id: string;
  name: string;
  country: string;
  age: number;
  style: "water" | "earth" | "wind" | "fire" | "wood" | "lightning";
}

// Módulos no .js
export { NinjaProps };
