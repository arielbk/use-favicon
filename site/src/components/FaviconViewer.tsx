type Props = {
  faviconSvg: string | null;
};

export default function FaviconViewer({ faviconSvg }: Props) {
  return (
    <div>
      {' '}
      {faviconSvg ? (
        <img
          src={`data:image/svg+xml,${faviconSvg}`}
          width={256}
          height={256}
        />
      ) : null}
    </div>
  );
}
