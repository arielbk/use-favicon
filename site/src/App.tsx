import useFavicon from 'use-favicon';

function App() {
  const { faviconSvg } = useFavicon();

  return (
    <div>
      {faviconSvg ? (
        <img src={`data:image/svg+xml,${faviconSvg}`} width={64} height={64} />
      ) : null}
    </div>
  );
}

export default App;
