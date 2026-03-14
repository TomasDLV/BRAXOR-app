import {
  Wrench, Zap, Shield, Gauge, Layers, Mountain, Disc, Wind,
  Package, Settings, Anchor, Navigation, Tent, Radio, Lightbulb,
  Truck, Flame, Box, CircleDot, Battery, Compass, Crosshair,
  Cpu, Droplets, Sun, type LucideProps,
} from "lucide-react";

export const CATEGORY_ICONS: { name: string; label: string; Icon: React.FC<LucideProps> }[] = [
  { name: "Wrench",      label: "Mecánica",     Icon: Wrench },
  { name: "Disc",        label: "Llantas",      Icon: Disc },
  { name: "CircleDot",   label: "Neumáticos",   Icon: CircleDot },
  { name: "Gauge",       label: "Suspensión",   Icon: Gauge },
  { name: "Shield",      label: "Defensa",      Icon: Shield },
  { name: "Anchor",      label: "Winch",        Icon: Anchor },
  { name: "Zap",         label: "Iluminación",  Icon: Zap },
  { name: "Lightbulb",   label: "Luces",        Icon: Lightbulb },
  { name: "Wind",        label: "Snorkel",      Icon: Wind },
  { name: "Flame",       label: "Performance",  Icon: Flame },
  { name: "Truck",       label: "Camionetas",   Icon: Truck },
  { name: "Mountain",    label: "Off-Road",     Icon: Mountain },
  { name: "Tent",        label: "Camping",      Icon: Tent },
  { name: "Compass",     label: "Navegación",   Icon: Compass },
  { name: "Navigation",  label: "GPS",          Icon: Navigation },
  { name: "Crosshair",   label: "Precisión",    Icon: Crosshair },
  { name: "Battery",     label: "Eléctrico",    Icon: Battery },
  { name: "Cpu",         label: "Electrónica",  Icon: Cpu },
  { name: "Radio",       label: "Comunicación", Icon: Radio },
  { name: "Droplets",    label: "Hidráulico",   Icon: Droplets },
  { name: "Sun",         label: "Exterior",     Icon: Sun },
  { name: "Box",         label: "Cajones",      Icon: Box },
  { name: "Package",     label: "Repuestos",    Icon: Package },
  { name: "Layers",      label: "Accesorios",   Icon: Layers },
  { name: "Settings",    label: "General",      Icon: Settings },
];

export function CategoryIcon({
  name,
  size = 14,
  className,
}: {
  name: string | null | undefined;
  size?: number;
  className?: string;
}) {
  if (!name) return null;
  const found = CATEGORY_ICONS.find((i) => i.name === name);
  if (!found) return null;
  const { Icon } = found;
  return <Icon size={size} strokeWidth={2} className={className} />;
}
