export type Playground = {
  id: string;
  title: string;
  description: string;
  dockerImage: string;
  image: string;
  isPreviewAvailable: boolean;
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
  },
  {
    id: "2",
    title: "Node.js Playground",
    description: "Node.js 18 playground",
    dockerImage: "keyurgondaliya403/node-codedamn",
    isPreviewAvailable: false,
    image:
      "https://wsrv.nl/?url=https%3A%2F%2Fcodedamn.com%2Fassets%2Fimages%2Fsvg%2Fnode.svg&w=48&q=82&output=webp",
  },
  {
    id: "3",
    title: "Python Playground",
    description: "Python 3 playground",
    dockerImage: "keyurgondaliya403/python-codedamn",
    isPreviewAvailable: false,
    image:
      "https://wsrv.nl/?url=https%3A%2F%2Fcodedamn.com%2Fassets%2Fimages%2Fsvg%2Fpython.svg&w=48&q=82&output=webp",
  },
];
