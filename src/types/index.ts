export interface IconMeta {
  mode: string;
  category: string;
  style: string;
  name: string;
  path: string;
}

export interface AnimatedIconMeta {
  category: string;
  name: string;
  path: string;
}

export type IconWithMeta = IconMeta | AnimatedIconMeta;

export interface SelectOption {
  value: string;
  label: string;
}
