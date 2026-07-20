import "./globals.css";

export const metadata = {
  title: "Exoplanet Detector — a neural network reads real Kepler starlight",
  description:
    "Choose a star from NASA's Kepler survey and let a convolutional neural network judge whether its light curve hides a transiting planet.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                var t = localStorage.getItem('theme');
                if (!t) t = 'dark';
                document.documentElement.setAttribute('data-theme', t);
              } catch (e) {}
            `,
          }}
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
