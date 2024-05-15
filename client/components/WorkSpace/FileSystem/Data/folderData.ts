export interface Explorer {
  id: string;
  name: string;
  isFolder: boolean;
  items: Explorer[];
  responseText: string;
  key: string;
}
export const defaultExplorer: Explorer = {
  id: "1",
  name: "root",
  isFolder: true,
  items: [],
  responseText: "",
  key: "",
};
