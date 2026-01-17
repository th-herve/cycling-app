import { cn } from "@/lib/utils";

interface Props {
  countryCode: string;
  squared?: boolean;
  className?: string;
}

const unknownFlagCode = "xx";

/*
 * Uses alpha-2 country code
 */
const CountryIcon = ({ countryCode, squared = false, className }: Props) => {
  let code;

  if (!countryCode) {
    code = unknownFlagCode;
  } else {
    code = countryCode.toLowerCase().trim();
  }

  return (
    <div className={className}>
      <span className={cn(`fi fi-${code}`, { fis: squared })}></span>
    </div>
  );
};

export default CountryIcon;
