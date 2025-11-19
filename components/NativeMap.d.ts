import React from "react";
export interface NativeMapProps {
  activeLocation: {
    latitude: number;
    longitude: number;
    isCurrent: boolean;
    city?: string;
  };
  showRadar?: boolean;
}

declare const NativeMap: React.ComponentType<NativeMapProps>;
export default NativeMap;
