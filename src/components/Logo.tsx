import Image from "next/image";

type LogoProps = {
  size?: number;
  showText?: boolean;
  subtitle?: string;
};

export default function Logo({ size = 40, showText = false, subtitle }: LogoProps) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: showText ? "12px" : 0 }}>
      <Image
        src="/favicon.svg"
        alt="Greymoon"
        width={size}
        height={size}
        priority
        style={{ objectFit: "contain", flexShrink: 0 }}
      />
      {showText && (
        <div>
          <p style={{ color: "white", fontWeight: "900", fontSize: size * 0.45, margin: 0, lineHeight: 1.1 }}>
            GREYMOON
          </p>
          {subtitle && (
            <p style={{ color: "#6b7280", fontSize: "11px", margin: "2px 0 0" }}>{subtitle}</p>
          )}
        </div>
      )}
    </div>
  );
}
