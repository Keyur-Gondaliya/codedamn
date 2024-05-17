export type Playground = {
  id: string;
  title: string;
  description: string;
  dockerImage: string;
  image: string;
  isPreviewAvailable: boolean;
  exposedPort: number;
  initialCommand: string[];
  fileSnapshot: { key: string; isFolder: boolean }[];
};
export const playgrounds: Playground[] = [
  {
    id: "1",
    title: "React Playground",
    dockerImage: "keyurgondaliya403/react-codedamn",
    description: "React playground using vite",
    isPreviewAvailable: true,
    image:
      "https://wsrv.nl/?url=https%3A%2F%2Fcodedamn.com%2Fassets%2Fimages%2Fsvg%2Freact.svg&amp;w=48&amp;q=82&amp;output=webp",
    exposedPort: 3000,
    initialCommand: ["npm install", "npm run dev"],
    fileSnapshot: [
      { key: "/.eslintrc.cjs", isFolder: false },
      { key: "/README.md", isFolder: false },
      { key: "/index.html", isFolder: false },
      { key: "/package.json", isFolder: false },
      { key: "/public/vite.svg", isFolder: false },
      { key: "/src/App.css", isFolder: false },
      { key: "/src/App.jsx", isFolder: false },
      { key: "/src/assets/react.svg", isFolder: false },
      { key: "/src/index.css", isFolder: false },
      { key: "/src/main.jsx", isFolder: false },
      { key: "/vite.config.js", isFolder: false },
    ],
  },
  {
    id: "2",
    title: "Node.js Playground",
    description: "Node.js 18 playground",
    dockerImage: "keyurgondaliya403/node-codedamn",
    isPreviewAvailable: false,
    image:
      "https://wsrv.nl/?url=https%3A%2F%2Fcodedamn.com%2Fassets%2Fimages%2Fsvg%2Fnode.svg&w=48&q=82&output=webp",
    exposedPort: 3001,
    initialCommand: ["npm install"],
    fileSnapshot: [
      { key: "/index.js", isFolder: false },
      { key: "/package-lock.json", isFolder: false },
      { key: "/package.json", isFolder: false },
    ],
  },
  {
    id: "3",
    title: "Python Playground",
    description: "Python 3 playground",
    dockerImage: "keyurgondaliya403/python-codedamn",
    isPreviewAvailable: false,
    image:
      "https://wsrv.nl/?url=https%3A%2F%2Fcodedamn.com%2Fassets%2Fimages%2Fsvg%2Fpython.svg&w=48&q=82&output=webp",
    exposedPort: 3002,
    initialCommand: [],
    fileSnapshot: [{ key: "/app.py", isFolder: false }],
  },
];
export interface PlaygroundSessionInterface {
  _id: string;
  name: string;
  createId: string;
  user: string;
  playgroundTypeId: string;
  isDeleted: boolean;
  port: number;
  subDomain: string;
  sockedId: string;
  fileSnapshot: { key: string; isFolder: boolean }[];
  createdAt: string; // This should be a string representation of date, adjust accordingly
  updatedAt: string; // This should be a string representation of date, adjust accordingly
  __v: number;
}
