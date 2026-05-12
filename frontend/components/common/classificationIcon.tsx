import Classification from "@/types/classification";

interface Props {
  classification?: Classification;
  className?: string;
  size?: number;
}

interface SvgProps {
  size?: number;
  radius?: number;
}

const defaultSize = 31;
const defaultRadius = 2;

const ClassificationIcon = ({ classification, size }: Props) => {
  if (!classification) {
    return null;
  }

  switch (classification) {
    case Classification.HILLY:
      return <HillySvg size={size} />;
    case Classification.MEDIUM_MOUNTAIN:
      return <MediumMountainSvg size={size} />;
    case Classification.HIGH_MOUNTAIN:
      return <HighMountainSvg size={size} />;
    case Classification.TT:
      return <TTSvg size={size} />;
    case Classification.TTT:
      return <TTSvg size={size} />;
    case Classification.PROLOGUE:
      return <TTSvg size={size} />;
    case Classification.FLAT:
      return <FlatSvg size={size} />;
  }
};

export default ClassificationIcon;

const FlatSvg = ({ size = defaultSize, radius = defaultRadius }: SvgProps) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g clipPath="url(#clip0_16_313)">
        <rect width="24" height="24" rx={radius} fill="#313160" />
        <rect opacity="0.5" y="14" width="24" height="10" fill="#05DF72" />
        <path d="M0 14H25.8674" stroke="#05DF72" strokeWidth="2.5" />
      </g>
      <defs>
        <clipPath id="clip0_16_313">
          <rect width="24" height="24" rx={radius} fill="white" />
        </clipPath>
      </defs>
    </svg>
  );
};

const HillySvg = ({ size = defaultSize, radius = defaultRadius }: SvgProps) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g clipPath="url(#clip0_16_316)">
        <rect width="24" height="24" rx={radius} fill="#313160" />
        <path
          opacity="0.5"
          fillRule="evenodd"
          clipRule="evenodd"
          d="M18.137 15.372C16.5781 13.9742 13.0735 13 9 13C5.0418 13 1.62072 13.9199 0 15.2543V18.7456V24H24V19.0715V15.9285C23.175 15.3621 21.9136 15 20.5 15C19.6333 15 18.8238 15.1361 18.137 15.372Z"
          fill="#FDC700"
        />
        <path
          d="M-2 18C-0.49697 16.4127 3.52364 13.0476 7.58182 12.2857C12.6545 11.3333 13.2182 15.619 20.5455 15.619C26.4073 15.619 28.6242 10.5397 29 8"
          stroke="#FDC700"
          strokeWidth="2.5"
        />
      </g>
      <defs>
        <clipPath id="clip0_16_316">
          <rect width="24" height="24" rx={radius} fill="white" />
        </clipPath>
      </defs>
    </svg>
  );
};

const MediumMountainSvg = ({
  size = defaultSize,
  radius = defaultRadius,
}: SvgProps) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g clipPath="url(#clip0_16_319)">
        <rect width="24" height="24" rx={radius} fill="#313160" />
        <path
          opacity="0.5"
          d="M12.861 10.15C12.3256 10.054 11.7214 10 11.0821 10C10.4428 10 9.83868 10.054 9.30327 10.15L7.32573 11.9049L-2 20.1808C0.552707 25.9851 6.04551 30 12.4099 30C18.1598 30 23.1983 26.7229 26 21.8099L14.8385 11.9049L12.861 10.15Z"
          fill="#FF8904"
        />
        <path
          d="M-1 19L9.91379 10.0269C10.6423 9.42794 11.6903 9.41931 12.4285 10.0062L25 20"
          stroke="#FF8904"
          strokeWidth="2"
        />
      </g>
      <defs>
        <clipPath id="clip0_16_319">
          <rect width="24" height="24" rx={radius} fill="white" />
        </clipPath>
      </defs>
    </svg>
  );
};

const HighMountainSvg = ({
  size = defaultSize,
  radius = defaultRadius,
}: SvgProps) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g clipPath="url(#clip0_16_322)">
        <rect width="24" height="24" rx={radius} fill="#313160" />
        <path
          opacity="0.5"
          d="M13 19.5L18 7L25.7942 24.0526H14.2746L14.7942 25H-2L6.99999 10.7895L13 19.5Z"
          fill="#FF6467"
        />
        <path
          d="M-2 24L6.06276 10.5621C6.46874 9.88543 7.46179 9.92357 7.81468 10.6294L11.8909 18.7817C12.2934 19.5867 13.4713 19.4918 13.7398 18.6328L17.0642 7.99455C17.3549 7.06447 18.6685 7.05702 18.9697 7.98374L24.5 25"
          stroke="#FF6467"
          strokeWidth="2.5"
        />
      </g>
      <defs>
        <clipPath id="clip0_16_322">
          <rect width="24" height="24" rx={radius} fill="white" />
        </clipPath>
      </defs>
    </svg>
  );
};

const TTSvg = ({ size = defaultSize, radius = defaultRadius }: SvgProps) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect width="24" height="24" rx={radius} fill="#313160" />
      <circle cx="12" cy="14" r="6" fill="#50A2FF" />
      <rect x="11" y="6" width="2" height="3" fill="#50A2FF" />
      <rect x="9" y="5" width="6" height="2" rx="1" fill="#50A2FF" />
      <path
        d="M14.7071 11.3787C14.3166 10.9882 14.3166 10.355 14.7071 9.96447L15.9645 8.70711C16.355 8.31658 16.9882 8.31658 17.3787 8.70711C17.7692 9.09763 17.7692 9.7308 17.3787 10.1213L16.1213 11.3787C15.7308 11.7692 15.0976 11.7692 14.7071 11.3787Z"
        fill="#50A2FF"
      />
      <rect x="11" y="10" width="2" height="5" rx="1" fill="#313160" />
    </svg>
  );
};
