import { GameStateProvider } from "@/context/GameStateContext";
import { SocketProvider } from "@/context/socketContext"; // Import the SocketProvider
import "@/styles/globals.css";

export default function MyApp({ Component, pageProps }) {
  return (
    <GameStateProvider>
      <SocketProvider> {/* Wrap the app with the SocketProvider */}
        <Component {...pageProps} />
      </SocketProvider>
    </GameStateProvider>
  );
}

